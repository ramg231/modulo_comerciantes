export default (sequelize, DataTypes) => {
  return sequelize.define("comerc_cate", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    comerciante_id: { type: DataTypes.INTEGER, allowNull: false },
    cate_id: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.BOOLEAN, allowNull: true },
    creacion_id: { type: DataTypes.INTEGER, allowNull: true },
    act_id: { type: DataTypes.INTEGER, allowNull: true },
    fech_creac: { type: DataTypes.DATE, allowNull: true },
    fech_act: { type: DataTypes.DATE, allowNull: true }
  }, {
    freezeTableName: true,
  timestamps: false // <--- esto elimina createdAt y updatedAt
});
};