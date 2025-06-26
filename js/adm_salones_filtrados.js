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

    const nombreFiltro = inputNombre.value.trim().toLowerCase();
    const fechaFiltroISO = inputFecha.value?.trim();
    const capMin = parseInt(inputCapMin.value);
    const capMax = parseInt(inputCapMax.value);

    const filtrados = salones.filter(salon => {
      const nombre = salon.nombre?.toLowerCase() || "";
      const capacidad = Number(salon.capacidad) || 0;
      const fechaOriginal = salon.fechaDisponible?.trim() || '';
      const fechaSalon = convertirFecha(fechaOriginal);

      console.log("Comparando fechas:", {
        fechaOriginal,
        fechaSalon,
        filtro: fechaFiltroISO
      });

      const coincideNombre = nombre.includes(nombreFiltro);
      const coincideFecha = !fechaFiltroISO || fechaFiltroISO === fechaSalon;
      const coincideCapacidad =
        (isNaN(capMin) || capacidad >= capMin) &&
        (isNaN(capMax) || capacidad <= capMax);

      return coincideNombre && coincideFecha && coincideCapacidad;
    });

    renderizarTabla(filtrados);
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

function convertirFecha(fecha) {
  if (!fecha || typeof fecha !== 'string') return '';
  const [dd, mm, yyyy] = fecha.split("/");
  if (!dd || !mm || !yyyy) return '';
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}



