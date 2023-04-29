const { v4: uuidv4 } = require("uuid");

("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "John",
          lastName: "Doe",
          birthday: "1990-01-01",
          email: "john.doe@example.com",
          password: "password123",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          birthday: "1985-05-15",
          email: "jane.smith@example.com",
          password: "password456",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Bob",
          lastName: "Johnson",
          birthday: "1978-11-20",
          email: "bob.johnson@example.com",
          password: "password789",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Emily",
          lastName: "Brown",
          birthday: "1995-03-02",
          email: "emily.brown@example.com",
          password: "passwordabc",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "David",
          lastName: "Lee",
          birthday: "1980-07-10",
          email: "david.lee@example.com",
          password: "passworddef",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Alice",
          lastName: "Jones",
          birthday: "1992-04-15",
          email: "alice.jones@example.com",
          password: "password123",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Benjamin",
          lastName: "Nguyen",
          birthday: "1987-09-27",
          email: "benjamin.nguyen@example.com",
          password: "password456",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Carla",
          lastName: "Garcia",
          birthday: "1985-06-11",
          email: "carla.garcia@example.com",
          password: "password789",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "David",
          lastName: "Williams",
          birthday: "1979-01-23",
          email: "david.williams@example.com",
          password: "passwordabc",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Elena",
          lastName: "Hernandez",
          birthday: "1983-12-06",
          email: "elena.hernandez@example.com",
          password: "passworddef",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Frank",
          lastName: "Davis",
          birthday: "1990-02-14",
          email: "frank.davis@example.com",
          password: "password123",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Gabriela",
          lastName: "Martinez",
          birthday: "1976-07-29",
          email: "gabriela.martinez@example.com",
          password: "password456",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Henry",
          lastName: "Jackson",
          birthday: "1982-03-08",
          email: "henry.jackson@example.com",
          password: "password789",
          phoneNumber: "12345678",
          role: "patient",
          uuid: uuidv4(),
        },
        {
          firstName: "Walid",
          lastName: "Abou Karam",
          birthday: "1982-03-08",
          email: "dr@gmail.com",
          password: "Uu12345678",
          phoneNumber: "12345678",
          role: "doctor",
          uuid: uuidv4(),
        },
        {
          firstName: "Pharmacy",
          lastName: "Elie",
          birthday: "1982-03-08",
          email: "pharmelie@gmail.com",
          password: "Uu12345678",
          phoneNumber: "12345678",
          role: "pharmacy",
          uuid: uuidv4(),
        },
        {
          firstName: "Pharmacy",
          lastName: "Joe",
          birthday: "1982-03-08",
          email: "pharmJoe@gmail.com",
          password: "Uu12345678",
          phoneNumber: "12345678",
          role: "pharmacy",
          uuid: uuidv4(),
        },
        {
          firstName: "Pharmacy",
          lastName: "Rita",
          birthday: "1982-03-08",
          email: "pharmRita@gmail.com",
          password: "Uu12345678",
          phoneNumber: "12345678",
          role: "pharmacy",
          uuid: uuidv4(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
