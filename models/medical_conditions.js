'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medical_conditions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  medical_conditions.init({
    patientId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    isCurrent: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'medical_conditions',
  });
  return medical_conditions;
};