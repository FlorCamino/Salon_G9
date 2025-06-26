import {
  obtenerServiciosPkes,
  guardarServiciosPkes,
  inicializarServiciosPkes
} from './servicios.js';

let tablaBody;

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form-servicio");
  const modalVerServicio = new bootstrap.Modal(document.getElementById("modalVerServicio"));

  await inicializarServiciosPkes();
  renderizarTabla();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const servicios = obtenerServiciosPkes();
    const formData = new FormData(form);
    const rawFechaISO = formData.get("InputFechas")?.trim();
    const rawFecha = convertirFecha(rawFechaISO); 
    const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!fechaRegex.test(rawFecha)) {
      alert("La fecha debe tener el formato dd/mm/aaaa, por ejemplo 24/07/2025");
      return;
    }

    const nuevoServicio = {
      id: Date.now(),
      titulo: formData.get("titulo").trim(),
      descripcion: formData.get("descripcion").trim(),
      precio: parseInt(formData.get("precio")),
      detalles: formData.get("detalles").split(',').map(d => d.trim()),
      estado: formData.get("estado"),
      fechaDisponible: rawFecha,
      img: ''
    };

    const archivo = document.getElementById("img").files[0];
    if (!archivo) return alert("Debes seleccionar una imagen");

    const reader = new FileReader();
    reader.onload = (e) => {
      nuevoServicio.img = e.target.result;
      guardarServiciosPkes([...servicios, nuevoServicio]);
      form.reset();
      renderizarTabla();
    };
    reader.readAsDataURL(archivo);
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-guardar')) guardarEdicion(e.target.closest('tr'));
    if (e.target.closest('.btn-cancelar')) cancelarEdicion(e.target.closest('tr'));
  });
});

export function renderizarTabla(servicios = obtenerServiciosPkes(), yaExpandidos = false) {
  tablaBody = document.querySelector("#tabla-servicios tbody");
  tablaBody.innerHTML = "";

  if (!servicios.length) {
    tablaBody.innerHTML = `<tr><td colspan="8" class="text-center">No hay servicios registrados</td></tr>`;
    return;
  }

  const filas = servicios;

  filas.forEach(servicio => {
    const fila = document.createElement("tr");
    fila.dataset.id = servicio.id;

    fila.innerHTML = `
      <td class="align-middle" data-field="img">
        <img src="${servicio.img}" class="img-thumbnail" alt="${servicio.titulo}">
        <input type="file" class="d-none" accept="image/*" data-field="img">
      </td>
      <td class="align-middle" data-field="titulo">${servicio.titulo}</td>
      <td class="align-middle" data-field="descripcion">${servicio.descripcion}</td>
      <td class="align-middle" data-field="precio">${servicio.precio}</td>
      <td class="align-middle" data-field="detalles">${Array.isArray(servicio.detalles) ? servicio.detalles.join(', ') : ''}</td>
      <td class="align-middle" data-field="estado">${servicio.estado}</td>
      <td class="align-middle" data-field="fecha">${convertirFecha(servicio.fechaDisponible)}</td>
      <td class="align-middle">
        <div class="btn-group">
          <button class="btn btn-sm btn-info" onclick="verServicio(${servicio.id})"><i class="fas fa-eye"></i></button>
          <button class="btn btn-sm btn-primary btn-editar"><i class="fas fa-pen"></i></button>
          <button class="btn btn-sm btn-success btn-guardar d-none"><i class="fas fa-check"></i></button>
          <button class="btn btn-sm btn-secondary btn-cancelar d-none"><i class="fas fa-times"></i></button>
          <button class="btn btn-sm btn-danger" onclick="eliminarServicio(${servicio.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    `;

    tablaBody.appendChild(fila);
  });

  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', iniciarEdicion);
  });
}

function iniciarEdicion(e) {
  const fila = e.target.closest('tr');
  if (!fila) return;

  fila._originalData = obtenerDatosFila(fila);

  fila.querySelectorAll('[data-field]').forEach(celda => {
    const field = celda.dataset.field;
    if (field === 'img') {
      const input = celda.querySelector('input');
      if (input) input.classList.remove('d-none');
    } else if (field === 'fecha') {
      const valor = celda.textContent.trim();
      const [dd, mm, yyyy] = valor.split('/');
      const isoDate = `${yyyy}-${mm}-${dd}`;
      celda.innerHTML = `<input type="date" class="form-control form-control-sm" value="${isoDate}">`;
    } else if (field !== 'estado') {
      celda.setAttribute('contenteditable', 'true');
      celda.classList.add('editing');
    }
  });

  const celdaEstado = fila.querySelector('[data-field="estado"]');
  if (celdaEstado) {
    const valorActual = celdaEstado.textContent.trim();
    celdaEstado.innerHTML = `
      <select class="form-select form-select-sm">
        <option value="Activo"${valorActual === "Activo" ? " selected" : ""}>Activo</option>
        <option value="Inactivo"${valorActual === "Inactivo" ? " selected" : ""}>Inactivo</option>
      </select>
    `;
  }

  const btns = fila.querySelector('.btn-group');
  if (btns) {
    btns.querySelector('.btn-editar')?.classList.add('d-none');
    btns.querySelector('.btn-guardar')?.classList.remove('d-none');
    btns.querySelector('.btn-cancelar')?.classList.remove('d-none');
    btns.querySelector('.btn-info')?.classList.add('d-none');
    btns.querySelector('.btn-danger')?.classList.add('d-none');
  }
}

