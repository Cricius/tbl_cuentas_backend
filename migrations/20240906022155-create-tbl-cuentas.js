'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_cuentas', {
      IdCuenta: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Correo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      Contrasena: {
        type: Sequelize.STRING,
        allowNull: false
      },
      PreguntaSecreta: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Respuesta: {
        type: Sequelize.STRING,
        allowNull: false
      },
      CambioContrasena: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      FRegistro: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      verificationToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_cuentas');
  }
};
