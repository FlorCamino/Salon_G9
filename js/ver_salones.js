import { obtenerSalones, cargarSalonesIniciales } from '../js/salones.js';

export const TarjetasSalonesUsuario = {
    crearElemento(tag, atributos = {}, texto = '') {
        const elemento = document.createElement(tag);
        Object.entries(atributos).forEach(([key, value]) => elemento.setAttribute(key, value));
        if (texto) elemento.textContent = texto;
        return elemento;
    },

    crearTarjetaSalon(salon) {
        const col = this.crearElemento('div', {class: 'col-12 col-md-4'});
        const card = this.crearElemento('div', {class: 'salon-card'});

        const img = this.crearElemento('img', {
            class: 'img-fluid rounded-top',
            src: salon.img,
            alt: salon.nombre
        });

        const title = this.crearElemento('h3', {}, salon.nombre);

        const ul = this.crearElemento('ul', {class: 'detalles-salon'});
        salon.detalles.forEach(detalle => {
            const li = this.crearElemento('li');
            const icon = this.crearElemento('i', {class:'fa-solid fa-check'});
            li.append(icon, ' ' + detalle);
            ul.appendChild(li);
        });

        const link = this.crearElemento('a', {
            href: 'crear_presupuesto.html',
            class: 'boton'}, 'Incluir en presupuesto');

        card.append(img, title, ul, link);
        col.appendChild(card);
        return col;
    },

    mostrarSalones(containerSelector) {
        cargarSalonesIniciales();
        const salones = obtenerSalones();
        const container = document.querySelector(containerSelector);
        container.innerHTML = '';
        salones.forEach(salon => {
            container.appendChild(this.crearTarjetaSalon(salon));
        });
    }
};