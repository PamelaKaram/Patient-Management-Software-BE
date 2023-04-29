"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class patient_questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  patient_questions.init(
    {
      patientId: DataTypes.INTEGER,
      question: DataTypes.TEXT,
      answer: DataTypes.TEXT,
      isAnswered: DataTypes.BOOLEAN,
      patientUUID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "patient_questions",
    }
  );
  return patient_questions;
};
