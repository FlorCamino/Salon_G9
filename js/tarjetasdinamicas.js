import { GestorDatos } from './gestorDatos.js';

export const TarjetasDinamicas = {
 
    crearElemento(tag, atributos = {}, texto = '', hijos = []) {
        const elemento = document.createElement(tag);
        Object.keys(atributos).forEach(key => {
            elemento.setAttribute(key, atributos[key]);
        });
        if (texto) elemento.textContent = texto;
        hijos.forEach(hijo => elemento.appendChild(hijo));
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

            'src': salon.imagen || '../assets/img/default.jpg', 
            'alt': salon.nombre || 'Salón de eventos',
            'loading': 'lazy',
            'style': 'height: 200px; object-fit: cover;',

            'onerror': "this.onerror=null; this.src='../assets/img/default.jpg';" 
        });

        const cardBody = this.crearElemento('div', { 'class': 'card-body d-flex flex-column' });
        const title = this.crearElemento('h3', { 'class': 'card-title h5' }, salon.nombre || 'Salón sin nombre');
        const desc = this.crearElemento('p', { 'class': 'card-text text-muted flex-grow-1' }, salon.descripcion || 'Descripción no disponible');
        const footer = this.crearElemento('div', { 'class': 'd-flex justify-content-between align-items-center mt-auto' });
        const price = this.crearElemento('span', { 'class': 'badge bg-primary rounded-pill' }, salon.precio || '$0');
        const button = this.crearElemento('button', {
            'class': 'btn btn-sm btn-outline-primary',
            'type': 'button',
            'data-action': 'reservar'
        }, 'Reservar');

        footer.appendChild(price);
        footer.appendChild(button);
        cardBody.appendChild(title);
        cardBody.appendChild(desc);
        cardBody.appendChild(footer);
        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);

        return col;
    },

    crearTarjetaServicio(servicio) {
        const col = this.crearElemento('div', {
            'class': 'col-md-6 col-lg-4 mb-4',
            'data-id': servicio.id,
            'data-tipo': 'servicio'
        });

        const card = this.crearElemento('div', { 'class': 'card h-100' });

        const img = this.crearElemento('img', {
            'class': 'card-img-top img-fluid',
   
            'src': servicio.imagen || '../assets/img/default.jpg', 
            'alt': servicio.nombre || 'Servicio',
            'loading': 'lazy',
            'style': 'height: 200px; object-fit: cover;',
   
            'onerror': "this.onerror=null; this.src='../assets/img/default.jpg';" 
        });

        const cardBody = this.crearElemento('div', { 'class': 'card-body d-flex flex-column' });
        const title = this.crearElemento('h3', { 'class': 'card-title h5' }, servicio.nombre || 'Servicio sin nombre');
        const desc = this.crearElemento('p', { 'class': 'card-text text-muted flex-grow-1' }, servicio.descripcion || 'Descripción no disponible');
        const details = this.crearElemento('div', { 'class': 'd-flex justify-content-between align-items-center mt-auto' });
        const price = this.crearElemento('span', { 'class': 'badge bg-success rounded-pill' }, servicio.precio || '$0');
        const button = this.crearElemento('button', {
            'class': 'btn btn-sm btn-outline-success',
            'type': 'button',
            'data-action': 'agregar'
        }, 'Agregar');

        details.appendChild(price);
        details.appendChild(button);
        cardBody.appendChild(title);
        cardBody.appendChild(desc);
        cardBody.appendChild(details);
        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);

        return col;
    },

    renderSalones(containerId, destacados = false) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor con ID ${containerId} no encontrado`);
            return;
        }
        container.innerHTML = '';
        const salones = destacados 
            ? GestorDatos.getSalonesDestacados() 
            : GestorDatos.getSalones();

        if (salones.length === 0) {
            container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">No hay salones disponibles</p></div>`;
            return;
        }

        salones.forEach(salon => {
            const tarjeta = this.crearTarjetaSalon(salon);
            tarjeta.addEventListener('click', (e) => {
                if (!e.target.closest('[data-action]')) {

                    window.location.href = `../ver_salon.html?id=${salon.id}`; 
                }
            });
            container.appendChild(tarjeta);
        });
    },

    renderServicios(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor con ID ${containerId} no encontrado`);
            return;
        }
        container.innerHTML = '';
        const servicios = GestorDatos.getServicios();

        if (servicios.length === 0) {
            container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">No hay servicios disponibles</p></div>`;
            return;
        }
      
        servicios.forEach(servicio => {
            const tarjeta = this.crearTarjetaServicio(servicio);
            tarjeta.addEventListener('click', (e) => {
                if (!e.target.closest('[data-action]')) {

                    window.location.href = `../ver_servicio.html?id=${servicio.id}`; 
                }
            });
            container.appendChild(tarjeta);
        });
    },

    initEventos() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const card = btn.closest('[data-id]');
            if (!card) return;

            const id = card.getAttribute('data-id');
            const tipo = card.getAttribute('data-tipo');
            const accion = btn.getAttribute('data-action');

            console.log(`${accion} ${tipo} con ID: ${id}`);
            
            if (accion === 'reservar' && tipo === 'salon') {

                window.location.href = `../crear_presupuesto.html?salonId=${id}`;
            } else if (accion === 'agregar' && tipo === 'servicio') {
                alert(`Agregando servicio ${id} al presupuesto (lógica pendiente).`);
            }
        });
    }
};