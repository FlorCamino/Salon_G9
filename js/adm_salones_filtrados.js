import { filtrarSalones } from "./filtrar_salones.js";
import { renderizarTabla } from "./adm_salones.js";

function obtenerFiltros() {
  return {
    nombre: document.getElementById("filtro-nombre")?.value || "",
    fecha: document.getElementById("filtro-fecha")?.value || "",
    capacidad: parseInt(document.getElementById("filtro-capacidad")?.value, 10) || 0,
  };
}

function mostrarSalonesFiltradosAdmin() {
    const filtros = obtenerFiltros();
    const salones = filtrarSalones(filtros);
    renderizarTabla(salones);
}

export function cargarFiltrosSalonesAdmin() {
    ["filtro-nombre", "filtro-fecha", "filtro-capacidad"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", mostrarSalonesFiltradosAdmin);
    });

    const btnLimpiarFiltro = document.getElementById("btn-limpiar-filtros");
    if (btnLimpiarFiltro) {
        btnLimpiarFiltro.addEventListener("click", () => {
            document.getElementById("filtro-nombre").value = "";
            document.getElementById("filtro-fecha").value = "";
            document.getElementById("filtro-capacidad").value = "";
            mostrarSalonesFiltradosAdmin()
        });
    }
    mostrarSalonesFiltradosAdmin()
}