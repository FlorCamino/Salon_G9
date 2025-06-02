import {
  obtenerServicios,
  cargarServiciosIniciales
} from './servicios.js';

export const TarjetasServiciosUsuario = {
  crearElemento(tag, atributos = {}, texto = '') {
    const el = document.createElement(tag);
    Object.entries(atributos).forEach(([k, v]) => el.setAttribute(k, v));
    if (texto) el.textContent = texto;
    return el;
  },

  crearTarjetaServicio(servicio) {
    const col = this.crearElemento('div', { class: 'col-12 col-md-4' });
    const card = this.crearElemento('div', { class: 'salon-card' });

    const img = this.crearElemento('img', {
      class: 'img-fluid rounded-top',
      src: servicio.img,
      alt: servicio.titulo
    });

    const h3 = this.crearElemento('h3', {}, servicio.titulo);

    const ul = this.crearElemento('ul', { class: 'detalles-salon' });
    servicio.detalles.forEach(d => {
      const li = this.crearElemento('li');
      const icon = this.crearElemento('i', { class: 'fa-solid fa-check' });
      li.append(icon, ' ' + d);
      ul.appendChild(li);
    });

    const precio = this.crearElemento('div', {
      class: 'precio-servicio mt-auto text-end pe-1'
    }, `$${servicio.precio.toLocaleString()}`); 

    const link = this.crearElemento('a', {
      href: 'crear_presupuesto.html',
      class: 'boton'
    }, 'Incluir en presupuesto');

    card.append(img, h3, ul, precio, link);
    col.appendChild(card);
    return col;
  },

  async mostrarServicios(selector) {
    await cargarServiciosIniciales();
    const servicios = obtenerServicios();
    const contenedor = document.querySelector(selector);
    contenedor.innerHTML = '';
    servicios.forEach(servicio => {
      contenedor.appendChild(this.crearTarjetaServicio(servicio));
    });
  }
};
