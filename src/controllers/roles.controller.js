import { Rol } from '../database/syncModels.js';

// Crear rol
export const crearRol = async (req, res) => {
  try {
    const { rol, creacion_id, descripcion = "" } = req.body;

    const existe = await Rol.findOne({ where: { rol } });
    if (existe) {
      return res.status(400).json({ message: 'El rol ya existe' });
    }

    const nuevoRol = await Rol.create({ rol, creacion_id, descripcion, estado: true });
    res.status(201).json({
      ok: true,
      message: 'Rol creado con éxito',
      id: nuevoRol.id,
      rol: nuevoRol.rol, 
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
      attributes: ['id', 'rol', 'descripcion', 'estado'] 
    });
    res.status(200).json(roles); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar roles' });
  }
};


// Obtener un rol por ID
export const obtenerRol = async (req, res) => {
  const {id} = req.params
  try {
     const rol = await Rol.findByPk(id, { attributes: ['id', 'rol', 'descripcion', 'estado'] });
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.status(200).json(rol); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener rol' });
  }
};

// Actualizar rol
export const actualizarRol = async (req, res) => {
  const { id } = req.params;
  const{estado, act_id} = req.body
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
      const changeestado = !estado; // invierte el valor

     await rol.update({ estado: changeestado, act_id, fech_act: new Date() });
    res.status(201).json({
      message: 'El rol ha sido actualizado correctamente',
   
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
