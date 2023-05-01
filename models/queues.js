'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class queues extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  queues.init({
    beganProcessing: DataTypes.DATE,
    time: DataTypes.DATE,
    jobType: DataTypes.STRING,
    data: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'queues',
  });
  return queues;
};