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
    const {
      id,
      nombre,
      apellidos, // <-- recibe apellidos
      rol,
      correo,
      tipo,
      nom_comercio, // <-- recibe nom_comercio
      contacto_wsp, // <-- recibe contacto_wsp
    } = jwt.verify(token, config.secretJwtSeed); // Usar la semilla desde config.js

    req.id = id;
    req.nombre = nombre;
    req.apellidos = apellidos; // <-- agrega apellidos
    req.rol = rol;
    req.correo = correo;
    req.tipo = tipo;
    req.nom_comercio = nom_comercio; // <-- agrega nom_comercio si aplica
    req.contacto_wsp = contacto_wsp; // <-- agrega contacto_wsp si aplica

    next();
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    return res.status(401).json({
      message: "Token no válido",
    });
  }
};
