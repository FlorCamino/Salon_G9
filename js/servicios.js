const SERVICIOS_KEY = "servicios_pkes";
const JSON_PATH = "../assets/data/servicios.json";

function obtenerServicios() {
  return JSON.parse(localStorage.getItem(SERVICIOS_KEY)) || [];
}

function guardarServicios(servicios) {
  localStorage.setItem(SERVICIOS_KEY, JSON.stringify(servicios));
}

async function cargarServiciosIniciales() {
  const datosLocales = localStorage.getItem(SERVICIOS_KEY);
  if (datosLocales && datosLocales !== "[]") return;

  try {
    const res = await fetch(JSON_PATH);
    if (!res.ok) throw new Error("Error al cargar JSON de servicios");
    const data = await res.json();
    guardarServicios(data);
  } catch (error) {
    console.error("Fallo al cargar servicios iniciales:", error);
    guardarServicios([]);
  }
}

export {
  SERVICIOS_KEY,
  JSON_PATH,
  obtenerServicios,
  guardarServicios,
  cargarServiciosIniciales
};
