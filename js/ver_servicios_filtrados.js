import { obtenerServiciosPkes } from "./servicios.js";
import { TarjetasServiciosUsuario } from "./ver_servicio.js";

function obtenerFiltrosServicios() {
  return {
    titulo: document.getElementById("filtro-titulo")?.value.trim().toLowerCase() || "",
    precioMin: parseInt(document.getElementById("filtro-precio-min")?.value, 10) || 0,
    precioMax: parseInt(document.getElementById("filtro-precio-max")?.value, 10) || Infinity,
    estado: document.getElementById("filtro-estado")?.value || "",
    fecha: document.getElementById("filtro-fecha")?.value || "",
  };
}

function convertirISOaLatino(iso) {
  if (!iso.includes("-")) return iso;
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

function mostrarServiciosFiltrados() {
  const servicios = obtenerServiciosPkes();
  const filtros = obtenerFiltrosServicios();

  const contenedorActivos   = document.getElementById("contenedor-servicios-disponibles");
  const contenedorInactivos = document.getElementById("contenedor-servicios-inactivos");
  if (!contenedorActivos || !contenedorInactivos) return;

  contenedorActivos.innerHTML   = "";
  contenedorInactivos.innerHTML = "";

  const filtrados = servicios.filter(servicio => {
    const tituloOk = servicio.titulo
      .toLowerCase()
      .includes(filtros.titulo);

    const precioOk =
      servicio.precio >= filtros.precioMin &&
      servicio.precio <= filtros.precioMax;

    const estadoOk = filtros.estado
      ? servicio.estado === filtros.estado
      : true;

    const fechaFiltroLatina = convertirISOaLatino(filtros.fecha);
    const fechaOk = filtros.fecha
      ? (() => {
          console.log("Comparando fechas -> filtro:", fechaFiltroLatina, "| servicio:", servicio.fechaDisponible);
          return servicio.fechaDisponible === fechaFiltroLatina;
        })()
      : true;

    return tituloOk && precioOk && estadoOk && fechaOk;
  });

  if (filtrados.length === 0) {
    contenedorActivos.innerHTML =
      `<p class="text-center">No se encontraron servicios con esos filtros.</p>`;
    return;
  }

  filtrados.forEach(servicio => {
    const card = TarjetasServiciosUsuario.crearTarjetaServicio(servicio);
    (servicio.estado === "Activo"
      ? contenedorActivos
      : contenedorInactivos
    ).appendChild(card);
  });
}

export function cargarFiltrosServiciosUsuario() {
  [
    "filtro-titulo",
    "filtro-precio-min",
    "filtro-precio-max",
    "filtro-estado",
    "filtro-fecha"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", mostrarServiciosFiltrados);
  });

  const btnLimpiarFiltro = document.getElementById("btn-limpiar-filtros");
  if (btnLimpiarFiltro) {
    btnLimpiarFiltro.addEventListener("click", () => {
      document.getElementById("filtro-titulo").value = "";
      document.getElementById("filtro-precio-min").value = "";
      document.getElementById("filtro-precio-max").value = "";
      document.getElementById("filtro-estado").value = "";
      document.getElementById("filtro-fecha").value = "";
      mostrarServiciosFiltrados();
    });
  }

  mostrarServiciosFiltrados();
}
