export default (sequelize, DataTypes) => {
  return sequelize.define("permisos", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(45), allowNull: false },
    descrip: { type: DataTypes.STRING(45), allowNull: true }
  }, {
    freezeTableName: true // <-- evita la pluralización
  });
};