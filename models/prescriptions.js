"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class prescriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  prescriptions.init(
    {
      name: DataTypes.STRING,
      medical_prescription: DataTypes.STRING,
      prescribedDate: DataTypes.DATE,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      
    },
    {
      sequelize,
      modelName: "prescriptions",
    }
  );
  return prescriptions;
};
