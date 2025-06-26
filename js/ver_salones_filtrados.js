import { filtrarSalones } from "./filtrar_salones.js";
import { TarjetasSalonesUsuario } from "./ver_salones.js";

function obtenerFiltros() {
  return {
    nombre: document.getElementById("filtro-nombre")?.value.trim() || "",
    fecha: document.getElementById("filtro-fecha")?.value || "",
    capacidadMin: (() => {
      const val = parseInt(document.getElementById("filtro-capacidad-min")?.value, 10);
      return isNaN(val) ? 0 : val;
    })(),
    capacidadMax: (() => {
      const val = parseInt(document.getElementById("filtro-capacidad-max")?.value, 10);
      return isNaN(val) ? Infinity : val;
    })(),
  };
}

function mostrarSalonesFiltradosUsuario() {
  const contenedorDisponibles = document.getElementById("contenedor-disponibles");
  const contenedorNoDisponibles = document.getElementById("contenedor-no-disponibles");

  if (!contenedorDisponibles || !contenedorNoDisponibles) {
    console.error("No se encontraron los contenedores para mostrar las tarjetas");
    return;
  }

  const filtros = obtenerFiltros();
  const salonesFiltrados = filtrarSalones(filtros);

  contenedorDisponibles.innerHTML = "";
  contenedorNoDisponibles.innerHTML = "";

  if (salonesFiltrados.length === 0) {
    const mensaje = document.createElement("div");
    mensaje.className = "alert alert-warning text-center w-100";
    mensaje.textContent = "No se encontraron salones que coincidan con los filtros.";
    contenedorDisponibles.appendChild(mensaje);
    return;
  }

  salonesFiltrados.forEach(salon => {
    const tarjeta = TarjetasSalonesUsuario.crearTarjetaSalon(salon);
    if (salon.disponible) {
      contenedorDisponibles.appendChild(tarjeta);
    } else {
      contenedorNoDisponibles.appendChild(tarjeta);
    }
  });
}

export function cargarFiltrosSalonesUsuario() {
  const filtroIds = [
    "filtro-nombre",
    "filtro-fecha",
    "filtro-capacidad-min",
    "filtro-capacidad-max"
  ];

  filtroIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", mostrarSalonesFiltradosUsuario);
  });

  const btnLimpiarFiltro = document.getElementById("btn-limpiar-filtros");
  if (btnLimpiarFiltro) {
    btnLimpiarFiltro.addEventListener("click", () => {
      filtroIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      mostrarSalonesFiltradosUsuario();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const hayFiltrosAplicados = filtroIds.some(id => {
      const el = document.getElementById(id);
      return el && el.value;
    });

    if (hayFiltrosAplicados) {
      mostrarSalonesFiltradosUsuario();
    }
  });
}

cargarFiltrosSalonesUsuario();
