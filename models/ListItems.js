module.exports = (sequelize, DataTypes) => {
    const ListItems = sequelize.define('ListItems', {
      ListID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      ListItem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      ListDescription: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'listitems', // Asegúrate de que coincida con el nombre de tu tabla
      timestamps: false // No agregar columnas createdAt o updatedAt
    });
  
    return ListItems;
  };
  