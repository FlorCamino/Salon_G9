const RESERVAS_KEY = "reservas_pkes";
const RESERVAS_JSON_PATH = "../assets/data/reservas.json";

function obtenerReservas() {
  return JSON.parse(localStorage.getItem(RESERVAS_KEY)) || [];
}

function guardarReservas(reservas) {
  localStorage.setItem(RESERVAS_KEY, JSON.stringify(reservas));
}

async function inicializarReservas() {
  try {
    const reservasExistentes = obtenerReservas();
    const response = await fetch(RESERVAS_JSON_PATH);
    if (!response.ok) throw new Error("Error al cargar JSON de reservas");

    const reservasJSON = await response.json();
    const idsExistentes = new Set(reservasExistentes.map(r => r.id));
    const nuevasReservas = reservasJSON.filter(r => !idsExistentes.has(r.id));

    const reservasCombinadas = [...reservasExistentes, ...nuevasReservas];
    guardarReservas(reservasCombinadas);
    return true;

  } catch (error) {
    console.error("Fallo al cargar reservas iniciales:", error);
    if (!localStorage.getItem(RESERVAS_KEY)) {
      localStorage.setItem(RESERVAS_KEY, JSON.stringify([]));
    }
  }
}

export {
  RESERVAS_KEY,
  RESERVAS_JSON_PATH,
  obtenerReservas,
  guardarReservas,
  inicializarReservas
};
