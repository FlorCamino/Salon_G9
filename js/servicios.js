const SERVICIOS_KEY = "servicios_pkes";
const JSON_PATH = "../assets/data/servicios.json";

export function obtenerServicios() {
  return JSON.parse(localStorage.getItem(SERVICIOS_KEY)) || [];
}

export function guardarServicios(servicios) {
  localStorage.setItem(SERVICIOS_KEY, JSON.stringify(servicios));
}

export function cargarServiciosIniciales() {
  if (localStorage.getItem(SERVICIOS_KEY)) return Promise.resolve();

  return fetch(JSON_PATH)
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar servicios.json");
      return response.json();
    })
    .then(data => {
      guardarServicios(data);
    })
    .catch(error => {
      console.error("Error al cargar servicios iniciales:", error);
      guardarServicios([]);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarServiciosIniciales();

  const servicios = obtenerServicios();
  const contenedor = document.getElementById("contenedor-servicios");
  if (!contenedor || !servicios.length) return;

  contenedor.innerHTML = servicios.map(servicio => `
    <div class="col-12 col-md-4">
      <div class="servicio-card">
        <img src="${servicio.img}" class="img-fluid" alt="${servicio.titulo}">
        <h3>${servicio.titulo}</h3>
        <p>${servicio.descripcion}</p>
        <ul>
          ${servicio.detalles.map(det => `<li><i class="fa-solid fa-check"></i>${det}</li>`).join("")}
        </ul>
        <a href="crear_presupuesto.html" class="boton">Agregar al presupuesto</a>
      </div>
    </div>
  `).join("");
});
