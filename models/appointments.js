"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class appointments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  appointments.init(
    {
      patientId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      time: DataTypes.TIME,
      description: DataTypes.STRING,
      patientUUID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "appointments",
    }
  );
  return appointments;
};
