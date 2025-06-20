const SALONES_KEY = "salones_pkes";
const SERVICIOS_KEY = "servicios_pkes";

const SALONES_JSON = "../assets/data/salones.json";
const SERVICIOS_JSON = "../assets/data/servicios.json";

export const GestorDatos = {
  async init() {
    try {
      await this.cargarSalonesIniciales();
      await this.cargarServiciosIniciales();
      return true;
    } catch (e) {
      console.error("Error al inicializar datos:", e);
      return false;
    }
  },

  obtenerSalones() {
    return JSON.parse(localStorage.getItem(SALONES_KEY)) || [];
  },

  guardarSalones(salones) {
    localStorage.setItem(SALONES_KEY, JSON.stringify(salones));
  },

  async cargarSalonesIniciales() {
    const yaCargado = localStorage.getItem(SALONES_KEY);
    if (yaCargado) return;

    try {
      const res = await fetch(SALONES_JSON);
      if (!res.ok) throw new Error("No se pudo cargar salones.json");
      const data = await res.json();
      this.guardarSalones(data);
    } catch (e) {
      console.error("Fallo al cargar salones iniciales:", e);
      localStorage.setItem(SALONES_KEY, JSON.stringify([]));
    }
  },

  obtenerServicios() {
    return JSON.parse(localStorage.getItem(SERVICIOS_KEY)) || [];
  },

  guardarServicios(servicios) {
    localStorage.setItem(SERVICIOS_KEY, JSON.stringify(servicios));
  },

  async cargarServiciosIniciales() {
    const yaCargado = localStorage.getItem(SERVICIOS_KEY);
    if (yaCargado) return;

    try {
      const res = await fetch(SERVICIOS_JSON);
      if (!res.ok) throw new Error("No se pudo cargar servicios.json");
      const data = await res.json();
      this.guardarServicios(data);
    } catch (e) {
      console.error("Fallo al cargar servicios iniciales:", e);
      localStorage.setItem(SERVICIOS_KEY, JSON.stringify([]));
    }
  }
};
