import {
  obtenerSalones,
  guardarSalones,
  inicializarSalones
} from './salones.js';

import {
  obtenerServicios,
  guardarServicios,
  inicializarServicios
} from './servicios.js';

export const GestorDatos = {
  async init() {
    try {
      await inicializarSalones();
      await inicializarServicios();
      return true;
    } catch (e) {
      console.error("Error al inicializar datos:", e);
      return false;
    }
  },

  obtenerSalones,
  guardarSalones,
  obtenerServicios,
  guardarServicios
};
