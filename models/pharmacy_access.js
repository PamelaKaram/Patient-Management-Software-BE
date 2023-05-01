"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pharmacy_access extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pharmacy_access.init(
    {
      patientId: DataTypes.INTEGER,
      pharmacyId: DataTypes.INTEGER,
      hasAccess: DataTypes.BOOLEAN,
      patientUUID: DataTypes.UUID,
      pharmacyUUID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "pharmacy_access",
    }
  );
  return pharmacy_access;
};
