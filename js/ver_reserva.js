document.addEventListener("DOMContentLoaded", () => {
  const reserva = JSON.parse(localStorage.getItem("reservaActual"));

  if (!reserva) {
    alert("No se encontraron datos de la reserva actual.");
    window.location.href = "../index.html";
    return;
  }

  mostrarReserva(reserva);

  function mostrarReserva(reserva) {
    document.getElementById("mensaje-carga")?.classList.add("d-none");
    document.getElementById("resumen-reserva")?.classList.remove("d-none");

    document.getElementById("reserva-id").textContent = reserva.id || "-";
    document.getElementById("reserva-cliente").textContent = reserva.cliente || "-";
    document.getElementById("reserva-fecha").textContent = reserva.fecha || "-";
    document.getElementById("reserva-duracion").textContent = reserva.duracion || "-";
    document.getElementById("reserva-salon").textContent = reserva.salon?.nombre || "-";
    document.getElementById("reserva-total").textContent = `$${(reserva.total || 0).toLocaleString("es-AR")}`;
    document.getElementById("reserva-notas").textContent = reserva.notas || "-";
    document.getElementById("reserva-estado").textContent = reserva.estado || "-";

    const ul = document.getElementById("reserva-servicios");
    if (ul && Array.isArray(reserva.servicios)) {
      ul.innerHTML = "";
      reserva.servicios.forEach(servicio => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i> ${servicio.nombre} - ${servicio.precio}`;
        ul.appendChild(li);
      });
    }
    const img = document.getElementById("reserva-img");
    if (img && reserva.salon?.img) {
      img.src = reserva.salon.img;
      img.alt = `Imagen del salón ${reserva.salon.nombre}`;
    }

    const cerrar = document.getElementById("cerrar-pagina");
    if (cerrar) {
      cerrar.addEventListener("click", () => {
        window.location.href = "../index.html";
      });
    }

  }

});
