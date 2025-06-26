import {
  obtenerSalonesPkes,
  guardarSalonesPkes,
  iniciarSalonesPkes
} from './salones.js';

import {
  obtenerServiciosPkes,
  guardarServiciosPkes,
  inicializarServiciosPkes
} from './servicios.js';

export const GestorDatos = {
  async init() {
    try {
      await iniciarSalonesPkes();
      await inicializarServiciosPkes();
      return true;
    } catch (e) {
      console.error("Error al inicializar datos:", e);
      return false;
    }
  },

  obtenerSalonesPkes,
  guardarSalonesPkes,
  obtenerServiciosPkes,
  guardarServiciosPkes
};
