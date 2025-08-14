import { Persona, Comerciantes, Usuarios, Rol } from "../database/syncModels.js";
import { Op } from "sequelize";
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
      correo: comercianteData.correo,
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
      fech_crea: new Date(), // <-- asigna la fecha actual automáticamente
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


export const loginUsuario = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: "Correo y contraseña son requeridos" });
  }
  try {
    let usuario = await Usuarios.findOne({
      where: { correo },
      include: { model: Persona, attributes: ["nombre", "apellidos"] }
    });
    let tipo = "usuario";

    if (!usuario) {
      usuario = await Comerciantes.findOne({
        where: { correo },
        include: { model: Persona, attributes: ["nombre", "apellidos"] }
      });
      tipo = "comerciante";

    }

    if (!usuario) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    if (!usuario.estado) {
      return res.status(403).json({ message: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} inactivo` });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);


    if (!passwordValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Datos de persona
    const persona = usuario.persona || {};


    let payload;
    if (tipo === "usuario") {
      payload = {
        id: usuario.persona_id,
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        correo: usuario.correo,
        rol: usuario.rol_id,
        tipo
      };
    } else {
      payload = {
        id: usuario.persona_id,
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        nom_comercio: usuario.nom_comercio,
        contacto_wsp: usuario.contacto_wsp,
        correo: usuario.correo,
        rol: usuario.rol_id,
        tipo
      };
    }


    const token = await generarJWT(payload);

    // Datos para la respuesta
    let userData;
    if (tipo === "usuario") {
      userData = {
        id: usuario.persona_id,
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        correo: usuario.correo,
        rol_id: usuario.rol_id,
        tipo
      };
    } else {
      userData = {
        id: usuario.persona_id,
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        nom_comercio: usuario.nom_comercio,
        contacto_wsp: usuario.contacto_wsp,
        correo: usuario.correo,
        rol_id: usuario.rol_id,
        tipo
      };
    }

    res.status(201).json({
      ok: true,
      user: userData,
      message: 'Login exitoso',
      token,
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};



export const revalidarToken = async (req, res) => {
  const { id, tipo } = req; // id es persona_id

  let usuario;
  let userData = {};
  let persona = {};

  if (tipo === "usuario") {
    usuario = await Usuarios.findOne({
      where: { persona_id: id },
      include: { model: Persona, attributes: ["nombre", "apellidos"] }
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (!usuario.estado) {
      return res.status(403).json({ message: "Usuario inactivo" });
    }
    persona = usuario.persona || {};
    userData = {
      id: usuario.persona_id, // persona_id
      nombre: persona.nombre,
      apellidos: persona.apellidos,
      correo: usuario.correo,
      rol_id: usuario.rol_id,
      tipo
    };
  } else if (tipo === "comerciante") {
    usuario = await Comerciantes.findOne({
      where: { persona_id: id },
      include: { model: Persona, attributes: ["nombre", "apellidos"] }
    });
    if (!usuario) {
      return res.status(404).json({ message: "Comerciante no encontrado" });
    }
    if (!usuario.estado) {
      return res.status(403).json({ message: "Comerciante inactivo" });
    }
    persona = usuario.persona || {};
    userData = {
      id: usuario.persona_id, // persona_id
      nombre: persona.nombre,
      apellidos: persona.apellidos,
      nom_comercio: usuario.nom_comercio,
      contacto_wsp: usuario.contacto_wsp,
      correo: usuario.correo,
      rol_id: usuario.rol_id,
      tipo
    };
  } else {
    return res.status(400).json({ message: "Tipo de usuario no válido" });
  }

  const token = await generarJWT(userData);

  res.json({
    ok: true,
    token,
    user: userData
  });
};


// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id, tipo, act_id } = req.params; // todos vienen en params

    // Campos válidos para Persona
    const personaFields = ["nombre", "apellidos", "genero", "fech_nacimiento", "celular"];

    // Separa los campos de persona y los de usuario/comerciante
    const personaUpdate = {};
    const entidadUpdate = {};

    Object.entries(req.body).forEach(([key, value]) => {
      if (personaFields.includes(key)) {
        personaUpdate[key] = value;
      } else {
        entidadUpdate[key] = value;
      }
    });

    // Validar que el correo no esté registrado en otra entidad (usuarios o comerciantes)
    if (entidadUpdate.correo) {
      const correoExistenteUsuario = await Usuarios.findOne({
        where: {
          correo: entidadUpdate.correo        
        }
      });   

      const correoExistenteComerciante = await Comerciantes.findOne({
        where: {
          correo: entidadUpdate.correo,
          
        }
      });
  
      if (correoExistenteUsuario || correoExistenteComerciante) {
              return res.status(400).json({ message: "Correo ya registrado en otra cuenta" });
      }
    }

    // Verifica si se quiere cambiar el n_documento y que no esté registrado en otra entidad
    if (entidadUpdate.n_documento) {
      let documentoExistente;
      if (tipo === "usuario") {
        documentoExistente = await Usuarios.findOne({
          where: { n_documento: entidadUpdate.n_documento }
        });
        if (!documentoExistente) {
          documentoExistente = await Comerciantes.findOne({
            where: { n_documento: entidadUpdate.n_documento }
          });
        }
      } else if (tipo === "comerciante") {
        documentoExistente = await Comerciantes.findOne({
          where: { n_documento: entidadUpdate.n_documento}
        });
        if (!documentoExistente) {
          documentoExistente = await Usuarios.findOne({
            where: { n_documento: entidadUpdate.n_documento }
          });
        }
      }
      if (documentoExistente) {
        return res.status(400).json({ message: "Documento ya registrado en otra cuenta" });
      }
    }

    // Agrega act_id y fech_act a usuario/comerciante
    entidadUpdate.act_id = act_id;
    entidadUpdate.fech_act = new Date();

    let entidad;
    if (tipo === "usuario") {
      entidad = await Usuarios.findOne({ where: { persona_id: id } });
    } else if (tipo === "comerciante") {
      entidad = await Comerciantes.findOne({ where: { persona_id: id } });
    } else {
      return res.status(400).json({ message: "Tipo no válido" });
    }

    if (!entidad) {
      return res.status(404).json({ message: "Entidad no encontrada" });
    }

    // Actualiza los datos de persona
    await Persona.update(personaUpdate, { where: { id } });

    // Actualiza los datos de usuario/comerciante
    await entidad.update(entidadUpdate);

    res.status(200).json({
      ok: true,
      message: "Datos actualizados correctamente",
      usuario: { ...entidad.get(), ...personaUpdate },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};


// Obtener todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const { rol_id = 1, page = 1, limit = 10 } = req.query;

    const where = rol_id ? { rol_id: rol_id } : {};

    // Consulta usuarios y comerciantes SIN paginación
    const usuarios = await Usuarios.findAll({
      attributes: [ "persona_id", "n_documento", "correo", "estado", "rol_id"],
      where,
      include: [
        { model: Rol, attributes: ["rol"] },
        { model: Persona, attributes: ["nombre", "apellidos"] }
      ]
    });

    const comerciantes = await Comerciantes.findAll({
      attributes: [ "persona_id", "n_documento", "correo", "nom_comercio", "contacto_wsp", "estado", "rol_id"],
      where,
      include: [
        { model: Rol, attributes: ["rol"] },
        { model: Persona, attributes: ["nombre", "apellidos"] }
      ]
    });

    // Combina ambos resultados
    const resultado = [...usuarios, ...comerciantes];
    const total = resultado.length;

    // Aplica paginación global
    const start = (parseInt(page) - 1) * parseInt(limit);
    const end = start + parseInt(limit);
    const paginados = resultado.slice(start, end);

    // Después de obtener resultado (usuarios o comerciantes)
    const resultadoMapeado = resultado.map(item => {
      const obj = item.toJSON();
      obj.rol = obj.role?.rol || obj.rol;
      if (obj.persona) {
        obj.nombre = obj.persona.nombre;
        obj.apellidos = obj.persona.apellidos;
      }
      delete obj.role;
      delete obj.persona;
      return obj;
    });

    // En la respuesta:
    res.status(200).json({
      ok: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: resultadoMapeado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al listar usuarios y comerciantes",
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
