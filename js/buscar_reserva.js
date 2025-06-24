import { cargarReservasIniciales } from "../js/reservas.js";
import { cargarSalonesIniciales } from "../js/salones.js";

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("input-reserva-id");
  input.setSelectionRange(input.value.length, input.value.length);
  input.focus();
  const btn = document.getElementById("btnBuscarReserva");
  const mensajeError = document.getElementById("mensaje-error");

  await cargarReservasIniciales();
  await cargarSalonesIniciales();
  const reservas = JSON.parse(localStorage.getItem("reservas_pkes")) || [];
  const salones = JSON.parse(localStorage.getItem("salones_pkes")) || [];

  let modal = document.getElementById("reserva-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "reserva-modal";
    modal.classList.add("modal-reserva");
    modal.innerHTML = `<div id="reserva-modal-content" class="modal-reserva-content"></div>`;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }

  const modalContent = document.getElementById("reserva-modal-content");

  btn.addEventListener("click", () => {
    const idIngresado = input.value.trim();
    const reserva = reservas.find(r => r.id === idIngresado);

    mensajeError.classList.add("d-none");

    if (!reserva) {
      mensajeError.classList.remove("d-none");
      return;
    }

    const salonReserva = salones.find(s => s.nombre === reserva.salon.nombre);
    const imagenUrl = salonReserva?.img || "../assets/img/default-salon.jpg";

    const html = `
      <div class="reserva-box">
        <div class="reserva-header d-flex justify-content-between align-items-center">
          <span>Detalle de la reserva</span>
          <button id="cerrar-modal" class="close-modal" aria-label="Cerrar">&times;</button>
        </div>
        <div class="reserva-content">
          <div class="reserva-info">
            <p><strong>ID de reserva:</strong> ${reserva.id}</p>
            <p><strong>Cliente:</strong> ${reserva.cliente}</p>
            <p><strong>Fecha:</strong> ${reserva.fecha}</p>
            <p><strong>Duración:</strong> ${reserva.duracion}</p>
            <p><strong>Salón:</strong> ${reserva.salon.nombre}</p>
            <p><strong>Notas:</strong> ${reserva.notas || "-"}</p>
            <p><strong>Total:</strong> <span class="text-danger">$${reserva.total.toLocaleString("es-AR")}</span></p>
            <p><strong>Estado:</strong> <span class="text-success">${reserva.estado}</span></p>
            <p class="mt-3"><strong>Servicios contratados:</strong></p>
            <ul class="detalles-servicio">
              ${reserva.servicios.map(s => `<li><i class="fas fa-check-circle me-1 text-success"></i> ${s.nombre} - $${s.precio.toLocaleString("es-AR")}</li>`).join("")}
            </ul>
          </div>
          <div class="reserva-img-container">
            <img src="${imagenUrl}" alt="Imagen del salón" class="reserva-img" />
          </div>
        </div>
      </div>`;

    modalContent.innerHTML = html;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    const cerrar = document.getElementById("cerrar-modal");
    if (cerrar) {
      cerrar.addEventListener("click", () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      });
    }
  });

  input.addEventListener("input", () => {
    mensajeError.classList.add("d-none");
  });
});
