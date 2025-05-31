import { GestorDatos } from './gestorDatos.js';

export const TarjetasDinamicas = {

    crearElemento(tag, atributos = {}, texto = '') {
        const elemento = document.createElement(tag);
        Object.entries(atributos).forEach(([key, value]) => {
            elemento.setAttribute(key, value);
        });
        if (texto) elemento.textContent = texto;
        return elemento;
    },

   
    crearTarjetaSalon(salon) {
        const col = this.crearElemento('div', {
            'class': 'col-md-6 col-lg-4 mb-4',
            'data-id': salon.id,
            'data-tipo': 'salon'
        });

        const card = this.crearElemento('div', {
            'class': `card h-100 ${salon.destacado ? 'border-primary shadow' : ''}`
        });

        const img = this.crearElemento('img', {
            'class': 'card-img-top img-fluid',
            'src': salon.imagen,
            'alt': salon.nombre,
            'loading': 'lazy',
            'style': 'height: 200px; object-fit: cover;'
        });

        const cardBody = this.crearElemento('div', {
            'class': 'card-body d-flex flex-column'
        });

        const title = this.crearElemento('h3', {
            'class': 'card-title h5'
        }, salon.nombre);

        const desc = this.crearElemento('p', {
            'class': 'card-text text-muted flex-grow-1'
        }, salon.descripcion);

        const footer = this.crearElemento('div', {
            'class': 'd-flex justify-content-between align-items-center mt-auto'
        });

        const price = this.crearElemento('span', {
            'class': 'badge bg-primary rounded-pill'
        }, salon.precio);

        const button = this.crearElemento('button', {
            'class': 'btn btn-sm btn-outline-primary',
            'type': 'button',
            'data-action': 'reservar'
        }, 'Reservar');

     
        footer.append(price, button);
        cardBody.append(title, desc, footer);
        card.append(img, cardBody);
        col.append(card);

        return col;
    },

 
    crearTarjetaServicio(servicio) {
        const col = this.crearElemento('div', {
            'class': 'col-md-6 col-lg-4 mb-4',
            'data-id': servicio.id,
            'data-tipo': 'servicio'
        });

        const card = this.crearElemento('div', {
            'class': 'card h-100'
        });

        const img = this.crearElemento('img', {
            'class': 'card-img-top img-fluid',
            'src': servicio.imagen,
            'alt': servicio.nombre,
            'loading': 'lazy',
            'style': 'height: 200px; object-fit: cover;'
        });

        const cardBody = this.crearElemento('div', {
            'class': 'card-body d-flex flex-column'
        });

        const title = this.crearElemento('h3', {
            'class': 'card-title h5'
        }, servicio.nombre);

        const desc = this.crearElemento('p', {
            'class': 'card-text text-muted flex-grow-1'
        }, servicio.descripcion);

        const details = this.crearElemento('div', {
            'class': 'd-flex justify-content-between align-items-center mt-auto'
        });

        const price = this.crearElemento('span', {
            'class': 'badge bg-success rounded-pill'
        }, servicio.precio);

        const button = this.crearElemento('button', {
            'class': 'btn btn-sm btn-outline-success',
            'type': 'button',
            'data-action': 'agregar'
        }, 'Agregar');

        details.append(price, button);
        cardBody.append(title, desc, details);
        card.append(img, cardBody);
        col.append(card);

        return col;
    },

  
    renderSalones(containerId, destacados = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        const salones = destacados 
            ? GestorDatos.getSalonesDestacados() 
            : GestorDatos.getSalones();

        salones.forEach(salon => {
            container.append(this.crearTarjetaSalon(salon));
        });
    },

   
    renderServicios(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        GestorDatos.getServicios().forEach(servicio => {
            container.append(this.crearTarjetaServicio(servicio));
        });
    },

   
    initEventos() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const card = btn.closest('[data-id]');
            const id = card.getAttribute('data-id');
            const tipo = card.getAttribute('data-tipo');
            const accion = btn.getAttribute('data-action');

            console.log(`${accion} ${tipo} con ID: ${id}`);
          
        });
    }
};