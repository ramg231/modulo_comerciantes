import { Sequelize, DataTypes } from "sequelize";
import { config } from '../config/config.js';

// Instancia de Sequelize
export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: false,
  }
);

// Función para probar la conexión
export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL exitosa");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    throw error;
  }
};

// Inicializar modelos
import PersonaModel from '../models/persona.js';
import ComerciantesModel from '../models/comerciantes.js';
import UsuariosModel from '../models/usuarios.js';
import RolModel from '../models/rol.js';
import PermisoModel from '../models/permiso.js';
import RolPermisoModel from '../models/rol_permiso.js';
import CategoriaModel from '../models/categoria.js';
import ProductoModel from '../models/producto.js';
import ImagenProductoModel from '../models/imagen_producto.js';
import MovimientoStockModel from '../models/movimiento_stock.js';
import PedidocabModel from '../models/pedido_cab.js';
import PedidodetModel from '../models/pedido_det.js';
import ComerCatModel from '../models/comercio_categoria.js';


export const Persona = PersonaModel(sequelize, DataTypes);
export const Comerciantes = ComerciantesModel(sequelize, DataTypes);
export const Usuarios = UsuariosModel(sequelize, DataTypes);
export const Rol = RolModel(sequelize, DataTypes);
export const Permiso = PermisoModel(sequelize, DataTypes);
export const RolPermiso = RolPermisoModel(sequelize, DataTypes);
export const Categoria = CategoriaModel(sequelize, DataTypes);
export const Producto = ProductoModel(sequelize, DataTypes);
export const ImagenProducto = ImagenProductoModel(sequelize, DataTypes);
export const MovimientoStock = MovimientoStockModel(sequelize, DataTypes);
export const Pedidocab = PedidocabModel(sequelize, DataTypes);
export const Pedidodet = PedidodetModel(sequelize, DataTypes);
export const ComerCat = ComerCatModel(sequelize, DataTypes);





// RELACIONES
// Persona - Comerciantes (uno a uno)
Persona.hasOne(Comerciantes, { foreignKey: 'persona_id' });
Comerciantes.belongsTo(Persona, { foreignKey: 'persona_id' });

// Persona - Usuarios (uno a uno)
Persona.hasOne(Usuarios, { foreignKey: 'persona_id' });
Usuarios.belongsTo(Persona, { foreignKey: 'persona_id' });


// Usuarios - Roles
Usuarios.hasOne(Rol, { foreignKey: 'rol_id' });
Rol.belongsTo(Usuarios, { foreignKey: 'rol_id' });

// Rol - RolPermiso
Rol.hasMany(RolPermiso, { foreignKey: 'rol_id' });
RolPermiso.belongsTo(Rol, { foreignKey: 'rol_id' });

// Permisos - RolPermiso
Permiso.hasMany(RolPermiso, { foreignKey: 'permiso_id' });
RolPermiso.belongsTo(Permiso, { foreignKey: 'permiso_id' });

// Comerciantes - ComerCat
Comerciantes.hasMany(ComerCat, { foreignKey: 'comerciante_id' });
ComerCat.belongsTo(Comerciantes, { foreignKey: 'comerciante_id' });

// Categoria - ComerCat
Categoria.hasMany(ComerCat, { foreignKey: 'categoria_id' });
ComerCat.belongsTo(Categoria, { foreignKey: 'categoria_id' });

// Producto - Categoria
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });


//Producto - movimiento de stock
Producto.hasMany(MovimientoStock, { foreignKey: 'producto_id' });
MovimientoStock.belongsTo(Producto, { foreignKey: 'producto_id' });

// Producto - ImagenProducto
Producto.hasMany(ImagenProducto, { foreignKey: 'producto_id' });
ImagenProducto.belongsTo(Producto, { foreignKey: 'producto_id' });   


// Producto - Pedido
Producto.hasMany(Pedidodet, { foreignKey: 'producto_id' });
Pedidodet.belongsTo(Producto, { foreignKey: 'producto_id', as: 'productoRef' }); // <--- alias cambiado

//PedidoCab - PedidoDet
Pedidocab.hasMany(Pedidodet, { foreignKey: 'pedcab_id' });
Pedidodet.belongsTo(Pedidocab, { foreignKey: 'pedcab_id' });

export const db = {
  sequelize,
 
};

// Función para sincronizar los modelos
export const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // Cambia a { force: true } si quieres borrar todo
    console.log("🟢 Modelos sincronizados correctamente.");
  } catch (error) {
    console.error("🔴 Error al sincronizar modelos:", error);
  }
};
