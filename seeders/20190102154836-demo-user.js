import faker from 'faker';
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
*/
      return queryInterface.bulkInsert('User', [{
	      firstname: faker.name.findName(),
	      lastname: faker.name.findName(),
	      email: faker.internet.email(),
	      password: faker.internet.password()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
*/
      return queryInterface.bulkDelete('User', null, {});
  }
};
