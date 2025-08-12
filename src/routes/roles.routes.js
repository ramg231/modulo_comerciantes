import { Router } from 'express';
import {
  crearRol,
  listarRoles,
  obtenerRol,
  actualizarRol,
  eliminarRol,
} from '../controllers/roles.controller.js';

const router = Router();

router.post('/rol/crear', crearRol);
router.get('/rol', listarRoles);
router.get('/rol/:id', obtenerRol);
router.put('/rol/:id', actualizarRol);
router.delete('rol/:id', eliminarRol);

export default router;
