import { guardarReservasPkes } from './reservas.js';
import {
  obtenerServiciosPkes,
  inicializarServiciosPkes
} from './servicios.js';
import {
  obtenerSalonesPkes,
  iniciarSalonesPkes
} from './salones.js';

let salonesFiltradosPorFecha = [];

document.addEventListener("DOMContentLoaded", async () => {

  const rutaActual = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const esCrearPresupuesto = rutaActual.includes("crear_presupuesto.html");
  const modoEdicion = urlParams.get("editar") === "1";

  if (esCrearPresupuesto && !modoEdicion) {
    localStorage.removeItem("presupuestoActual");
  } 
  
  await inicializarServiciosPkes();
  await iniciarSalonesPkes();

  const salonSelect = document.getElementById("salon");
  const capacidadSelect = document.getElementById("capacidad");
  const costoSalonInput = document.getElementById("costo-salon");
  const totalInput = document.getElementById("total");
  const form = document.getElementById("formPresupuesto");
  const fechaInput = document.getElementById("fecha");

  const salones = obtenerSalonesPkes();
  const servicios = obtenerServiciosPkes();

  const alerta = document.getElementById("alertaValidacion");
  const mensajeAlerta = document.getElementById("mensajeAlerta");

  const mostrarAlerta = (mensaje) => {
    mensajeAlerta.innerHTML = mensaje;
    alerta.classList.remove("d-none");
  };

  const ocultarAlerta = () => {
    alerta.classList.add("d-none");
  };

  function convertirFecha(fechaISO) {
    if (!fechaISO || !fechaISO.includes("-")) return "";
    const [yyyy, mm, dd] = fechaISO.split("-");
    return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
  }

  function calcularTotal() {
    let total = 0;
    const fechaFormateada = convertirFecha(fechaInput.value.trim());
    const salonSeleccionado = salones.find(s =>
      s.nombre === salonSelect?.value &&
      s.fechaDisponible === fechaFormateada
    );
    if (salonSeleccionado) {
      total += salonSeleccionado.precio;
    }

    document.querySelectorAll("input[name='servicios']:checked").forEach(cb => {
      total += parseInt(cb.dataset.precio);
    });

    if (totalInput) {
      totalInput.value = `$${total.toLocaleString("es-AR")}`;
    }
  }

  function cargarServicios(servicios) {
    const contenedor = document.getElementById("contenedor-servicios");
    if (!contenedor) return;

    if (!Array.isArray(servicios) || servicios.length === 0) {
      contenedor.innerHTML = "<p class='text-muted'>No hay servicios disponibles.</p>";
      return;
    }

    contenedor.innerHTML = "";

    servicios.forEach((servicio, index) => {
      const id = `servicio-${index}`;
      const precio = servicio.precio || 0;

      const html = `
        <div class="form-check mb-2">
          <input class="form-check-input" type="checkbox" name="servicios" value="${servicio.titulo}" id="${id}" data-precio="${precio}">
          <label class="form-check-label" for="${id}">
            ${servicio.titulo} - $${precio.toLocaleString("es-AR")}
            <small class="d-block text-muted">${servicio.descripcion}</small>
          </label>
        </div>
      `;
      contenedor.insertAdjacentHTML("beforeend", html);
    });

    document.querySelectorAll("input[name='servicios']").forEach(cb => {
      cb.addEventListener("change", calcularTotal);
    });

    if (Array.isArray(datosGuardados?.servicios)) {
      datosGuardados.servicios.forEach(servicio => {
        const cb = document.querySelector(`input[name='servicios'][value="${servicio.nombre}"]`);
        if (cb) cb.checked = true;
      });
    }

    calcularTotal();
  }

  function cargarSalonesDisponibles(salonesFiltrados) {
    salonSelect.innerHTML = '<option value="" disabled selected>Seleccionar salón</option>';
    capacidadSelect.value = "";

    const nombresUnicos = [...new Set(salonesFiltrados.map(s => s.nombre))];
    nombresUnicos.forEach(nombre => {
      const option = document.createElement("option");
      option.value = nombre;
      option.textContent = nombre;
      salonSelect.appendChild(option);
    });
  }

  salonSelect?.addEventListener("change", () => {
    const salonNombre = salonSelect.value;
    const salonesFiltrados = salonesFiltradosPorFecha.filter(s => s.nombre === salonNombre);

    if (salonesFiltrados.length > 0) {
      const salon = salonesFiltrados[0];
      costoSalonInput.value = `$${(salon.precio).toLocaleString("es-AR")}`;
      capacidadSelect.value = `${salon.capacidad} invitados`;
    } else {
      costoSalonInput.value = "";
      capacidadSelect.value = "";
    }

    calcularTotal();
  });

  fechaInput?.addEventListener("change", () => {
    const nombre = document.getElementById("nombre").value.trim();
    const fechaValor = fechaInput.value.trim();
    ocultarAlerta();

    if (!nombre || !fechaValor) return;

    const fechaFormateada = convertirFecha(fechaValor);

    salonesFiltradosPorFecha = salones.filter(s =>
      s.estado === "Disponible" &&
      s.fechaDisponible === fechaFormateada
    );

    const serviciosFiltrados = servicios.filter(s =>
      s.estado === "Activo" &&
      s.fechaDisponible === fechaFormateada
    );

    if (salonesFiltradosPorFecha.length === 0) {
      mostrarAlerta("No hay salones disponibles para la fecha seleccionada.");
      salonSelect.innerHTML = '<option value="" disabled selected>Seleccionar salón</option>';
      capacidadSelect.value = "";
      document.getElementById("contenedor-servicios").innerHTML = "";
      return;
    }

    cargarSalonesDisponibles(salonesFiltradosPorFecha);
    cargarServicios(serviciosFiltrados);
  });

  const datosGuardados = JSON.parse(localStorage.getItem("presupuestoActual"));
  if (modoEdicion && datosGuardados && form) {
    document.getElementById("nombre").value = datosGuardados.nombre || "";

    if (datosGuardados.fecha?.includes("/")) {
      const [dd, mm, yyyy] = datosGuardados.fecha.split("/");
      document.getElementById("fecha").value = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    } else {
      document.getElementById("fecha").value = datosGuardados.fecha || "";
    }

    document.getElementById("duracion").value = datosGuardados.duracion || "";
    document.getElementById("salon").value = datosGuardados.salon || "";
    document.getElementById("tematica").value = datosGuardados.tematica || "";
    document.getElementById("notas").value = datosGuardados.notas || "";

    fechaInput?.dispatchEvent(new Event("change"));
  }


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
        const fechaValor = document.getElementById("fecha").value.trim();
        const salonValor = salonSelect?.value || "";

        if (!nombre || !fechaValor || !salonValor) {
          mostrarAlerta("Completá todos los campos del <strong>Paso 1</strong> para poder continuar.");
          return;
        }

        const fechaSeleccionada = new Date(fechaValor);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaSeleccionada < hoy) {
          mostrarAlerta("La <strong>fecha del evento</strong> no puede ser anterior al día de hoy.");
          return;
        }
      }

      if (currentStep === 2) {
        const duracion = document.getElementById("duracion").value;
        const salon = document.getElementById("salon").value;
        const tematica = document.getElementById("tematica").value;
        const capacidad = document.getElementById("capacidad").value;

        if (!duracion || !salon || !tematica || !capacidad) {
          mostrarAlerta("Seleccioná la <strong>duración</strong>, el <strong>salón</strong>, la <strong>capacidad</strong> y la <strong>temática</strong> antes de continuar.");
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

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const serviciosSeleccionados = [];
      document.querySelectorAll("input[name='servicios']:checked").forEach(cb => {
        const contenedorServicio = cb.closest(".form-check-label");
        const descripcion = contenedorServicio?.querySelector("small")?.textContent?.trim() || "";

        serviciosSeleccionados.push({
          nombre: cb.value,
          precio: parseInt(cb.dataset.precio), 
          descripcion: descripcion
        });
      });

      const salonSeleccionado = salones.find(s => s.nombre === salonSelect.value);

      const presupuesto = {
        id: datosGuardados?.id || `PKES-2025-${Math.floor(1000 + Math.random() * 9000)}`,
        nombre: document.getElementById("nombre").value,
        fecha: document.getElementById("fecha").value,
        invitados: `${capacidadSelect?.value || 0}`,
        duracion: document.getElementById("duracion").value,
        salon: salonSelect.value,
        tematica: document.getElementById("tematica").value,
        costoSalon: salonSeleccionado ? `$${salonSeleccionado.precio.toLocaleString("es-AR")}` : "$0",
        servicios: serviciosSeleccionados,
        notas: document.getElementById("notas").value,
        total: `$${(
          (salonSeleccionado?.precio || 0) +
          serviciosSeleccionados.reduce((acc, s) => acc + s.precio, 0)
        ).toLocaleString("es-AR")}`
      };

      localStorage.setItem("presupuestoActual", JSON.stringify(presupuesto));
      window.location.href = `ver_presupuesto.html`;
    });

    showStep(currentStep);
    if (!modoEdicion) {
      cargarServicios(servicios);
    }
  }

  const btnNuevoPresupuesto = document.getElementById("btnNuevoPresupuesto");
  if (btnNuevoPresupuesto) {
    btnNuevoPresupuesto.addEventListener("click", () => {
      localStorage.removeItem("presupuestoActual");
      window.location.href = "crear_presupuesto.html";
    });
  }

  const btnReservar = document.getElementById("btnReservar");
  if (btnReservar) {
    btnReservar.addEventListener("click", () => {
      const datos = JSON.parse(localStorage.getItem("presupuestoActual"));
      if (!datos) {
        alert("No se encontró presupuesto para reservar.");
        return;
      }

      const salonesDisponibles = obtenerSalonesPkes();
      const salonSeleccionado = salonesDisponibles.find(s => s.nombre === datos.salon);

      const nuevaReserva = {
        id: datos.id,
        cliente: datos.nombre,
        fecha: datos.fecha,
        duracion: datos.duracion,
        salon: {
          nombre: salonSeleccionado?.nombre || datos.salon,
          img: salonSeleccionado?.img || "../assets/img/placeholder.jpg",
          ubicacion: salonSeleccionado?.ubicacion || "---",
          precio: salonSeleccionado?.precio || 0,
          estado: "Reservado"
        },
        servicios: datos.servicios,
        notas: datos.notas,
        estado: "Pendiente",
        total: parseInt(datos.total.replace(/[^\d]/g, '')) || 0
      };

      const reservas = JSON.parse(localStorage.getItem("reservas_pkes")) || [];
      reservas.push(nuevaReserva);
      guardarReservasPkes(reservas);

      localStorage.setItem("reservaActual", JSON.stringify(nuevaReserva));

      document.getElementById("modal-reserva-id").textContent = nuevaReserva.id;
      const btnVer = document.getElementById("btnVerReserva");
      if (btnVer) {
        btnVer.href = `ver_reserva.html?id=${nuevaReserva.id}`;
      }
      const modal = new bootstrap.Modal(document.getElementById("modalReservaExitosa"));
      modal.show();

      localStorage.removeItem("presupuestoActual");
    });
  }

  const resumenBox = document.querySelector(".presupuesto article");
  if (resumenBox && !form) {
    const datos = JSON.parse(localStorage.getItem("presupuestoActual"));

    if (!datos) {
      alert("No se encontraron datos del presupuesto.");
      window.location.href = "crear_presupuesto.html";
      return;
    }

    document.getElementById("presupuesto-id").textContent = datos.id || "";
    document.getElementById("cliente-nombre").textContent = datos.nombre || "";
    document.getElementById("evento-fecha").textContent = convertirFecha(datos.fecha) || "";
    document.getElementById("evento-invitados").textContent = datos.invitados || "";
    document.getElementById("evento-duracion").textContent = datos.duracion || "";
    document.getElementById("evento-tematica").textContent = datos.tematica || "";
    document.getElementById("evento-salon").textContent = datos.salon || "";
    document.getElementById("evento-costo-salon").textContent = datos.costoSalon || "";
    document.getElementById("evento-notas").textContent = datos.notas || "";
    document.getElementById("evento-total").textContent = datos.total || "";

    const listaServicios = document.getElementById("lista-servicios");
    if (Array.isArray(datos.servicios)) {
      listaServicios.innerHTML = "";
      datos.servicios.forEach(servicio => {
        const precioNumerico = typeof servicio.precio === "string"
          ? parseInt(servicio.precio.replace(/[^\d]/g, ''))
          : servicio.precio;

        const li = document.createElement("li");
        li.innerHTML = `
          <i class="fas fa-check-circle me-1 text-success"></i>
          ${servicio.nombre} – $${precioNumerico.toLocaleString("es-AR")}
        `;
        listaServicios.appendChild(li);
      });
    }
  }
});