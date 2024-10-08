'use strict';

module.exports = (sequelize, DataTypes) => {
  const tbl_cuentas = sequelize.define('tbl_cuentas', {
    IdCuenta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PreguntaSecreta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Respuesta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CambioContrasena: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    FRegistro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'tbl_cuentas',
    timestamps: true,
  });

  return tbl_cuentas;
};
