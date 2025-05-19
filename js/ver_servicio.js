document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "servicios_pkes";
  const detalle = document.getElementById("detalle-servicio");

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const servicios = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const servicio = servicios.find(s => s.id === id);

  if (!servicio) {
    detalle.innerHTML = "<div class='alert alert-danger text-center'>Servicio no encontrado.</div>";
    return;
  }

  detalle.classList.add("card", "shadow", "mx-auto");

  detalle.innerHTML = `
    <div class="img-wrapper">
      <img src="${servicio.img}" class="detalle-img" alt="${servicio.titulo}">
    </div>
    <div class="card-body detalle-body">
      <h3 class="card-title">${servicio.titulo}</h3>
      <p><strong>${servicio.detalles[0]}</strong></p>
      <p>${servicio.descripcion}</p>
      <ul>
        ${servicio.detalles.slice(1).map(d => `
          <li><i class="fa-solid fa-check"></i> ${d}</li>
        `).join("")}
      </ul>
      <a href="adm_servicios.html" class="btn btn-volver mt-3">
        <i class="fa fa-arrow-left"></i> Volver
      </a>
    </div>
  `;
});
