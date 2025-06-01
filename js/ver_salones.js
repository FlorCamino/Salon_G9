import {
  obtenerSalones,
  cargarSalonesIniciales
} from './salones.js';

export const TarjetasSalonesUsuario = {
  crearElemento(tag, atributos = {}, texto = '') {
    const el = document.createElement(tag);
    Object.entries(atributos).forEach(([k, v]) => el.setAttribute(k, v));
    if (texto) el.textContent = texto;
    return el;
  },

  crearTarjetaSalon(salon) {
    const col = this.crearElemento('div', { class: 'col-12 col-md-4' });
    const card = this.crearElemento('div', { class: 'salon-card' });

    const img = this.crearElemento('img', {
      class: 'img-fluid rounded-top',
      src: salon.img,
      alt: salon.nombre
    });

    const h3 = this.crearElemento('h3', {}, salon.nombre);

    const ul = this.crearElemento('ul', { class: 'detalles-salon' });
    salon.detalles.forEach(d => {
      const li = this.crearElemento('li');
      const icon = this.crearElemento('i', { class: 'fa-solid fa-check' });
      li.append(icon, ' ' + d);
      ul.appendChild(li);
    });

    const link = this.crearElemento('a', {
      href: 'crear_presupuesto.html',
      class: 'boton'
    }, 'Incluir en presupuesto');

    card.append(img, h3, ul, link);
    col.appendChild(card);
    return col;
  },

  async mostrarSalones(selector) {
    await cargarSalonesIniciales();
    const salones = obtenerSalones();
    const contenedor = document.querySelector(selector);
    contenedor.innerHTML = '';
    salones.forEach(salon => {
      contenedor.appendChild(this.crearTarjetaSalon(salon));
    });
  }
};
