import {
    SALONES_KEY,
    obtenerSalones,
    guardarSalones,
    cargarSalonesIniciales
} from './salones.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("agregar-salon");
    const tablaBody = document.querySelector("#tabla-salones tbody");
    const modalVerSalon = new bootstrap.Modal(document.getElementById('modalVerSalon'));

    cargarSalonesIniciales();
    renderizarTabla();

    function renderizarTabla() {
        const salones = obtenerSalones();
        tablaBody.innerHTML = salones.length ? salones.map(salon => {

            return `
            <tr data-id="${salon.id}">
                <td class="align-middle" data-field="img">
                    <img src="${salon.img}" class="img-thumbnail" alt="${salon.nombre}">
                    <input type="file" class="d-none" accept="image/*" data-field="img">
                </td>
                <td class="align-middle" data-field="nombre">${salon.nombre}</td>
                <td class="align-middle" data-field="ubicacion">${salon.ubicacion}</td>
                <td class="align-middle" data-field="precio">${salon.precio}</td>
                <td class="align-middle" data-field="estado">${salon.estado}</td>
                <td class="align-middle" data-field="detalles">${Array.isArray(salon.detalles) ? salon.detalles.join(', ') : ''}</td>
                <td class="align-middle">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-info" onclick="verSalon(${salon.id})"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-sm btn-primary btn-editar"><i class="fas fa-pen"></i></button>
                        <button class="btn btn-sm btn-success btn-guardar d-none"><i class="fas fa-check"></i></button>
                        <button class="btn btn-sm btn-secondary btn-cancelar d-none"><i class="fas fa-times"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarSalon(${salon.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
            `;
        }).join("") : `<tr><td colspan="7" class="text-center">No hay salones registrados</td></tr>`;

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
                    <option value="Disponible"${valorActual === "Disponible" ? " selected" : ""}>Disponible</option>
                    <option value="Reservado"${valorActual === "Reservado" ? " selected" : ""}>Reservado</option>
                    <option value="Mantenimiento"${valorActual === "Mantenimiento" ? " selected" : ""}>Mantenimiento</option>
                    <option value="Pagado"${valorActual === "Pagado" ? " selected" : ""}>Pagado</option>
                </select>
            `;
        }

        const btnGroup = fila.querySelector('.btn-group');
        if (btnGroup) {
            btnGroup.querySelector('.btn-editar')?.classList.add('d-none');
            btnGroup.querySelector('.btn-guardar')?.classList.remove('d-none');
            btnGroup.querySelector('.btn-cancelar')?.classList.remove('d-none');
            btnGroup.querySelector('.btn-info')?.classList.add('d-none');
            btnGroup.querySelector('.btn-danger')?.classList.add('d-none');
        }
    }

    function cancelarEdicion(fila) {
        const original = fila._originalData;
        fila.querySelector('[data-field="nombre"]').textContent = original.nombre;
        fila.querySelector('[data-field="ubicacion"]').textContent = original.ubicacion;
        fila.querySelector('[data-field="precio"]').textContent = original.precio;
        fila.querySelector('[data-field="estado"]').textContent = original.estado;
        fila.querySelector('[data-field="detalles"]').textContent = original.detalles.join(', ');

        fila.querySelectorAll('[data-field]').forEach(celda => {
            celda.removeAttribute('contenteditable');
            celda.classList.remove('editing');
        });

        fila.querySelector('[data-field="img"] input')?.classList.add('d-none');

        const btnGroup = fila.querySelector('.btn-group');
        if (btnGroup) {
            btnGroup.querySelector('.btn-editar')?.classList.remove('d-none');
            btnGroup.querySelector('.btn-guardar')?.classList.add('d-none');
            btnGroup.querySelector('.btn-cancelar')?.classList.add('d-none');
            btnGroup.querySelector('.btn-info')?.classList.remove('d-none');
            btnGroup.querySelector('.btn-danger')?.classList.remove('d-none');
        }
    }

    function guardarEdicion(fila) {
        const nuevosDatos = obtenerDatosFila(fila);
        const inputFile = fila.querySelector('[data-field="img"] input');
        const salones = obtenerSalones();
        const index = salones.findIndex(s => s.id === parseInt(fila.dataset.id));

        if (index !== -1) {
            if (inputFile.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    salones[index] = { ...nuevosDatos, img: e.target.result };
                    guardarSalones(salones);
                    renderizarTabla();
                };
                reader.readAsDataURL(inputFile.files[0]);
            } else {
                salones[index] = nuevosDatos;
                guardarSalones(salones);
                renderizarTabla();
            }
        }
    }

    function obtenerDatosFila(fila) {
        const estadoSelect = fila.querySelector('[data-field="estado"] select');
        const estado = estadoSelect ? estadoSelect.value : fila.querySelector('[data-field="estado"]').textContent.trim();

        return {
            id: parseInt(fila.dataset.id),
            nombre: fila.querySelector('[data-field="nombre"]').textContent.trim(),
            ubicacion: fila.querySelector('[data-field="ubicacion"]').textContent.trim(),
            precio: parseInt(fila.querySelector('[data-field="precio"]').textContent.trim()),
            estado: estado,
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

    window.verSalon = function(id) {
        const salon = obtenerSalones().find(s => s.id === id);
        if (!salon) return;

        document.getElementById('modal-saloon-content').innerHTML = `
            <div class="salon-card">
                <img src="${salon.img}" class="img-fluid rounded-top" alt="${salon.nombre}">
                <h3>${salon.nombre}</h3>
                <p class="text-muted">${salon.ubicacion || ''}</p>
                <p class="text-muted">Precio: $${salon.precio}</p>
                <p class="text-muted">Estado: ${salon.estado}</p>
                <ul class="detalles-salon">
                    ${salon.detalles.map(d => `<li><i class="fas fa-check text-success me-2"></i>${d}</li>`).join('')}
                </ul>
            </div>
        `;
        modalVerSalon.show();
    };

    window.eliminarSalon = function(id) {
        if (confirm('¿Estás seguro de eliminar este salón?')) {
            guardarSalones(obtenerSalones().filter(s => s.id !== id));
            renderizarTabla();
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const nuevoSalon = {
            id: Date.now(),
            nombre: formData.get('InputSalon'),
            ubicacion: formData.get('InputUbicacion'),
            precio: parseInt(formData.get('InputPrecio')),
            estado: formData.get('InputEstado'),
            detalles: formData.get('InputDetalles').split(',').map(d => d.trim()),
            img: ''
        };

        const imgFile = formData.get('img');
        if (imgFile && imgFile.size > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                nuevoSalon.img = e.target.result;
                guardarSalones([...obtenerSalones(), nuevoSalon]);
                form.reset();
                renderizarTabla();
            };
            reader.readAsDataURL(imgFile);
        } else {
            alert('Debe seleccionar una imagen');
        }
    });
});
