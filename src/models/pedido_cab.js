export default (sequelize, DataTypes) => {
  return sequelize.define("pedido_cab", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente: { type: DataTypes.STRING(45), allowNull: true },
    dni: { type: DataTypes.STRING(8), allowNull: true },
    celular: { type: DataTypes.STRING(9), allowNull: true },
    total: { type: DataTypes.DECIMAL, allowNull: true },
    estado: { type: DataTypes.STRING(15), allowNull: true },
    act_id: { type: DataTypes.INTEGER, allowNull: true },
    fech_crea: { type: DataTypes.DATE, allowNull: true },
    fech_act: { type: DataTypes.DATE, allowNull: true }
  });
};