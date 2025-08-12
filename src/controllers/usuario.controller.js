import { Persona,Comerciantes,Usuarios,Rol} from "../database/syncModels.js";
 
import bcrypt from 'bcrypt';
import { generarJWT } from '../helpers/jwt.js';

// Crear persona y comerciante
 const crearPersonaComerciante = async (personaData, comercianteData) => {
  try {
    const persona = await Persona.create({
      nombre: personaData.nombre,
      apellidos: personaData.apellidos,
      genero: personaData.genero,
      fech_nacimiento: personaData.fech_nacimiento,
      celular: personaData.celular,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(comercianteData.password, salt);

    const comerciante = await Comerciantes.create({
      persona_id: persona.id,
      n_documento: comercianteData.n_documento,
      nom_comercio: comercianteData.nom_comercio,
      contacto_wsp: comercianteData.contacto_wsp,
      password: hashedPassword, // <--- aquí va la contraseña hasheada
      estado: comercianteData.estado,
      rol_id: comercianteData.rol_id,
      creacion_id: comercianteData.creacion_id,
      act_id: comercianteData.act_id,
      fech_creacion: comercianteData.fech_creacion,
      fech_act: comercianteData.fech_act,
    });

    return { persona, comerciante };
  } catch (error) {
    throw error;
  }
};

// Crear persona y usuario
 const crearPersonaUsuario = async (personaData, usuarioData) => {
  try {
    const persona = await Persona.create({
      nombre: personaData.nombre,
      apellidos: personaData.apellidos,
      genero: personaData.genero,
      fech_nacimiento: personaData.fech_nacimiento,
      celular: personaData.celular,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(usuarioData.password, salt);

    const usuario = await Usuarios.create({
      persona_id: persona.id,
      n_documento: usuarioData.n_documento,
      correo: usuarioData.correo,
      password: hashedPassword,
      estado: usuarioData.estado,
      rol_id: usuarioData.rol_id,
      creacion_id: usuarioData.creacion_id,
      act_id: usuarioData.act_id,
      fech_crea: usuarioData.fech_crea,
      fech_act: usuarioData.fech_act,
    });

    return { persona, usuario };
  } catch (error) {
    throw error;
  }
}

export const crearUsuario = async (req, res) => {
  try {
    const { tipo, personaData, usuarioData, comercianteData } = req.body;

    // Verifica si el correo ya está registrado (en Usuarios o Comerciantes)
    let correo = usuarioData?.correo || comercianteData?.correo;
    if (correo) {
      const existeCorreoUsuario = await Usuarios.findOne({ where: { correo } });
      const existeCorreoComerciante = await Comerciantes.findOne({ where: { correo: correo } }); // Si usas correo en Comerciantes
      if (existeCorreoUsuario || existeCorreoComerciante) {
        return res.status(400).json({ message: "Correo ya registrado" });
      }
    }

    // Verifica si el documento ya está registrado (en Usuarios o Comerciantes)
    let n_documento = usuarioData?.n_documento || comercianteData?.n_documento;
    if (n_documento) {
      const existeDocUsuario = await Usuarios.findOne({ where: { n_documento } });
      const existeDocComerciante = await Comerciantes.findOne({ where: { n_documento } });
      if (existeDocUsuario || existeDocComerciante) {
        return res.status(400).json({ message: "Documento ya registrado" });
      }
    }

    if (tipo === "usuario") {
      const { persona, usuario } = await crearPersonaUsuario(personaData, usuarioData);
      return res.status(201).json({
        ok: true,
        message: 'Usuario creado con éxito',
        usuario,
        persona,
      });
    }

    if (tipo === "comerciante") {
      const { persona, comerciante } = await crearPersonaComerciante(personaData, comercianteData);
      return res.status(201).json({
        ok: true,
        message: 'Comerciante creado con éxito',
        comerciante,
        persona,
      });
    }

    return res.status(400).json({ message: "Tipo no válido" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear usuario o comerciante" });
  }
};


//login de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si existe el usuario
    const usuario = await Usuarios.findOne({ where: { email } });
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
    const usuarios = await Usuarios.findAll({
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
    const usuario = await Usuarios.findByPk(req.params.id, {
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
    const usuario = await Usuarios.findByPk(id);

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
    const usuario = await Usuarios.findByPk(id);

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
