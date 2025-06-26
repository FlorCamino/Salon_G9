const SALONES_KEY = "salones_pkes";
const JSON_PATH = "../assets/data/salones.json";

function obtenerSalones() {
    return JSON.parse(localStorage.getItem(SALONES_KEY)) || [];
}

function guardarSalones(salones) {
    localStorage.setItem(SALONES_KEY, JSON.stringify(salones));
}

async function inicializarSalones() {
  const datosExistentes = localStorage.getItem(SALONES_KEY);

  if (datosExistentes && JSON.parse(datosExistentes).length > 0) {
    return; 
  }

  try {
    const response = await fetch(JSON_PATH);
    if (!response.ok) throw new Error("Error al cargar JSON de salones");
    const data = await response.json();
    localStorage.setItem(SALONES_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Fallo al cargar salones iniciales:", error);
    localStorage.setItem(SALONES_KEY, JSON.stringify([]));
  }
}

export {
    SALONES_KEY,
    JSON_PATH,
    obtenerSalones,
    guardarSalones,
    inicializarSalones
};