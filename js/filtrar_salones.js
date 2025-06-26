import { obtenerSalones } from "./salones.js";
import { obtenerReservas } from "./reservas.js";

export function filtrarSalones({ nombre, fecha, capacidadMin, capacidadMax }) {
  const salones = obtenerSalones();
  const reservas = obtenerReservas();

  const fechaFiltro = convertirFecha(fecha); 

  return salones
    .map(salon => {
      const estaReservadoOPagado = reservas.some(reserva =>
        reserva.salon?.nombre === salon.nombre &&
        reserva.fecha === salon.fechaDisponible &&
        (reserva.estado === "Reservado" || reserva.estado === "Pagado")
      );

      return {
        ...salon,
        disponible: salon.estado === "Disponible" && !estaReservadoOPagado
      };
    })
    .filter(salon => {
      const nombreSalon = salon.nombre?.toLowerCase().trim() || "";
      const coincideNombre = !nombre || nombreSalon.includes(nombre.toLowerCase().trim());

      const fechaSalonFormateada = convertirFecha(salon.fechaDisponible);
      const coincideFecha = !fechaFiltro || fechaSalonFormateada === fechaFiltro;

      const capacidadSalon = parseInt(salon.capacidad) || 0;
      const coincideCapacidad =
        (!capacidadMin || capacidadSalon >= capacidadMin) &&
        (!capacidadMax || capacidadSalon <= capacidadMax);

      return coincideNombre && coincideFecha && coincideCapacidad;
    });
}

function convertirFecha(fechaISO) {
  if (!fechaISO || !fechaISO.includes("-")) return fechaISO;
  const [yyyy, mm, dd] = fechaISO.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

