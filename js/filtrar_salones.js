import { obtenerSalones } from "./salones.js";
import { obtenerReservas } from "./reservas.js";

export function filtrarSalones(filtros) {
  const salones = obtenerSalones();
  const reservas = obtenerReservas();
  const resultados = [];

  const filtroNombre = filtros.nombre?.trim().toLowerCase() || "";
  const filtroCapMin = typeof filtros.capacidadMin === "number" && !isNaN(filtros.capacidadMin) ? filtros.capacidadMin : null;
  const filtroCapMax = typeof filtros.capacidadMax === "number" && !isNaN(filtros.capacidadMax) ? filtros.capacidadMax : null;
  const filtroFecha = filtros.fecha ? new Date(filtros.fecha).toISOString().split("T")[0] : null;

  salones.forEach(salon => {
    if (salon.estado === "Mantenimiento") return;

    const nombreLower = salon.nombre?.toLowerCase() || "";
    const capacidad = Number(salon.capacidad) || 0;
    const fechaSalon = salon.fechaDisponible ? new Date(salon.fechaDisponible).toISOString().split("T")[0] : null;

    if (filtroNombre && !nombreLower.includes(filtroNombre)) return;
    if (filtroCapMin !== null && capacidad < filtroCapMin) return;
    if (filtroCapMax !== null && capacidad > filtroCapMax) return;
    if (filtroFecha && filtroFecha !== fechaSalon) return;

    const yaReservado = reservas.some(r =>
      r.salon?.nombre === salon.nombre &&
      r.fecha === fechaSalon &&
      ["Reservado", "Pagado"].includes(r.estado)
    );

    resultados.push({
      ...salon,
      fechaSeleccionada: fechaSalon,
      disponible: !yaReservado && salon.estado === "Disponible"
    });
  });

  return resultados;
}
