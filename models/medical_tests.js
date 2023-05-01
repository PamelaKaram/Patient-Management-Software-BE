"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class medical_tests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  medical_tests.init(
    {
      patientUUID: DataTypes.UUID,
      filename: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "medical_tests",
    }
  );
  return medical_tests;
};
