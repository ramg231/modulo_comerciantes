export default (sequelize, DataTypes) => {
  return sequelize.define("roles_permisos", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rol_id: { type: DataTypes.INTEGER, allowNull: false },
    permiso_id: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true,allowNull: true },
    creacion_id: { type: DataTypes.INTEGER, allowNull: true },
    act_id: { type: DataTypes.INTEGER, allowNull: true },
    fech_crea: { type: DataTypes.DATE, defaultValue: DataTypes.NOW,allowNull: true },
    fech_act: { type: DataTypes.DATE, allowNull: true }
  }, {
  freezeTableName: true,
  timestamps: false // <--- esto elimina createdAt y updatedAt
});
};