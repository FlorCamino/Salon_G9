import { obtenerServiciosPkes } from '../js/servicios.js';
import { renderizarTabla } from '../js/adm_servicios.js';

export function cargarFiltrosServiciosAdmin() {
  const inputTitulo = document.getElementById('filtro-titulo');
  const inputFecha = document.getElementById('filtro-fecha');
  const inputPrecioMin = document.getElementById('filtro-precio-min');
  const inputPrecioMax = document.getElementById('filtro-precio-max');
  const selectEstado = document.getElementById('filtro-estado');
  const btnLimpiar = document.getElementById('btn-limpiar-filtros');

  const aplicarFiltros = () => {
    const servicios = obtenerServiciosPkes();

    const tituloFiltro = inputTitulo.value.toLowerCase();
    const fechaISO = inputFecha.value; 
    const fechaFiltro = convertirFecha(fechaISO); 
    const precioMin = parseInt(inputPrecioMin.value);
    const precioMax = parseInt(inputPrecioMax.value);
    const estadoFiltro = selectEstado.value;

    const filtrados = servicios.filter(servicio => {
      const coincideTitulo = servicio.titulo.toLowerCase().includes(tituloFiltro);
      const fechaServicio = servicio.fechaDisponible.trim(); 
      const coincideFecha = !fechaFiltro || fechaServicio === fechaFiltro;

      const coincidePrecio =
        (isNaN(precioMin) || servicio.precio >= precioMin) &&
        (isNaN(precioMax) || servicio.precio <= precioMax);

      const coincideEstado = !estadoFiltro || servicio.estado === estadoFiltro;

      console.log(`Comparando fechas → filtro: ${fechaFiltro} | servicio: ${fechaServicio}`);

      return coincideTitulo && coincideFecha && coincidePrecio && coincideEstado;
    });

    renderizarTabla(filtrados);
  };

  [inputTitulo, inputFecha, inputPrecioMin, inputPrecioMax, selectEstado].forEach(input =>
    input.addEventListener('input', aplicarFiltros)
  );

  btnLimpiar.addEventListener('click', () => {
    inputTitulo.value = '';
    inputFecha.value = '';
    inputPrecioMin.value = '';
    inputPrecioMax.value = '';
    selectEstado.value = '';
    renderizarTabla();
  });

  renderizarTabla();
}

function convertirFecha(fechaISO) {
  if (!fechaISO || !fechaISO.includes("-")) return fechaISO;
  const [yyyy, mm, dd] = fechaISO.split("-");
  return `${dd}/${mm}/${yyyy}`;
}
