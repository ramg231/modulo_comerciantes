export default (sequelize, DataTypes) => {
  return sequelize.define("imagen_producto", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    producto_id: { type: DataTypes.INTEGER, allowNull: false },
    ruta: { type: DataTypes.STRING(255), allowNull: false },           // Máximo 255 caracteres
    nombre_archivo: { type: DataTypes.STRING(100), allowNull: false }, // Máximo 100 caracteres
    orden: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {
    freezeTableName: true // <-- evita la pluralización
  });
};