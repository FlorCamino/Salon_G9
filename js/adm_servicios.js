document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "servicios_pkes";

  const SERVICIOS_INIT = [
    {
      id: 1,
      titulo: "Animación Infantil",
      descripcion: "¡Diversión asegurada! Payasos, juegos, y globología para todas las edades.",
      detalles: ["Payasos", "Globología", "Juegos temáticos"],
      img: "../assets/img/animacion_infantil.jpg"
    },
    {
      id: 2,
      titulo: "Catering Infantil",
      descripcion: "Opciones saludables y deliciosas adaptadas a los gustos de los más pequeños.",
      detalles: ["Mesa dulce", "Snacks saludables", "Jugos naturales"],
      img: "../assets/img/catering_infantil.jpg"
    },
    {
      id: 3,
      titulo: "Decoración Temática",
      descripcion: "Convertimos tu fiesta en un mundo de fantasía con la temática que elijas.",
      detalles: ["Globos", "Backdrops", "Centros de mesa"],
      img: "../assets/img/decoracion_tematica.jpg"
    },
    {
      id: 4,
      titulo: "Show de Magia",
      descripcion: "Un mago profesional sorprenderá a grandes y chicos con trucos increíbles.",
      detalles: ["Trucos con cartas", "Magia con participación", "Regalos sorpresa"],
      img: "../assets/img/disfraces.jpg"
    },
    {
      id: 5,
      titulo: "Alquiler de Juegos",
      descripcion: "Diversión garantizada con castillos inflables, camas elásticas y más.",
      detalles: ["Castillo inflable", "Metegol", "Cama elástica"],
      img: "../assets/img/Castillo_inflable.jpg"
    }
  ];

  const form = document.getElementById("form-servicio");
  const lista = document.getElementById("lista-servicios");
  const btnSubmit = document.getElementById("btn-submit");
  let editandoId = null;

  function inicializarServicios() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SERVICIOS_INIT));
    }
  }

  function obtenerServicios() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function guardarServicios(servicios) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servicios));
  }

  function resetFormulario() {
    form.reset();
    editandoId = null;
    btnSubmit.textContent = "Agregar Servicio";
    renderizarServicios();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const detalles = document.getElementById("detalles").value.split(",").map(d => d.trim());
    const archivo = document.getElementById("img").files[0];

    const servicios = obtenerServicios();

    if (editandoId) {
      const index = servicios.findIndex(s => s.id === editandoId);
      if (index === -1) return;

      const actualizar = (imgBase64) => {
        servicios[index] = {
          ...servicios[index],
          titulo,
          descripcion,
          detalles,
          ...(imgBase64 && { img: imgBase64 })
        };
        guardarServicios(servicios);
        resetFormulario();
      };

      if (archivo) {
        const reader = new FileReader();
        reader.onload = (event) => actualizar(event.target.result);
        reader.readAsDataURL(archivo);
      } else {
        actualizar(null);
      }

    } else {
      if (!archivo) {
        alert("Debe seleccionar una imagen.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        const nuevoServicio = {
          id: Date.now(),
          titulo,
          descripcion,
          detalles,
          img: event.target.result
        };
        servicios.push(nuevoServicio);
        guardarServicios(servicios);
        resetFormulario();
      };
      reader.readAsDataURL(archivo);
    }
  });

  function renderizarServicios() {
    const servicios = obtenerServicios();
    if (servicios.length === 0) {
      lista.innerHTML = "<p class='text-center'>No hay servicios registrados.</p>";
      return;
    }

    let html = "";
    for (let i = 0; i < servicios.length; i += 3) {
      const grupo = servicios.slice(i, i + 3);
      html += `
        <div class="carousel-item ${i === 0 ? "active" : ""}">
          <div class="card-group">
            ${grupo.map(s => `
              <div class="card">
                <div class="img-wrapper">
                  <img src="${s.img}" class="card-img-top" alt="${s.titulo}">
                </div>
                <div class="card-body">
                  <h5 class="card-title text-dark fw-semibold">${s.titulo}</h5>
                  <p><strong>${s.detalles[0]}</strong></p>
                  <p class="card-text">${s.descripcion}</p>
                  <ul>
                    ${s.detalles.slice(1).map(d => `<li><i class="fa-solid fa-check text-success me-2"></i>${d}</li>`).join("")}
                  </ul>
                  <button type="button" class="btn" onclick="ver(${s.id})"><i class="fa-solid fa-eye"></i></button>
                  <button type="button" class="btn" onclick="editar(${s.id})"><i class="fa-solid fa-gear"></i></button>
                  <button type="button" class="btn" onclick="eliminar(${s.id})"><i class="fa-solid fa-xmark"></i></button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    lista.innerHTML = html;
  }

  window.eliminar = function (id) {
    if (confirm("¿Estás seguro que querés eliminar este servicio?")) {
      const servicios = obtenerServicios().filter(s => s.id !== id);
      guardarServicios(servicios);
      renderizarServicios();
    }
  };

  window.editar = function (id) {
    const servicio = obtenerServicios().find(s => s.id === id);
    if (!servicio) return;

    document.getElementById("titulo").value = servicio.titulo;
    document.getElementById("descripcion").value = servicio.descripcion;
    document.getElementById("detalles").value = servicio.detalles.join(", ");
    editandoId = servicio.id;
    btnSubmit.textContent = "Guardar Cambios";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.ver = function (id) {
    window.location.href = `ver_servicio.html?id=${id}`;
  };

  inicializarServicios();
  renderizarServicios();
});
