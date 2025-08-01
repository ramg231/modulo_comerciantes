export default (sequelize, DataTypes) => {
  return sequelize.define("persona", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    apellidos: { type: DataTypes.STRING(250), allowNull: false },
    genero: { type: DataTypes.STRING(8), allowNull: false },
    fech_nacimiento: { type: DataTypes.DATE, allowNull: true },
    celular: { type: DataTypes.STRING(10), allowNull: true }
  });
};