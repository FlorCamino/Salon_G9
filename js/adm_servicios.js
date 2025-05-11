document.addEventListener("DOMContentLoaded", () => {
  
    const form = document.getElementById("form-servicio");
    const lista = document.getElementById("lista-servicios");
    const btnSubmit = document.getElementById("btn-submit");
  
    let editandoId = null;
  
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
      
        let html = '';
        for (let i = 0; i < servicios.length; i += 3) {
          const grupo = servicios.slice(i, i + 3);
          html += `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
              <div class="card-group">
                ${grupo.map(s => `
                  <div class="card">
                    <div class="img-wrapper">
                      <img src="${s.img}" class="card-img-top" alt="${s.titulo}">
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">${s.titulo}</h5>
                      <h6 class="card-subtitle">${s.detalles[0]}</h6>
                      <p class="card-text">${s.descripcion}</p>
                      <ul class="card-text">
                        ${s.detalles.slice(1).map(d => `<li><i class="fa-solid fa-check"></i> ${d}</li>`).join('')}
                      </ul>
                      <button type="button" class="btn btn-primary" onclick="editar(${s.id})"><i class="fa-solid fa-eye"></i></button>
                      <button type="button" class="btn btn-primary" onclick="editar(${s.id})"><i class="fa-solid fa-gear"></i></button>
                      <button type="button" class="btn btn-primary" onclick="eliminar(${s.id})"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                  </div>
                `).join('')}
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
  
    function obtenerServicios() {
      return JSON.parse(localStorage.getItem("servicios_pkes")) || [];
    }
  
    function guardarServicios(servicios) {
      localStorage.setItem("servicios_pkes", JSON.stringify(servicios));
    }
  
    renderizarServicios();
  });