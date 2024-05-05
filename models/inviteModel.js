const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Invite = sequelize.define(
    "invite",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "events",
          },
          key: "id",
        },
      },
      email_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      accepted: {
        allowNull: false,
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
        singular: "Invite",
        plural: "Invitees",
      },
    }
  );
  return Invite;
};
