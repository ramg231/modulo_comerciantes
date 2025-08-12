export default (sequelize, DataTypes) => {
  return sequelize.define("movimiento_stock", {
    idMovimiento_Stock: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_producto: { type: DataTypes.INTEGER, allowNull: true },
    stock: { type: DataTypes.INTEGER, allowNull: true },
    motivo: { type: DataTypes.STRING(45), allowNull: true },
    creacion_id: { type: DataTypes.INTEGER, allowNull: true },
    fech_crea: { type: DataTypes.DATE, allowNull: true }
  }, {
    freezeTableName: true // <-- evita la pluralización
  });
};