function cancelarEdicion(fila) {
  const original = fila._originalData;
  fila.querySelector('[data-field="titulo"]').textContent = original.titulo;
  fila.querySelector('[data-field="descripcion"]').textContent = original.descripcion;
  fila.querySelector('[data-field="precio"]').textContent = original.precio;
  fila.querySelector('[data-field="detalles"]').textContent = original.detalles.join(', ');
  fila.querySelector('[data-field="estado"]').textContent = original.estado;
  fila.querySelector('[data-field="fecha"]').textContent = convertirFecha(original.fechaDisponible || original.fechasDisponibles?.[0] || '-');

  fila.querySelectorAll('[data-field]').forEach(celda => {
    celda.removeAttribute('contenteditable');
    celda.classList.remove('editing');
  });

  fila.querySelector('[data-field="img"] input')?.classList.add('d-none');

  const btns = fila.querySelector('.btn-group');
  if (btns) {
    btns.querySelector('.btn-editar')?.classList.remove('d-none');
    btns.querySelector('.btn-guardar')?.classList.add('d-none');
    btns.querySelector('.btn-cancelar')?.classList.add('d-none');
    btns.querySelector('.btn-info')?.classList.remove('d-none');
    btns.querySelector('.btn-danger')?.classList.remove('d-none');
  }
}

function guardarEdicion(fila) {
  const nuevosDatos = obtenerDatosFila(fila);
  const inputFile = fila.querySelector('[data-field="img"] input');
  const servicios = obtenerServiciosPkes();
  const index = servicios.findIndex(s => s.id === nuevosDatos.id);

  if (index !== -1) {
    if (inputFile.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        servicios[index] = { ...nuevosDatos, img: e.target.result };
        guardarServiciosPkes(servicios);
        renderizarTabla();
      };
      reader.readAsDataURL(inputFile.files[0]);
    } else {
      servicios[index] = nuevosDatos;
      guardarServiciosPkes(servicios);
      renderizarTabla();
    }
  }
}

function obtenerDatosFila(fila) {
  const estadoSelect = fila.querySelector('[data-field="estado"] select');
  const estado = estadoSelect ? estadoSelect.value : fila.querySelector('[data-field="estado"]').textContent.trim();
  let fecha = '';
  const celdaFecha = fila.querySelector('[data-field="fecha"]');
  const inputFecha = celdaFecha?.querySelector('input[type="date"]');
  if (inputFecha) {
    const [yyyy, mm, dd] = inputFecha.value.split("-");
    fecha = `${dd}/${mm}/${yyyy}`;
  } else {
    fecha = celdaFecha?.textContent.trim() || '';
  }

  return {
    id: parseInt(fila.dataset.id),
    titulo: fila.querySelector('[data-field="titulo"]').textContent.trim(),
    descripcion: fila.querySelector('[data-field="descripcion"]').textContent.trim(),
    precio: parseInt(fila.querySelector('[data-field="precio"]').textContent.trim()),
    detalles: fila.querySelector('[data-field="detalles"]').textContent.split(',').map(d => d.trim()),
    estado: estado,
    fechaDisponible: fecha,
    img: fila.querySelector('[data-field="img"] img').src
  };
}

function convertirFecha(fechaISO) {
  if (!fechaISO || !fechaISO.includes("-")) return fechaISO;
  const [yyyy, mm, dd] = fechaISO.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

window.verServicio = function(id) {
  const servicio = obtenerServiciosPkes().find(s => s.id === id);
  if (!servicio) return;

  document.getElementById("modal-servicio-content").innerHTML = `
    <div class="salon-card">
      <img src="${servicio.img}" class="img-fluid rounded-top" alt="${servicio.titulo}">
      <h3>${servicio.titulo}</h3>
      <p class="text-muted">$${servicio.precio.toLocaleString("es-AR")}</p>
      <p>${servicio.descripcion}</p>
      <ul class="detalles-salon">
        ${servicio.detalles.map(d => `<li><i class="fas fa-check text-success me-2"></i>${d}</li>`).join('')}
      </ul>
    </div>
  `;
  const modal = new bootstrap.Modal(document.getElementById("modalVerServicio"));
  modal.show();
};

window.eliminarServicio = function(id) {
  if (confirm('¿Estás seguro de eliminar este servicio?')) {
    guardarServiciosPkes(obtenerServiciosPkes().filter(s => s.id !== id));
    renderizarTabla();
  }
};
