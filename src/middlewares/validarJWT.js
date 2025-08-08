import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const validarJWT = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      message: "No hay token en la petición",
    });
  }

  try {
    const { id, nombre, rol, email } = jwt.verify(
      token,
      config.secretJwtSeed // Usar la semilla desde config.js
    );

    req.id = id;
    req.nombre = nombre;
    req.rol = rol;
    req.email = email;

    next();
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    return res.status(401).json({
      message: "Token no válido",
    });
  }
};
