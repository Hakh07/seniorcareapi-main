const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt"); // For password hashing
const jwtSecret = process.env.jwtSecret;
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          const salt = bcrypt.genSaltSync(10);
          this.setDataValue("password", bcrypt.hashSync(value, salt));
        },
      },
      otp: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      avatar: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      is_verified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      user_type: {
        type: DataTypes.ENUM,
        values: ["user", "caregiver"],
        defaultValue: "user",
      },
      phone_number: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      emergency_phone_number: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      address: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      receive_news: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      name: {
        singular: "user",
        plural: "users",
      },
    }
  );

  // Instance methods for password verification and token generation (optional)
  User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.generateAuthToken = async function () {
    const payload = { user: { id: this.id, email: this.email } }; // User data to include in token
    const options = { expiresIn: "365d" }; // Set token expiration time (e.g., 1 hour)
    const token = await jwt.sign(payload, jwtSecret, options);
    return token;
  };

  console.log(User === sequelize.models.User);

  return User;
};
