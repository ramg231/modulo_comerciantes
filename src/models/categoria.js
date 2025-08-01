export default (sequelize, DataTypes) => {
  return sequelize.define("categoria", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(45), allowNull: false },
    descrip: { type: DataTypes.TEXT, allowNull: true },
    creacion_id: { type: DataTypes.INTEGER, allowNull: true },
    act_id: { type: DataTypes.INTEGER, allowNull: true },
    fech_creacion: { type: DataTypes.DATE, allowNull: true },
    fech_act: { type: DataTypes.DATE, allowNull: true }
  });
};