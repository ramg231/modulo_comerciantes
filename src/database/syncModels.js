import { sequelize } from "./config.js";
import { DataTypes } from "sequelize";

// Importar modelos
import PermisoModel from "../models/permiso.js";
import ComerciantesModel from "../models/comerciantes.js";
import UsuarioModel from "../models/usuarios.js";
import RolModel from "../models/rol.js";
import PermisoModel from "../models/permiso.js";
import RolPermisoModel from "../models/rol_permiso.js";
import CategoriaModel from "../models/categoria.js";
import ProductoModel from "../models/producto.js";
import ImagenProductoModel from "../models/imagen_producto.js";
import MovimientoStockModel from "../models/movimientoStock.js";
import VentaModel from "../models/venta.js";
import DetalleVentaModel from "../models/detalleventa.js";
import SaborModel from "../models/sabor.js";
import TamanoModel from "../models/tamano.js";
import ProductoSaborModel from "../models/productoSabor.js";
import ProductoTamanoModel from "../models/productoTamano.js";
import PedidoProductoModel from "../models/pedido_producto.js";
import PedidoModel from "../models/pedido.js"; 

// Inicializar modelos
export const Usuario = UsuarioModel(sequelize, DataTypes);
export const Rol = RolModel(sequelize, DataTypes);
export const Permiso = PermisoModel(sequelize, DataTypes);
export const RolPermiso = RolPermisoModel(sequelize, DataTypes);
export const Categoria = CategoriaModel(sequelize, DataTypes);
export const Producto = ProductoModel(sequelize, DataTypes);
export const ImagenProducto = ImagenProductoModel(sequelize, DataTypes);
export const MovimientoStock = MovimientoStockModel(sequelize, DataTypes);
export const Venta = VentaModel(sequelize, DataTypes);
export const DetalleVenta = DetalleVentaModel(sequelize, DataTypes);
export const Sabor = SaborModel(sequelize, DataTypes);
export const Tamano = TamanoModel(sequelize, DataTypes); 
export const ProductoSabor = ProductoSaborModel(sequelize, DataTypes);
export const ProductoTamano = ProductoTamanoModel(sequelize, DataTypes);
export const PedidoProducto = PedidoProductoModel(sequelize, DataTypes);
export const Pedido = PedidoModel(sequelize, DataTypes);


// RELACIONES

Rol.hasMany(Usuario, { foreignKey: "rol_id" });
Usuario.belongsTo(Rol, { foreignKey: "rol_id" });

Rol.belongsToMany(Permiso, {
  through: RolPermiso,
  foreignKey: "rol_id",
});
Permiso.belongsToMany(Rol, {
  through: RolPermiso,
  foreignKey: "permiso_id",
});

Categoria.hasMany(Producto, { foreignKey: "categoria_id" });
Producto.belongsTo(Categoria, { foreignKey: "categoria_id" });

Producto.hasMany(ImagenProducto, { foreignKey: "producto_id", as: "imagenes" });
ImagenProducto.belongsTo(Producto, { foreignKey: "producto_id" });

Producto.hasMany(MovimientoStock, { foreignKey: "producto_id" });
MovimientoStock.belongsTo(Producto, { foreignKey: "producto_id" });

Usuario.hasMany(MovimientoStock, { foreignKey: "usuario_id" });
MovimientoStock.belongsTo(Usuario, { foreignKey: "usuario_id" });

Usuario.hasMany(Venta, { foreignKey: "usuario_id" });
Venta.belongsTo(Usuario, { foreignKey: "usuario_id" });

Venta.hasMany(DetalleVenta, { foreignKey: "venta_id", as: "detalles" });
DetalleVenta.belongsTo(Venta, { foreignKey: "venta_id" });

Producto.hasMany(DetalleVenta, { foreignKey: "producto_id" });
DetalleVenta.belongsTo(Producto, { foreignKey: "producto_id" });
Producto.belongsToMany(Sabor, {
  through: ProductoSabor,
  foreignKey: "producto_id",
});
Sabor.belongsToMany(Producto, {
  through: ProductoSabor,
  foreignKey: "sabor_id",
});

Producto.belongsToMany(Tamano, {
  through: ProductoTamano,
  foreignKey: "producto_id",
});
Tamano.belongsToMany(Producto, {
  through: ProductoTamano,
  foreignKey: "tamano_id",
});

ProductoTamano.belongsTo(Tamano, { foreignKey: "tamano_id" });
ProductoSabor.belongsTo(Sabor, { foreignKey: "sabor_id" });

Pedido.hasMany(PedidoProducto, { foreignKey: "pedido_id" });
PedidoProducto.belongsTo(Pedido, { foreignKey: "pedido_id" });

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
