const SERVICIOS_KEY = "servicios_pkes";
const JSON_PATH = "../assets/data/servicios.json";

function obtenerServicios() {
    return JSON.parse(localStorage.getItem(SERVICIOS_KEY)) || [];
}

function guardarServicios(servicios) {
    localStorage.setItem(SERVICIOS_KEY, JSON.stringify(servicios));
}

function cargarServiciosIniciales() {
    if (localStorage.getItem(SERVICIOS_KEY)) return Promise.resolve();

    return fetch(JSON_PATH)
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar JSON de servicios");
            return response.json();
        })
        .then(data => {
            localStorage.setItem(SERVICIOS_KEY, JSON.stringify(data));
        })
        .catch(error => {
            console.error("Fallo al cargar servicios iniciales:", error);
            localStorage.setItem(SERVICIOS_KEY, JSON.stringify([]));
        });
}

export {
    SERVICIOS_KEY,
    JSON_PATH,
    obtenerServicios,
    guardarServicios,
    cargarServiciosIniciales
};
