// src/controllers/permiso.controller.js
import { Permiso } from "../database/syncModels.js";
 
export const crearPermiso = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const existe = await Permiso.findOne({ where: { nombre } });
    if (existe) return res.status(400).json({ message: "Permiso ya existe" });

    const permiso = await Permiso.create({ nombre, descripcion });

    res.status(201).json({
      message: "Permiso creado con éxito",
      permiso,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear permiso" });
  }
};

export const listarPermisos = async (req, res) => {
  try {
    const permisos = await Permiso.findAll();
    res.json(permisos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al listar permisos" });
  }
};

export const actualizarPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const permiso = await Permiso.findByPk(id);
    if (!permiso) return res.status(404).json({ message: "Permiso no encontrado" });

    await permiso.update(req.body);
    res.json({ message: "Permiso actualizado", permiso });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar permiso" });
  }
};

export const eliminarPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const permiso = await Permiso.findByPk(id);
    if (!permiso) return res.status(404).json({ message: "Permiso no encontrado" });

    await permiso.destroy();
    res.json({ message: "Permiso eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar permiso" });
  }
};
