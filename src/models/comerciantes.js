export default (sequelize, DataTypes) => {
  return sequelize.define("comerciantes", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    persona_id: { type: DataTypes.INTEGER, allowNull: false },
    n_documento: { type: DataTypes.STRING(25), allowNull: false, unique: true },
     correo: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    nom_comercio: { type: DataTypes.STRING(150), allowNull: false },
    contacto_wsp: { type: DataTypes.STRING(10), allowNull: true },
    password: { type: DataTypes.STRING(150), allowNull: true },
    estado: { type: DataTypes.BOOLEAN, allowNull: true },
    rol_id: { type: DataTypes.INTEGER, allowNull: false },
    creacion_id: { type: DataTypes.INTEGER, allowNull: true },
    act_id: { type: DataTypes.INTEGER, allowNull: true },
    fech_creacion: { type: DataTypes.DATE, allowNull: true },
    fech_act: { type: DataTypes.DATE, allowNull: true }
  }, {
    freezeTableName: true,
  timestamps: false // <--- esto elimina createdAt y updatedAt
});
};