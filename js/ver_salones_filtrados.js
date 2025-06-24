import { filtrarSalones } from "./filtrar_salones.js";
import { TarjetasSalonesUsuario } from "./ver_salones.js";

function obtenerFiltros() {
  return {
    nombre: document.getElementById("filtro-nombre")?.value || "",
    fecha: document.getElementById("filtro-fecha")?.value || "",
    capacidad: parseInt(document.getElementById("filtro-capacidad")?.value, 10) || 0,
  };
}

function mostrarSalonesFiltradosUsuario() {
  const filtros = obtenerFiltros();
  const salones = filtrarSalones(filtros);
  console.log("Filtros:", filtros, "Salones filtrados:", salones);
  const contenedor = document.getElementById("tarjetas-salones");
  contenedor.innerHTML = "";
  salones.forEach(salon => {
    contenedor.appendChild(TarjetasSalonesUsuario.crearTarjetaSalon(salon));
  });
}

export function cargarFiltrosSalonesUsuario() {
  ["filtro-nombre", "filtro-fecha", "filtro-capacidad"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", mostrarSalonesFiltradosUsuario);
  });

  const btnLimpiarFiltro = document.getElementById("btn-limpiar-filtros");
  if (btnLimpiarFiltro) {
    btnLimpiarFiltro.addEventListener("click", () => {
        document.getElementById("filtro-nombre").value = "";
        document.getElementById("filtro-fecha").value = "";
        document.getElementById("filtro-capacidad").value = "";
        mostrarSalonesFiltradosUsuario();
    })
  }
  mostrarSalonesFiltradosUsuario();
}