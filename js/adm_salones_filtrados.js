import { obtenerSalones } from './salones.js';
import { renderizarTabla } from './adm_salones.js';

export function cargarFiltrosSalonesAdmin() {
  const inputNombre = document.getElementById('filtro-nombre');
  const inputFecha = document.getElementById('filtro-fecha');
  const inputCapMin = document.getElementById('filtro-capacidad-min');
  const inputCapMax = document.getElementById('filtro-capacidad-max');
  const btnLimpiar = document.getElementById('btn-limpiar-filtros');

  const aplicarFiltros = () => {
    const salones = obtenerSalones();

    const salonesExpandidos = salones.flatMap(salon => {
      const fechas = salon.fechasDisponibles?.length ? salon.fechasDisponibles : [null];
      return fechas.map(fecha => ({
        ...salon,
        fechaDisponible: fecha
      }));
    });

    const nombreFiltro = inputNombre.value.toLowerCase();
    const fechaFiltro = inputFecha.value;
    const capMin = parseInt(inputCapMin.value);
    const capMax = parseInt(inputCapMax.value);

    const filtrados = salonesExpandidos.filter(salon => {
      const coincideNombre = salon.nombre.toLowerCase().includes(nombreFiltro);
      const coincideFecha = !fechaFiltro || salon.fechaDisponible === fechaFiltro;
      const coincideCapacidad =
        (isNaN(capMin) || salon.capacidad >= capMin) &&
        (isNaN(capMax) || salon.capacidad <= capMax);

      return coincideNombre && coincideFecha && coincideCapacidad;
    });

    renderizarTabla(filtrados, true);
  };

  [inputNombre, inputFecha, inputCapMin, inputCapMax].forEach(input =>
    input.addEventListener('input', aplicarFiltros)
  );

  btnLimpiar.addEventListener('click', () => {
    inputNombre.value = '';
    inputFecha.value = '';
    inputCapMin.value = '';
    inputCapMax.value = '';
    renderizarTabla();
  });

  renderizarTabla();
}
