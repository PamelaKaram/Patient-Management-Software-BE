'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class appointment_requests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  appointment_requests.init({
    appointmentUUID: DataTypes.UUID,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.INTEGER,
    email: DataTypes.STRING,
    status: DataTypes.STRING,
    isResponded: DataTypes.BOOLEAN,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'appointment_requests',
  });
  return appointment_requests;
};