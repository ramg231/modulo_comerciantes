export default (sequelize, DataTypes) => {
  return sequelize.define("roles", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rol: { type: DataTypes.STRING(45), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.BOOLEAN, allowNull: true },
    creacion_id: { type: DataTypes.INTEGER, allowNull: true },
    act_id: { type: DataTypes.INTEGER, allowNull: true },
    fech_crea: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: true },
    fech_act: { type: DataTypes.DATE,allowNull: true }
  }, {
    freezeTableName: true,
  timestamps: false // <--- esto elimina createdAt y updatedAt
});
};