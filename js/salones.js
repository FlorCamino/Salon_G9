const SALONES_KEY = "salones_pkes";
const JSON_PATH = "../assets/data/salones.json";

function obtenerSalones() {
    return JSON.parse(localStorage.getItem(SALONES_KEY)) || [];
}

function guardarSalones(salones) {
    localStorage.setItem(SALONES_KEY, JSON.stringify(salones));
}

function cargarSalonesIniciales() {
  const datosLocales = localStorage.getItem(SALONES_KEY);
  if (datosLocales && datosLocales !== "[]") return Promise.resolve();

  return fetch(JSON_PATH)
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar JSON");
      return response.json();
    })
    .then(data => {
      localStorage.setItem(SALONES_KEY, JSON.stringify(data));
      return true;
    })
    .catch(error => {
      console.error("Fallo al cargar salones iniciales:", error);
      localStorage.setItem(SALONES_KEY, JSON.stringify([]));
    });
}

export {
    SALONES_KEY,
    JSON_PATH,
    obtenerSalones,
    guardarSalones,
    cargarSalonesIniciales
};