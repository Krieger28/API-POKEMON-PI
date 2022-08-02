const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "pokemon",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hp: {
        type: DataTypes.INTEGER,
        defaultValue: "1",
      },
      attack: {
        type: DataTypes.INTEGER,
        defaultValue: "2",
      },
      defense: {
        type: DataTypes.INTEGER,
        defaultValue: "3",
      },
      speed: {
        type: DataTypes.INTEGER,
        defaultValue: "4",
      },
      height: {
        type: DataTypes.INTEGER,
        defaultValue: "5",
      },
      weight: {
        type: DataTypes.INTEGER,
        defaultValue: "6",
      },
    },
    {
      timestamps: false,
    }
  );
};
