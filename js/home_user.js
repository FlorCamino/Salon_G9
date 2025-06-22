import { GestorDatos } from './gestordedatos.js';

document.addEventListener("DOMContentLoaded", async () => {
  await GestorDatos.init();

  cargarTarjetasSalones();
  cargarTarjetasServicios();
});

function cargarTarjetasSalones() {
  const galeria = document.getElementById("galeria-salones");
  const salones = GestorDatos.obtenerSalones();
  galeria.innerHTML = "";

  salones.slice(0, 2).forEach(salon => {
    const div = document.createElement("div");
    div.className = "salon-card";

    div.innerHTML = `
      <img src="${salon.img}" alt="${salon.nombre}">
      <div class="salon-content">
        <h3>${salon.nombre}</h3>
        <ul>
          ${salon.detalles.map(d => `<li><i class="fa fa-check text-success"></i> ${d}</li>`).join("")}
        </ul>
      </div>
    `;
    galeria.appendChild(div);
  });
}

function cargarTarjetasServicios() {
  const contenedor = document.getElementById("carousel-servicios");
  const servicios = GestorDatos.obtenerServicios().filter(s => s.estado === "Activo");
  contenedor.innerHTML = "";

  servicios.slice(0, 2).forEach(servicio => {
    const div = document.createElement("div");
    div.className = "servicio";

    div.innerHTML = `
      <img src="${servicio.img}" alt="${servicio.titulo}">
      <div class="servicio-content">
        <h3>${servicio.titulo}</h3>
        <p>${servicio.descripcion}</p>
      </div>
    `;
    contenedor.appendChild(div);
  });
}
