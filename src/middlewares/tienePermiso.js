// src/middlewares/tienePermiso.js
import { Usuario, Rol, Permiso } from "../database/syncModels.js";

export const tienePermiso = (permisoRequerido) => {
  return async (req, res, next) => {
    try {
      const usuarioId = req.id; // ya seteado por validarJWT

      // Obtener usuario con rol
      const usuario = await Usuario.findByPk(usuarioId, {
        include: {
          model: Rol,
          include: {
            model: Permiso,
            through: { attributes: [] },
          },
        },
      });

      if (!usuario) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      // Verificar si tiene el permiso requerido
      const permisos = usuario.Rol?.Permisos?.map((p) => p.nombre) || [];

      if (!permisos.includes(permisoRequerido)) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para esta acción" });
      }

      next();
    } catch (error) {
      console.error("Error al verificar permiso:", error);
      res.status(500).json({ message: "Error interno al verificar permisos" });
    }
  };
};
