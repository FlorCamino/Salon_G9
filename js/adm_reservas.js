import {
  obtenerReservas,
  guardarReservas,
  inicializarReservas
} from './reservas.js';

const reservasPorPagina = 8;

document.addEventListener("DOMContentLoaded", async () => {
  await inicializarReservas();
  renderizarReservas(1);
});

function renderizarReservas(pagina = 1) {
  const reservas = obtenerReservas();
  const tbody = document.getElementById("tbody-reservas");
  const paginacion = document.getElementById("paginacionReservas");
  const totalPaginas = Math.ceil(reservas.length / reservasPorPagina);
  const inicio = (pagina - 1) * reservasPorPagina;
  const fin = inicio + reservasPorPagina;
  const paginaActual = reservas.slice(inicio, fin);

  tbody.innerHTML = "";

  if (reservas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">No hay reservas registradas.</td></tr>`;
    paginacion.innerHTML = "";
    return;
  }

  paginaActual.forEach((reserva, index) => {
    const fila = document.createElement("tr");
    const indexGlobal = inicio + index;

    fila.innerHTML = `
      <td class="align-middle" data-label="ID">${reserva.id}</td>
      <td class="align-middle" data-label="Cliente">${reserva.cliente}</td>
      <td class="align-middle" data-label="Fecha">${formatearFecha(reserva.fecha)}</td>
      <td class="align-middle" data-label="Salón">${reserva.salon?.nombre || '---'}</td>
      <td class="align-middle" data-label="Estado">
        <select class="form-select form-select-sm estado-select w-100" data-index="${indexGlobal}">
          <option value="Pendiente"${reserva.estado === "Pendiente" ? " selected" : ""}>Pendiente</option>
          <option value="Reservado"${reserva.estado === "Reservado" ? " selected" : ""}>Reservado</option>
          <option value="Pagado"${reserva.estado === "Pagado" ? " selected" : ""}>Pagado</option>
          <option value="Cancelado"${reserva.estado === "Cancelado" ? " selected" : ""}>Cancelado</option>
        </select>
      </td>
      <td class="align-middle" data-label="Total">$${reserva.total.toLocaleString("es-AR")}</td>
      <td class="align-middle text-center" data-label="Acciones">
        <div class="btn-group">
          <button class="btn btn-sm btn-info ver-detalle" title="Ver Detalle" data-index="${indexGlobal}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-danger eliminar-reserva" title="Eliminar" data-index="${indexGlobal}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(fila);
  });

  agregarListenersReserva();
  renderizarPaginacionReservas(totalPaginas, pagina);
}

function agregarListenersReserva() {
  document.querySelectorAll(".eliminar-reserva").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      eliminarReserva(index);
    });
  });

  document.querySelectorAll(".ver-detalle").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      mostrarDetalleReserva(index);
    });
  });

  document.querySelectorAll(".estado-select").forEach(select => {
    select.addEventListener("change", (e) => {
      const index = e.target.dataset.index;
      actualizarEstadoReserva(index, e.target.value);
    });
  });
}

function renderizarPaginacionReservas(totalPaginas, paginaActual) {
  const paginacion = document.getElementById("paginacionReservas");
  paginacion.innerHTML = "";

  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement("li");
    li.className = "page-item" + (i === paginaActual ? " active" : "");
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;

    li.addEventListener("click", e => {
      e.preventDefault();
      renderizarReservas(i);
    });

    paginacion.appendChild(li);
  }
}

function eliminarReserva(index) {
  const reservas = obtenerReservas();
  if (confirm("¿Estás seguro de eliminar esta reserva?")) {
    reservas.splice(index, 1);
    guardarReservas(reservas);
    renderizarReservas(1);
  }
}

function actualizarEstadoReserva(index, nuevoEstado) {
  const reservas = obtenerReservas();
  reservas[index].estado = nuevoEstado;
  guardarReservas(reservas);
  mostrarToast("Estado actualizado");
}

function mostrarToast(mensaje, tipo = "success") {
  const toast = document.createElement("div");
  toast.className = `alert alert-${tipo} position-fixed top-0 end-0 m-3`;
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function formatearFecha(fechaStr) {
  const [año, mes, dia] = fechaStr.split("-");
  return `${dia}/${mes}/${año}`;
}

function mostrarDetalleReserva(index) {
  const reservas = obtenerReservas();
  const r = reservas[index];
  if (!r) return;

  document.getElementById("detalle-id").textContent = r.id;
  document.getElementById("detalle-cliente").textContent = r.cliente;
  document.getElementById("detalle-fecha").textContent = formatearFecha(r.fecha);
  document.getElementById("detalle-duracion").textContent = r.duracion || "—";
  document.getElementById("detalle-salon").textContent = r.salon?.nombre || "—";
  document.getElementById("detalle-ubicacion").textContent = r.salon?.ubicacion || "—";
  document.getElementById("detalle-notas").textContent = r.notas || "—";
  document.getElementById("detalle-total").textContent = `$${r.total.toLocaleString("es-AR")}`;
  document.getElementById("detalle-img").src = r.salon?.img || "../assets/img/placeholder.jpg";

  const lista = document.getElementById("detalle-servicios");
  lista.innerHTML = "";

  if (Array.isArray(r.servicios) && r.servicios.length > 0) {
    r.servicios.forEach(s => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${s.nombre}</strong> - $${s.precio.toLocaleString("es-AR")}<br><small>${s.descripcion}</small>`;
      lista.appendChild(li);
    });
  } else {
    lista.innerHTML = "<li class='text-muted'>Sin servicios contratados.</li>";
  }

  const modal = new bootstrap.Modal(document.getElementById('modalDetalleReserva'));
  modal.show();
}
