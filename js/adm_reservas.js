import {
  obtenerReservas,
  guardarReservas,
  cargarReservasIniciales
} from './reservas.js';

document.addEventListener("DOMContentLoaded", async () => {
  await cargarReservasIniciales();
  renderizarReservas();
});

function renderizarReservas() {
  const reservas = obtenerReservas();
  const tbody = document.getElementById("tbody-reservas");
  tbody.innerHTML = "";

  if (reservas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">No hay reservas registradas.</td></tr>`;
    return;
  }

  reservas.forEach((reserva, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td class="align-middle" data-label="ID">${reserva.id}</td>
      <td class="align-middle" data-label="Cliente">${reserva.cliente}</td>
      <td class="align-middle" data-label="Fecha">${formatearFecha(reserva.fecha)}</td>
      <td class="align-middle" data-label="Salón">${reserva.salon?.nombre || '---'}</td>
      <td class="align-middle" data-label="Estado">
        <select class="form-select form-select-sm estado-select w-100" data-index="${index}">
          <option value="Pendiente"${reserva.estado === "Pendiente" ? " selected" : ""}>Pendiente</option>
          <option value="Reservado"${reserva.estado === "Reservado" ? " selected" : ""}>Reservado</option>
          <option value="Pagado"${reserva.estado === "Pagado" ? " selected" : ""}>Pagado</option>
          <option value="Cancelado"${reserva.estado === "Cancelado" ? " selected" : ""}>Cancelado</option>
        </select>
      </td>
      <td class="align-middle" data-label="Total">$${reserva.total.toLocaleString("es-AR")}</td>
      <td class="align-middle text-center" data-label="Acciones">
        <div class="btn-group">
          <button class="btn btn-sm btn-info ver-detalle" title="Ver Detalle" data-index="${index}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-danger eliminar-reserva" title="Eliminar" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(fila);
  });

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

function eliminarReserva(index) {
  const reservas = obtenerReservas();
  if (confirm("¿Estás seguro de eliminar esta reserva?")) {
    reservas.splice(index, 1);
    guardarReservas(reservas);
    renderizarReservas();
  }
}

function actualizarEstadoReserva(index, nuevoEstado) {
  const reservas = obtenerReservas();
  reservas[index].estado = nuevoEstado;
  guardarReservas(reservas);

  const toast = document.createElement("div");
  toast.className = "alert alert-success position-fixed top-0 end-0 m-3";
  toast.textContent = "Estado actualizado";
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
