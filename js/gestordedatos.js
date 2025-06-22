import {
  obtenerSalones,
  guardarSalones,
  cargarSalonesIniciales
} from './salones.js';

import {
  obtenerServicios,
  guardarServicios,
  cargarServiciosIniciales
} from './servicios.js';

export const GestorDatos = {
  async init() {
    try {
      await cargarSalonesIniciales();
      await cargarServiciosIniciales();
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
