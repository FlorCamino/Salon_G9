import { obtenerServicios } from '../js/servicios.js';
import { renderizarTabla } from '../js/adm_servicios.js';

export function cargarFiltrosServiciosAdmin() {
  const inputTitulo = document.getElementById('filtro-titulo');
  const inputFecha = document.getElementById('filtro-fecha');
  const inputPrecioMin = document.getElementById('filtro-precio-min');
  const inputPrecioMax = document.getElementById('filtro-precio-max');
  const selectEstado = document.getElementById('filtro-estado');
  const btnLimpiar = document.getElementById('btn-limpiar-filtros');

  const aplicarFiltros = () => {
    const servicios = obtenerServicios();

    const serviciosExpandidos = servicios.flatMap(servicio => {
      const fechas = servicio.fechasDisponibles?.length ? servicio.fechasDisponibles : [null];
      return fechas.map(fecha => ({
        ...servicio,
        fechaDisponible: fecha
      }));
    });

    const tituloFiltro = inputTitulo.value.toLowerCase();
    const fechaFiltro = inputFecha.value;
    const precioMin = parseInt(inputPrecioMin.value);
    const precioMax = parseInt(inputPrecioMax.value);
    const estadoFiltro = selectEstado.value;

    const filtrados = serviciosExpandidos.filter(servicio => {
      const coincideTitulo = servicio.titulo.toLowerCase().includes(tituloFiltro);
      const coincideFecha = !fechaFiltro || servicio.fechaDisponible === fechaFiltro;
      const coincidePrecio =
        (isNaN(precioMin) || servicio.precio >= precioMin) &&
        (isNaN(precioMax) || servicio.precio <= precioMax);
      const coincideEstado = !estadoFiltro || servicio.estado === estadoFiltro;

      return coincideTitulo && coincideFecha && coincidePrecio && coincideEstado;
    });

    renderizarTabla(filtrados, true);
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
