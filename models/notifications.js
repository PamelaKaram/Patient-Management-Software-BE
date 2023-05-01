"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notifications.init(
    {
      type: DataTypes.STRING,
      user: DataTypes.INTEGER,
      time: DataTypes.DATE,
      description: DataTypes.STRING,
      emailSent: DataTypes.BOOLEAN,
      userUUID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "notifications",
    }
  );
  return notifications;
};
