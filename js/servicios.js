const SERVICIOS_KEY = "servicios_pkes";
const JSON_PATH = "../assets/data/servicios.json";

function obtenerServiciosPkes() {
  return JSON.parse(localStorage.getItem(SERVICIOS_KEY)) || [];
}

function guardarServiciosPkes(servicios) {
  localStorage.setItem(SERVICIOS_KEY, JSON.stringify(servicios));
}

async function inicializarServiciosPkes() {
  const datosLocales = localStorage.getItem(SERVICIOS_KEY);
  if (datosLocales && datosLocales !== "[]") return;

  try {
    const res = await fetch(JSON_PATH);
    if (!res.ok) throw new Error("Error al cargar JSON de servicios");
    const data = await res.json();
    guardarServiciosPkes(data);
  } catch (error) {
    console.error("Fallo al cargar servicios iniciales:", error);
    guardarServiciosPkes([]);
  }
}

export {
  SERVICIOS_KEY,
  JSON_PATH,
  obtenerServiciosPkes,
  guardarServiciosPkes,
  inicializarServiciosPkes
};
