"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("appointments", "patientUUID", {
      type: Sequelize.UUID,
    });
    await queryInterface.addColumn("medical_conditions", "patientUUID", {
      type: Sequelize.UUID,
    });
    await queryInterface.addColumn("medicines", "patientUUID", {
      type: Sequelize.UUID,
    });
    await queryInterface.addColumn("notifications", "userUUID", {
      type: Sequelize.UUID,
    });
    await queryInterface.addColumn("patient_questions", "patientUUID", {
      type: Sequelize.UUID,
    });
    await queryInterface.addColumn("pharmacy_accesses", "patientUUID", {
      type: Sequelize.UUID,
    });
    await queryInterface.addColumn("pharmacy_accesses", "pharmacyUUID", {
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("appointments", "patientUUID");
    await queryInterface.removeColumn("medical_conditions", "patientUUID");
    await queryInterface.removeColumn("medicines", "patientUUID");
    await queryInterface.removeColumn("notifications", "userUUID");
    await queryInterface.removeColumn("patient_questions", "patientUUID");
    await queryInterface.removeColumn("pharmacy_accesses", "patientUUID");
    await queryInterface.removeColumn("pharmacy_accesses", "pharmacyUUID");
  },
};
