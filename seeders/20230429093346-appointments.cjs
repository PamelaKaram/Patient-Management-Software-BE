const { v4: uuidv4 } = require("uuid");

("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "appointments",
      [
        {
          patientId: 1,
          date: "2023-05-02",
          time: "14:30:00",
          description: "Checkup for flu symptoms",
          patientUUID: "f8d45f5e-b0bb-4b7f-9e36-8567b6244a4c",
        },
        {
          patientId: 2,
          date: "2023-05-03",
          time: "10:00:00",
          description: "Physical exam",
          patientUUID: "f476a3c9-1d9f-4293-9a88-3b2f29a8ccf2",
        },
        {
          patientId: 3,
          date: "2023-05-04",
          time: "15:45:00",
          description: "Follow up appointment",
          patientUUID: "a7f4c4f4-4b4d-4d77-8c87-5b69c5b8e0bf",
        },
        {
          patientId: 4,
          date: "2023-05-05",
          time: "09:30:00",
          description: "Consultation for back pain",
          patientUUID: "d7542f35-ef1a-45bb-92c1-9da779a9c32a",
        },
        {
          patientId: 5,
          date: "2023-05-06",
          time: "11:15:00",
          description: "Dental cleaning",
          patientUUID: "b6dcf98e-086a-4e43-9d61-fdbb3d862b0d",
        },
        {
          patientId: 6,
          date: "2023-05-07",
          time: "13:00:00",
          description: "Eye exam",
          patientUUID: "93677bf8-8f17-45f7-bf95-691a40b2771c",
        },
        {
          patientId: 7,
          date: "2023-05-08",
          time: "16:30:00",
          description: "Checkup for allergies",
          patientUUID: "f8d45f5e-b0bb-4b7f-9e36-8567b6244a2c",
        },
        {
          patientId: 8,
          date: "2023-05-09",
          time: "11:00:00",
          description: "Physical therapy session",
          patientUUID: "f676a3c9-1d9f-4293-9a88-3b2f29a8ccf2",
        },
        {
          patientId: 9,
          date: "2023-05-10",
          time: "15:15:00",
          description: "Follow up appointment",
          patientUUID: "a7f4c4f4-4b4d-4d77-8c87-5b69c5b8e0bf",
        },
        {
          patientId: 10,
          date: "2023-05-11",
          time: "10:30:00",
          description: "Consultation for sinus infection",
          patientUUID: "d7542f35-ef1a-45bb-92c1-9da779a9c32a",
        },
        {
          patientId: 11,
          date: "2023-04-30",
          time: "11:00:00",
          description: "Blood test",
          patientUUID: "f8d45f5e-b0bb-4b7f-9e36-8567b6244a7c",
        },
        {
          patientId: 12,
          date: "2023-05-01",
          time: "12:30:00",
          description: "Annual physical exam",
          patientUUID: "f476a3c9-1d9f-4293-9a88-3b2f29a9ccf2",
        },
        {
          patientId: 13,
          date: "2023-05-01",
          time: "14:15:00",
          description: "Follow up appointment",
          patientUUID: "a7f4c4f4-4b4d-4d77-8c87-5b69c5b8e0be",
        },
        {
          patientId: 4,
          date: "2023-05-02",
          time: "16:00:00",
          description: "Consultation for shoulder pain",
          patientUUID: "d7542f35-ef1a-45bb-92c1-9da779a9c32a",
        },
        {
          patientId: 5,
          date: "2023-05-03",
          time: "11:45:00",
          description: "Dental checkup",
          patientUUID: "b6dcf98e-086a-4e43-9d61-fdbb3d862b0d",
        },
        {
          patientId: 6,
          date: "2023-05-03",
          time: "13:30:00",
          description: "Eye exam",
          patientUUID: "93677bf8-8f17-45f7-bf95-691a40b2771c",
        },
        {
          patientId: 7,
          date: "2023-05-04",
          time: "15:30:00",
          description: "Checkup for asthma",
          patientUUID: "f8d45f5e-b0bb-4b7f-9e36-8567b6244a4c",
        },
        {
          patientId: 8,
          date: "2023-05-05",
          time: "09:30:00",
          description: "Physical therapy session",
          patientUUID: "f476a3c9-1d9f-4293-9a88-3b2f29a8ccf2",
        },
        {
          patientId: 9,
          date: "2023-05-06",
          time: "16:00:00",
          description: "Follow up appointment",
          patientUUID: "a7f4c4f4-4b4d-4d77-8c87-5b69c5b8e0bf",
        },
        {
          patientId: 10,
          date: "2023-05-07",
          time: "10:30:00",
          description: "Consultation for migraine headaches",
          patientUUID: "d7542f35-ef1a-45bb-92c1-9da779a9c32a",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
