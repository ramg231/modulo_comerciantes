//routes
import { Router } from 'express';
import { actualizarUsuario,crearUsuario,desactivarUsuario,listarUsuarios,loginUsuario,obtenerUsuario,revalidarToken } from '../controllers/usuario.controller.js';
import { validarJWT } from '../middlewares/validarJWT.js';
import { tienePermiso } from '../middlewares/tienePermiso.js';

const router = Router();
// Ruta para crear un nuevo usuario
  
// router.post('/crear', validarJWT, tienePermiso("crear_usuario"),crearUsuario);      
router.post('/usuario/crear',crearUsuario); 
// Ruta para iniciar sesión
router.post('/usuario/login', loginUsuario);
// Ruta para revalidar el token
router.get('/usuario/revalidar', validarJWT, revalidarToken);   
// Ruta para listar todos los usuariosnpm
router.get('/usuario/' ,  listarUsuarios);    
// Ruta para obtener un usuario por ID
router.get('/usuario/:id', obtenerUsuario);
// Ruta para actualizar un usuario
router.put('/usuario/:id', actualizarUsuario);
// Ruta para desactivar un usuario
router.delete('/usuario/:id', validarJWT, desactivarUsuario);
// Ruta para activar un usuario (opcional, si se implementa)
// router.put('/activar/:id', validarJWT, activarUsuario); // Si decides implementar una ruta para activar usuarios
export default router;

 