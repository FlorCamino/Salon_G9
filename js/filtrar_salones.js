import { obtenerSalones } from "./salones.js";
import { obtenerReservas } from "./reservas.js";

export function filtrarSalones(filtros) {
  const salones = obtenerSalones();
  const reservas = obtenerReservas();

  return salones.filter(salon => {
    
    if (salon.estado === "Mantenimiento") return false;
    
    if (filtros.nombre && filtros.nombre.trim() !== "") {
      if (!salon.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
    }

    if (filtros.capacidad && filtros.capacidad > 0) {
      const detalleCapacidad = salon.detalles.find(d => d.toLowerCase().includes("capacidad"));
      if (detalleCapacidad) {
        const partes = detalleCapacidad.split(" ");
            const capacidadSalon = partes.find(p => !isNaN(parseInt(p)));
            if (!capacidadSalon || parseInt(capacidadSalon, 10) < filtros.capacidad) return false;
        } else {
            return false;
        }
    }
    
    if (filtros.fecha && reservas.length > 0) {
      const reservado = reservas.some(r =>
        r.salon?.nombre === salon.nombre && r.fecha === filtros.fecha && ["Reservado", "Pagado"].includes(r.estado)
      );
      if (reservado) return false;
    }

    return true;
  });
}