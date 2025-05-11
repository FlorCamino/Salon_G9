document.addEventListener("DOMContentLoaded", () => {
  const salonPrecios = {
    "Salon Arcoiris": 20000,
    "Salon Estrella": 25000,
    "Salon Magia": 18000
  };

  const salonSelect = document.getElementById("salon");
  const costoSalonInput = document.getElementById("costo-salon");
  const checkboxes = document.querySelectorAll("input[name='servicios']");
  const totalInput = document.getElementById("total");
  const form = document.getElementById("formPresupuesto");

  // === CREAR PRESUPUESTO ===
  if (form) {
    let currentStep = 1;
    const totalSteps = 3;

    const alerta = document.getElementById("alertaValidacion");
    const mensajeAlerta = document.getElementById("mensajeAlerta");

    const mostrarAlerta = (mensaje) => {
      mensajeAlerta.innerHTML = `${mensaje}`;
      alerta.classList.remove("d-none");
    };

    const ocultarAlerta = () => {
      alerta.classList.add("d-none");
    };

    function calcularTotal() {
      let total = 0;
      const salon = salonSelect.value;
      if (salonPrecios[salon]) {
        total += salonPrecios[salon];
      }

      checkboxes.forEach(cb => {
        if (cb.checked) {
          total += parseInt(cb.dataset.precio);
        }
      });

      totalInput.value = `$${total.toLocaleString("es-AR")}`;
    }

    function showStep(step) {
      document.querySelectorAll('.step').forEach((el, i) => {
        el.classList.toggle('d-none', i !== (step - 1));
      });

      const progress = document.getElementById('progress-bar');
      if (progress) {
        const porcentaje = Math.round((step / totalSteps) * 100);
        progress.style.width = `${porcentaje}%`;
        progress.innerText = `Paso ${step} de ${totalSteps}`;
        progress.setAttribute('aria-valuenow', step);
      }

      ocultarAlerta();
    }

    window.nextStep = () => {
      ocultarAlerta();

      if (currentStep === 1) {
        const nombre = document.getElementById("nombre").value.trim();
        const fecha = document.getElementById("fecha").value.trim();
        const invitados = document.getElementById("invitados").value.trim();

        if (!nombre || !fecha || !invitados) {
          mostrarAlerta("Completá todos los campos del <strong>Paso 1</strong> para poder continuar.");
          return;
        }
      }

      if (currentStep === 2) {
        const duracion = document.getElementById("duracion").value;
        const salon = document.getElementById("salon").value;

        if (!duracion || !salon) {
          mostrarAlerta("Seleccioná la <strong>duración del evento</strong> y el <strong>salón</strong> antes de continuar.");
          return;
        }
      }

      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
      }
    };

    window.prevStep = () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    };

    salonSelect?.addEventListener("change", () => {
      const salon = salonSelect.value;
      costoSalonInput.value = salonPrecios[salon]
        ? `$${salonPrecios[salon].toLocaleString("es-AR")}`
        : "";
      calcularTotal();
    });

    checkboxes.forEach(cb => cb.addEventListener("change", calcularTotal));
    showStep(currentStep);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const serviciosSeleccionados = [];
      document.querySelectorAll("input[name='servicios']:checked").forEach(cb => {
        serviciosSeleccionados.push({
          nombre: cb.value,
          precio: `$${parseInt(cb.dataset.precio).toLocaleString("es-AR")}`,
          descripcion: cb.nextElementSibling?.textContent.trim() || ""
        });
      });

      const presupuesto = {
        id: `PKES-2025-${Math.floor(1000 + Math.random() * 9000)}`,
        nombre: document.getElementById("nombre").value,
        fecha: document.getElementById("fecha").value,
        invitados: document.getElementById("invitados").value,
        duracion: document.getElementById("duracion").value,
        salon: document.getElementById("salon").value,
        costoSalon: document.getElementById("costo-salon").value,
        servicios: serviciosSeleccionados,
        notas: document.getElementById("notas").value,
        total: document.getElementById("total").value
      };

      localStorage.setItem("presupuestoActual", JSON.stringify(presupuesto));
      window.location.href = "ver_presupuesto.html";
    });
  }

  const btnNuevoPresupuesto = document.getElementById("btnNuevoPresupuesto");
  if (btnNuevoPresupuesto) {
    btnNuevoPresupuesto.addEventListener("click", function () {
      localStorage.removeItem("presupuestoActual");
      window.location.href = "crear_presupuesto.html";
    });
  }


  // === VER PRESUPUESTO ===
  const resumenBox = document.querySelector(".presupuesto");
  if (resumenBox && !form) {
    const datos = JSON.parse(localStorage.getItem("presupuestoActual"));

    if (!datos) {
      alert("No se encontraron datos del presupuesto.");
      window.location.href = "crear_presupuesto.html";
      return;
    }

    document.getElementById("presupuesto-id").textContent = datos.id || "";
    document.getElementById("cliente-nombre").textContent = datos.nombre || "";
    document.getElementById("evento-fecha").textContent = datos.fecha || "";
    document.getElementById("evento-invitados").textContent = datos.invitados || "";
    document.getElementById("evento-duracion").textContent = datos.duracion || "";
    document.getElementById("evento-salon").textContent = datos.salon || "";
    document.getElementById("evento-costo-salon").textContent = datos.costoSalon || "";
    document.getElementById("evento-notas").textContent = datos.notas || "";
    document.getElementById("evento-total").textContent = datos.total || "";

    const listaServicios = document.getElementById("lista-servicios");
    if (Array.isArray(datos.servicios)) {
      listaServicios.innerHTML = "";
      datos.servicios.forEach(servicio => {
        const li = document.createElement("li");
        li.innerHTML = `
          <i class="fas fa-check-circle"></i> ${servicio.nombre} - ${servicio.precio}<br>
          <small>${servicio.descripcion}</small>
        `;
        listaServicios.appendChild(li);
      });
    }
  }
});

  // === EDITAR PRESUPUESTO ===
  const datosGuardados = JSON.parse(localStorage.getItem("presupuestoActual"));
  if (datosGuardados) {
    document.getElementById("nombre").value = datosGuardados.nombre || "";
    document.getElementById("fecha").value = datosGuardados.fecha || "";
    document.getElementById("invitados").value = datosGuardados.invitados || "";
    document.getElementById("duracion").value = datosGuardados.duracion || "";
    document.getElementById("salon").value = datosGuardados.salon || "";
  
    salonSelect.dispatchEvent(new Event("change"));
  
    if (Array.isArray(datosGuardados.servicios)) {
      datosGuardados.servicios.forEach(s => {
        const cb = document.querySelector(`input[name="servicios"][value="${s.nombre}"]`);
        if (cb) cb.checked = true;
      });
    }
  
    document.getElementById("notas").value = datosGuardados.notas || "";
    calcularTotal(); 
  }
  
