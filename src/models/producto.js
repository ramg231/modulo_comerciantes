export default (sequelize, DataTypes) => {
  return sequelize.define("productos", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    producto: { type: DataTypes.STRING(150), allowNull: false },
    descrip: { type: DataTypes.TEXT, allowNull: true },
    precio: { type: DataTypes.DECIMAL, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: true },
    categoria_id: { type: DataTypes.INTEGER, allowNull: false },
    creacion_id: { type: DataTypes.INTEGER, allowNull: true },
    act_id: { type: DataTypes.INTEGER, allowNull: true },
    fech_creacion: { type: DataTypes.DATE, allowNull: true },
    fech_act: { type: DataTypes.DATE, allowNull: true },
    estado: { type: DataTypes.BOOLEAN, allowNull: true }
   }, {
    freezeTableName: true // <-- evita la pluralización
  });
};