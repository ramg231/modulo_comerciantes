export default (sequelize, DataTypes) => {
  return sequelize.define("pedido_det", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pedcab_id: { type: DataTypes.INTEGER, allowNull: false },
    producto_id: { type: DataTypes.INTEGER, allowNull: false },
    producto: { type: DataTypes.STRING(45), allowNull: true },
    cantidad: { type: DataTypes.INTEGER, allowNull: true },
    precio: { type: DataTypes.DECIMAL, allowNull: true }
}, {
    freezeTableName: true // <-- evita la pluralización
  });
};