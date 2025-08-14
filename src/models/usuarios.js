export default (sequelize, DataTypes) => {
  return sequelize.define("usuarios", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    persona_id: { type: DataTypes.INTEGER, allowNull: false },
    n_documento: { type: DataTypes.STRING(8), allowNull: false, unique: true },
    correo: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    estado: { type: DataTypes.BOOLEAN, allowNull: true },
    rol_id: { type: DataTypes.INTEGER, allowNull: false },
    creacion_id: { type: DataTypes.INTEGER, allowNull: true },
    act_id: { type: DataTypes.INTEGER, allowNull: true },
    fech_crea: { type: DataTypes.DATE,  defaultValue: DataTypes.NOW,allowNull: true },
    fech_act: { type: DataTypes.DATE, allowNull: true }
  }, {
   freezeTableName: true,
  timestamps: false // <--- esto elimina createdAt y updatedAt
});
};