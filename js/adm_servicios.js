import {
  obtenerServicios,
  guardarServicios,
  cargarServiciosIniciales as cargarServiciosDesdeJSON
} from './servicios.js';

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form-servicio");
  const tablaBody = document.querySelector("#tabla-servicios tbody");
  const modalVerServicio = new bootstrap.Modal(document.getElementById("modalVerServicio"));

  await cargarServiciosDesdeJSON();
  renderizarTabla();

  function renderizarTabla() {
    const servicios = obtenerServicios();
    tablaBody.innerHTML = servicios.length
      ? servicios.map(servicio => `
        <tr data-id="${servicio.id}">
          <td class="align-middle" data-field="img">
            <img src="${servicio.img}" class="img-thumbnail" alt="${servicio.titulo}">
            <input type="file" class="d-none" accept="image/*" data-field="img">
          </td>
          <td class="align-middle" data-field="titulo">${servicio.titulo}</td>
          <td class="align-middle" data-field="descripcion">${servicio.descripcion}</td>
          <td class="align-middle" data-field="precio">${servicio.precio}</td>
          <td class="align-middle" data-field="detalles">${servicio.detalles.join(', ')}</td>
          <td class="align-middle">
            <div class="btn-group">
              <button class="btn btn-sm btn-info" onclick="verServicio(${servicio.id})"><i class="fas fa-eye"></i></button>
              <button class="btn btn-sm btn-primary btn-editar"><i class="fas fa-pen"></i></button>
              <button class="btn btn-sm btn-success btn-guardar d-none"><i class="fas fa-check"></i></button>
              <button class="btn btn-sm btn-secondary btn-cancelar d-none"><i class="fas fa-times"></i></button>
              <button class="btn btn-sm btn-danger" onclick="eliminarServicio(${servicio.id})"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join("")
      : `<tr><td colspan="6" class="text-center">No hay servicios registrados</td></tr>`;

    document.querySelectorAll('.btn-editar').forEach(btn =>
      btn.addEventListener('click', iniciarEdicion)
    );
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
      } else {
        celda.setAttribute('contenteditable', 'true');
        celda.classList.add('editing');
      }
    });

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

    fila.querySelectorAll('[data-field]').forEach(celda => {
      celda.removeAttribute('contenteditable');
      celda.classList.remove('editing');
    });

    const inputImg = fila.querySelector('[data-field="img"] input');
    if (inputImg) inputImg.classList.add('d-none');

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
    const servicios = obtenerServicios();
    const index = servicios.findIndex(s => s.id === nuevosDatos.id);

    if (index !== -1) {
      if (inputFile.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          servicios[index] = { ...nuevosDatos, img: e.target.result };
          guardarServicios(servicios);
          renderizarTabla();
        };
        reader.readAsDataURL(inputFile.files[0]);
      } else {
        servicios[index] = nuevosDatos;
        guardarServicios(servicios);
        renderizarTabla();
      }
    }
  }

  function obtenerDatosFila(fila) {
    return {
      id: parseInt(fila.dataset.id),
      titulo: fila.querySelector('[data-field="titulo"]').textContent.trim(),
      descripcion: fila.querySelector('[data-field="descripcion"]').textContent.trim(),
      precio: parseInt(fila.querySelector('[data-field="precio"]').textContent.trim()),
      detalles: fila.querySelector('[data-field="detalles"]').textContent.split(',').map(d => d.trim()),
      img: fila.querySelector('[data-field="img"] img').src
    };
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-guardar')) {
      guardarEdicion(e.target.closest('tr'));
    } else if (e.target.closest('.btn-cancelar')) {
      cancelarEdicion(e.target.closest('tr'));
    }
  });

  window.verServicio = function(id) {
    const servicio = obtenerServicios().find(s => s.id === id);
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
    modalVerServicio.show();
  };

  window.eliminarServicio = function(id) {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      guardarServicios(obtenerServicios().filter(s => s.id !== id));
      renderizarTabla();
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const servicios = obtenerServicios();
    const nuevoServicio = {
      id: Date.now(),
      titulo: document.getElementById("titulo").value.trim(),
      descripcion: document.getElementById("descripcion").value.trim(),
      precio: parseInt(document.getElementById("precio").value.trim()),
      detalles: document.getElementById("detalles").value.split(',').map(d => d.trim()),
      img: ''
    };

    const archivo = document.getElementById("img").files[0];
    if (!archivo) return alert("Debes seleccionar una imagen");

    const reader = new FileReader();
    reader.onload = (e) => {
      nuevoServicio.img = e.target.result;
      guardarServicios([...servicios, nuevoServicio]);
      form.reset();
      renderizarTabla();
    };
    reader.readAsDataURL(archivo);
  });
});
