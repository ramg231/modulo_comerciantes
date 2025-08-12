import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { syncModels, dbConnection } from "./src/database/syncModels.js";
import { config } from "./src/config/config.js";
import { swaggerUiServe, swaggerUiSetup } from "./src/config/swagger.js";
import { usuarioRoutes, rolesRoutes, permisosRoutes, rolPermisoRoutes } from "./src/routes/main.routes.js";


const app = express();

// Middleware de CORS
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "x-token", "Authorization"],
  })
);

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos
const publicPath = path.join(__dirname, "src", "public");
app.use("/public", express.static(publicPath));

// Rutas de la API
app.use("/api-docs", swaggerUiServe, swaggerUiSetup);
app.use("/api", usuarioRoutes);
app.use("/api", rolesRoutes);
app.use("/api", permisosRoutes);
app.use("/api", rolPermisoRoutes);

// Ruta 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar conexión y sincronización con la base de datos antes de arrancar el servidor
dbConnection()
  .then(syncModels)
  .then(() => {
    app.listen(config.port, "0.0.0.0", () => {
      console.log("Servidor corriendo en el puerto", config.port);
    });
  })
  .catch((error) => {
    console.error("❌ Error al iniciar la aplicación:", error);
    process.exit(1);
  });