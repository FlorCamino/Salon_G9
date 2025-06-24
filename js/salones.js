const SALONES_KEY = "salones_pkes";
const JSON_PATH = "../assets/data/salones.json";

function obtenerSalones() {
    return JSON.parse(localStorage.getItem(SALONES_KEY)) || [];
}

function guardarSalones(salones) {
    localStorage.setItem(SALONES_KEY, JSON.stringify(salones));
}

async function cargarSalonesIniciales() {
  return fetch("../assets/data/salones.json")
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar JSON de salones");
      return response.json();
    })
    .then(data => {
      localStorage.setItem("salones_pkes", JSON.stringify(data));
    })
    .catch(error => {
      console.error("Fallo al cargar salones iniciales:", error);
      localStorage.setItem("salones_pkes", JSON.stringify([]));
    });
}

export {
    SALONES_KEY,
    JSON_PATH,
    obtenerSalones,
    guardarSalones,
    cargarSalonesIniciales
};