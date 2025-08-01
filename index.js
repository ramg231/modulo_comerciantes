import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnection } from "./src/database/config.js";
import { syncModels } from "./src/database/syncModels.js"; // nombre correcto aquí
import usuarioRoutes from "./src/routes/usuario.routes.js"; // Asegúrate de que la ruta sea correcta
import permisoRoutes from "./src/routes/permiso.routes.js";
import rolPermisoRoutes from "./src/routes/rolPermiso.routes.js";
import rolRoutes from "./src/routes/roles.routes.js";
import productRoutes from "./src/routes/productos.routes.js";
import imgRoutes from "./src/routes/imagenProducto.routes.js";
import catRoutes from "./src/routes/categoria.routes.js";
import pubRoutes from "./src/routes/public.routes.js";
import opcRoutes from "./src/routes/opciones.routes.js"
import pedRoutes from "./src/routes/pedido.routes.js"
dotenv.config();

const app = express(); // Crear instancia de express

// Middleware de CORS
app.use(
  cors({
    origin: [
      "https://pasteleriajazmin.net.pe",
      "https://www.pasteleriajazmin.net.pe",
      "https://pasteleriajazmin.net.pe/",
      "https://www.pasteleriajazmin.net.pe/",
      "http://localhost:3000/",
      "http://localhost:3000",
      "http://localhost:5173"
      
    ],
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "x-token", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "src", "public");

// Servir archivos estáticos
app.use("/public", express.static(publicPath));

// Iniciar conexión y sincronización con la base de datos
dbConnection().then(syncModels);

// Rutas de la API (puedes completar después)
console.log("Cargando rutas de categoría");
app.use("/api/cat", catRoutes);
app.use("/api/user",usuarioRoutes );
app.use("/api/permisos", permisoRoutes);
app.use("/api/rolPerm", rolPermisoRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/cat", catRoutes);
app.use("/api/products",  productRoutes);
app.use("/api/img",   imgRoutes);
app.use("/api/publica",   pubRoutes);
app.use("/api/opc",   opcRoutes);
app.use("/api/ped",   pedRoutes);
// app.use("/api/categorias", categoriaRoutes);

// Ruta 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

 
// ...existing code...
app.listen(process.env.PORT || 4001, '0.0.0.0', () => {
  console.log('Servidor corriendo en el puerto', process.env.PORT || 4001);
});
// ...existing code...
