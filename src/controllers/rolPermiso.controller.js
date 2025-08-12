// src/controllers/rolPermiso.controller.js
import {  Rol, Permiso, RolPermiso } from "../database/syncModels.js";
 

// Asignar uno o más permisos a un rol
export const asignarPermisos = async (req, res) => {
  try {
    const { rol_id, permisos } = req.body; // permisos: [1,2,3]

    // Validar existencia del rol
    const rol = await Rol.findByPk(rol_id);
    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

    // Eliminar permisos anteriores (si deseas reemplazar)
    await RolPermiso.destroy({ where: { rol_id } });

    // Asignar nuevos
    const nuevasAsignaciones = permisos.map((permiso_id) => ({
      rol_id,
      permiso_id,
    }));
    await RolPermiso.bulkCreate(nuevasAsignaciones);

    res.status(200).json({ message: "Permisos asignados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al asignar permisos" });
  }
};

// Obtener permisos de un rol
 

export const obtenerPermisosPorRol = async (req, res) => {
  try {
    const { rol_id } = req.params;

    const rol = await Rol.findByPk(rol_id, {
      include: {
        model: Permiso,
        attributes: ['id', 'nombre'], // 👈 solo traer estos campos
        through: { attributes: [] },  // 👈 omitir tabla intermedia
      },
    });

    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

    res.json(rol.Permisos); // solo id y nombre de los permisos
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener permisos del rol" });
  }
};


