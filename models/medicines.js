"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class medicines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  medicines.init(
    {
      medicine: DataTypes.STRING,
      isCurrent: DataTypes.BOOLEAN,
      description: DataTypes.STRING,
      frequency: DataTypes.INTEGER,
      foodTiming: DataTypes.STRING,
      prescriptionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "medicines",
    }
  );
  return medicines;
};
