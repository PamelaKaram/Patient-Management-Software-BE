'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medical_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  medical_history.init({
    patientId: DataTypes.INTEGER,
    cause: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'medical_history',
  });
  return medical_history;
};