document.addEventListener("DOMContentLoaded", () => {
  // Validación de clave
  const clave = prompt("Ingrese la clave de administrador:");
  if (clave !== "admin123") {
    alert("Acceso denegado");
    location.href = "../index.html";
    return;
  }

  const form = document.getElementById("form-servicio");
  const lista = document.getElementById("lista-servicios");
  const btnSubmit = document.getElementById("btn-submit");

  let editandoId = null;

  // Scroll horizontal con flechas
  const scrollLeft = document.getElementById("scroll-left");
  const scrollRight = document.getElementById("scroll-right");

  if (scrollLeft && scrollRight) {
    scrollLeft.addEventListener("click", () => {
      lista.scrollBy({ left: -300, behavior: "smooth" });
    });

    scrollRight.addEventListener("click", () => {
      lista.scrollBy({ left: 300, behavior: "smooth" });
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const detalles = document.getElementById("detalles").value.split(",").map(d => d.trim());
    const archivo = document.getElementById("img").files[0];

    if (editandoId) {
      const servicios = obtenerServicios();
      const servicioIndex = servicios.findIndex(s => s.id === editandoId);

      if (archivo) {
        const reader = new FileReader();
        reader.onload = function (event) {
          servicios[servicioIndex] = {
            ...servicios[servicioIndex],
            titulo,
            descripcion,
            detalles,
            img: event.target.result
          };
          guardarServicios(servicios);
          resetFormulario();
        };
        reader.readAsDataURL(archivo);
      } else {
        servicios[servicioIndex] = {
          ...servicios[servicioIndex],
          titulo,
          descripcion,
          detalles
        };
        guardarServicios(servicios);
        resetFormulario();
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
          img: event.target.result,
          detalles
        };
        const servicios = obtenerServicios();
        servicios.push(nuevoServicio);
        guardarServicios(servicios);
        resetFormulario();
      };
      reader.readAsDataURL(archivo);
    }
  });

  function resetFormulario() {
    form.reset();
    editandoId = null;
    btnSubmit.textContent = "Agregar Servicio";
    renderizarServicios();
  }

  function renderizarServicios() {
    const servicios = obtenerServicios();
    if (servicios.length === 0) {
      lista.innerHTML = "<p style='text-align:center;'>No hay servicios registrados.</p>";
      return;
    }

    lista.innerHTML = servicios.map(s => `
      <div class="servicio">
        <img src="${s.img}" alt="${s.titulo}">
        <div class="servicio-content">
          <h3>${s.titulo}</h3>
          <p>${s.descripcion}</p>
          <ul class="detalles-servicio">
            ${s.detalles.map(d => `<li><i class="fa-solid fa-check"></i> ${d}</li>`).join("")}
          </ul>
          <button class="boton primario" onclick="editar(${s.id})">Editar</button>
          <button class="boton peligro" onclick="eliminar(${s.id})">Eliminar</button>
        </div>
      </div>
    `).join("");
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

  function obtenerServicios() {
    return JSON.parse(localStorage.getItem("servicios_pkes")) || [];
  }

  function guardarServicios(servicios) {
    localStorage.setItem("servicios_pkes", JSON.stringify(servicios));
  }

  renderizarServicios();
});
