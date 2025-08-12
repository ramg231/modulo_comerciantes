// src/routes/permiso.routes.js
import express from "express";
import {
  crearPermiso,
  listarPermisos,
  actualizarPermiso,
  eliminarPermiso,
} from "../controllers/permisos.controller.js";

const router = express.Router();

router.post("/permisos/crear", crearPermiso);
router.get("/permisos", listarPermisos);
router.put("/permisos/:id", actualizarPermiso);
router.delete("/permisos/permisos/:id", eliminarPermiso);

export default router;
