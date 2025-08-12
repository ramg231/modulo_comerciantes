// src/controllers/rolPermiso.controller.js
import {  Rol, Permiso, RolPermiso } from "../database/syncModels.js";
 

// Asignar uno o más permisos a un rol
export const asignarPermisos = async (req, res) => {
  try {
    const { rol_id, permisos, creacion_id } = req.body; // permisos: [1,2,3]

    // Validar existencia del rol
    const rol = await Rol.findByPk(rol_id);
    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

    // Asignar nuevos permisos (no elimina anteriores)
    const nuevasAsignaciones = permisos.map((permiso_id) => ({
      rol_id,
      permiso_id,
      creacion_id,
    }));
    await RolPermiso.bulkCreate(nuevasAsignaciones);

    res.status(200).json({
      message: "Permisos asignados correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al asignar permisos" });
  }
};


// Obtener permisos de un rol
export const obtenerPermisosPorRol = async (req, res) => {
  try {
    const { rol_id } = req.params;

    // Busca los registros en la tabla intermedia e incluye el nombre del permiso
    const asignaciones = await RolPermiso.findAll({
      where: { rol_id },
      attributes: ['id', 'estado'],
      include: [{
        model: Permiso,
        attributes: ['nombre']
      }]
    });

    if (!asignaciones.length) {
      return res.status(404).json({ message: "No hay permisos asignados a este rol" });
    }

    res.json(asignaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener permisos del rol" });
  }
};

