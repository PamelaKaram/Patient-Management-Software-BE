"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.renameColumn("users", "age", "birthday");
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.renameColumn("users", "birthday", "age");
  },
};
