import {  Usuario,Rol} from "../database/syncModels.js";
 
import bcrypt from 'bcrypt';
import { generarJWT } from '../helpers/jwt.js';
 
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol_id } = req.body;

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(400).json({ message: "Correo ya registrado" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // 🔒

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword, // almacenas el hash
      rol_id,
    });

    res.status(201).json({
      ok: true,
      message: 'Usuario creado con éxito',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol_id: nuevoUsuario.rol_id,
      
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

//login de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si existe el usuario
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    // Verificar si está activo
    if (!usuario.activo) {
      return res.status(403).json({ message: 'Usuario inactivo' });
    }

    // Comparar contraseñas
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar JWT
    const token = await generarJWT({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol_id
    });

    res.status(201).json({
      ok: true,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol_id: usuario.rol_id,
      },
        message: 'Login exitoso',
      token,
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const revalidarToken = async (req, res) => {
  const { id, nombre, email, rol } = req;

  const token = await generarJWT({ id, nombre, email, rol });

  res.json({
    ok: true,
    token,
    user: {
      id,
      nombre,
      email,
      rol
    }
  });
};







// Obtener todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "email", "activo", "rol_id"],
      include: {
        model: Rol,
        attributes: ["nombre"],
      },
    });

    res.status(200).json({
      ok: true,
      message: "Usuarios obtenidos correctamente",
      usuarios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al listar usuarios",
      error: error.message,
    });
  }
};


// Obtener un usuario por ID
export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: { model: Rol, attributes: ["nombre"] },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario encontrado",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await usuario.update(req.body);

    res.status(200).json({
      message: "Usuario actualizado con éxito",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

// Desactivar usuario (eliminación lógica)
export const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Cambiar el estado activo a false
    usuario.activo = false;
    await usuario.save();

     res.status(200).json({
      message: "Usuario desactivado correctamente",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al desactivar usuario",
      error: error.message,
    });
  }
};
