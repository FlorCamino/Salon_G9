document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "servicios_pkes";
  const JSON_PATH = "../assets/data/servicios.json";

  const form = document.getElementById("form-servicio");
  const lista = document.getElementById("lista-servicios");
  const btnSubmit = document.getElementById("btn-submit");
  let editandoId = null;

  function cargarServiciosDesdeJSON() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      fetch(JSON_PATH)
        .then(response => {
          if (!response.ok) throw new Error("Error al cargar JSON");
          return response.json();
        })
        .then(data => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          renderizarServicios();
        })
        .catch(error => {
          console.error("Fallo al inicializar servicios:", error);
        });
    } else {
      renderizarServicios();
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
    const precio = parseInt(document.getElementById("precio").value.trim());
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
          precio,
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
          precio,
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
          <div class="d-flex justify-content-center gap-4 flex-wrap px-4">
            ${grupo.map(s => `
              <div class="card" style="width: 37rem; min-height: 100%; display: flex; flex-direction: column;">
                <div class="img-wrapper">
                  <img src="${s.img}" class="card-img-top" alt="${s.titulo}">
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title text-dark fw-semibold">${s.titulo}</h5>
                  <p><strong>${s.detalles[0]}</strong></p>
                  <p class="card-text">${s.descripcion}</p>
                  <p class="text-muted"><small>Precio: $${s.precio.toLocaleString("es-AR")}</small></p>
                  <ul>
                    ${s.detalles.slice(1).map(d => `<li><i class="fa-solid fa-check text-success me-2"></i>${d}</li>`).join("")}
                  </ul>
                  <div class="mt-auto">
                    <button type="button" class="btn" onclick="ver(${s.id})"><i class="fa-solid fa-eye"></i></button>
                    <button type="button" class="btn" onclick="editar(${s.id})"><i class="fa-solid fa-gear"></i></button>
                    <button type="button" class="btn" onclick="eliminar(${s.id})"><i class="fa-solid fa-xmark"></i></button>
                  </div>
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
    document.getElementById("precio").value = servicio.precio || "";
    editandoId = servicio.id;
    btnSubmit.textContent = "Guardar Cambios";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.ver = function (id) {
    window.location.href = `ver_servicio.html?id=${id}`;
  };

  cargarServiciosDesdeJSON();
});