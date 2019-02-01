'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('shoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      brand: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
	    size: {
		    type: Sequelize.FLOAT
	    },
	    price: {
		    type: Sequelize.DECIMAL
	    },
	    numberOfLikes: {
		    type: Sequelize.INTEGER
	    },
	    photos: {
		    type: Sequelize.STRING
	    },
	    
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('shoes');
  }
};
