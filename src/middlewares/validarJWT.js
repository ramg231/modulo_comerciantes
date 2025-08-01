import jwt from "jsonwebtoken";

export const validarJWT = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      message: "No hay token en la petición",
    });
  }

  try {
     const {id,nombre, rol,email } = jwt.verify(
                token,
                process.env.SECRET_JWT_SEED
            );

    // Puedes modificar según los campos que tengas
    
        req.id = id;
        req.nombre = nombre;
        req.rol = rol;
        req.email= email;
      
   

    next();
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    return res.status(401).json({
      message: "Token no válido",
    });
  }
};
