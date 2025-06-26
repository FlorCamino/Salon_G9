import { obtenerServicios } from "./servicios.js";
import { obtenerReservas } from "./reservas.js";

export function filtrarServicios(filtros) {
  const servicios = obtenerServicios();
  const reservas = obtenerReservas();
  const resultados = [];

  servicios.forEach(servicio => {
    if (filtros.estado && servicio.estado !== filtros.estado) return;

    if (filtros.titulo && !servicio.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())) return;

    const precio = servicio.precio || 0;
    if (!isNaN(filtros.precioMin) && precio < filtros.precioMin) return;
    if (!isNaN(filtros.precioMax) && precio > filtros.precioMax) return;

    if (filtros.fecha) {
      const fechaFiltro = convertirFecha(filtros.fecha);
      if (fechaFiltro !== servicio.fechaDisponible) return;
    }

    const yaReservado = reservas.some(r =>
      r.servicio?.titulo === servicio.titulo &&
      r.fecha === servicio.fechaDisponible &&
      ["Reservado", "Pagado"].includes(r.estado)
    );

    if (!yaReservado) {
      resultados.push({ ...servicio });
    }
  });

  return resultados;
}

function convertirFecha(fechaISO) {
  if (!fechaISO.includes("-")) return fechaISO;
  const [yyyy, mm, dd] = fechaISO.split("-");
  return `${dd}/${mm}/${yyyy}`;
}
