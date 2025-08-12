import { Rol } from '../database/syncModels.js';

// Crear rol
export const crearRol = async (req, res) => {
  try {
    const { nombre } = req.body;

    const existe = await Rol.findOne({ where: { nombre } });
    if (existe) {
      return res.status(400).json({ message: 'El rol ya existe' });
    }

    const nuevoRol = await Rol.create({ nombre });
    res.status(201).json({
      ok:true,
      message: 'Rol creado con éxito',
      rol: nuevoRol,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear rol' });
  }
};

// Obtener todos los roles
export const listarRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll({
      attributes: ['id', 'nombre'] // 👈 solo estos campos
    });
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar roles' });
  }
};


// Obtener un rol por ID
export const obtenerRol = async (req, res) => {
  try {
    const rol = await Rol.findByPk(req.params.id);
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener rol' });
  }
};

// Actualizar rol
export const actualizarRol = async (req, res) => {
  try {
    const rol = await Rol.findByPk(req.params.id);
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    await rol.update(req.body);
    res.json({
      message: 'Rol actualizado correctamente',
      rol,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar rol' });
  }
};

// Eliminar rol
export const eliminarRol = async (req, res) => {
  try {
    const rol = await Rol.findByPk(req.params.id);
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    await rol.destroy();
    res.json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar rol' });
  }
};
