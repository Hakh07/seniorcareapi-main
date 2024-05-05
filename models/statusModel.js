const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define(
    "status",
    {
      status: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      name: {
        singular: "status",
        plural: "statused",
      },
    }
  );
  return Status;
};
