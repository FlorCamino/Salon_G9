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
      alt: salon.nombre,
      loading: 'lazy'
    });

    const h3 = this.crearElemento('h3', {}, salon.nombre);

    const estadoTexto = salon.estado === 'Disponible' ? 'Disponible' : 'No disponible';
    const estado = this.crearElemento('div', {
      class: 'fw-bold text-start ps-2 pb-2 text-secondary'
    }, `Estado: ${estadoTexto}`);

    const ul = this.crearElemento('ul', { class: 'detalles-salon' });
    salon.detalles.forEach(d => {
      const li = this.crearElemento('li');
      const icon = this.crearElemento('i', { class: 'fa-solid fa-check' });
      li.append(icon, ' ' + d);
      ul.appendChild(li);
    });

    const precio = this.crearElemento('div', {
      class: 'precio-servicio mt-auto text-end pe-1 text-pink'
    }, `$${salon.precio.toLocaleString()}`);

    let link;
    if (salon.estado === 'Disponible') {
      link = this.crearElemento('a', {
        href: 'crear_presupuesto.html',
        class: 'boton'
      }, 'Incluir en presupuesto');
    } else {
      link = this.crearElemento('span', {
        class: 'boton boton-disabled text-muted'
      }, 'No disponible');
    }

    card.append(img, h3, estado, ul, precio, link);
    col.appendChild(card);
    return col;
  },

  async mostrarSalones(selector) {
    const contenedor = document.querySelector(selector);
    const overlay = document.getElementById("loading-overlay");

    try {
      await cargarSalonesIniciales();
      const salones = obtenerSalones();

      const disponibles = salones.filter(s => s.estado === 'Disponible');
      const noDisponibles = salones.filter(s => s.estado !== 'Disponible');

      if (disponibles.length > 0) {
        const seccionDisponibles = this.crearElemento('div', { class: 'row g-4 mb-5' });
        disponibles.forEach(salon => {
          seccionDisponibles.appendChild(this.crearTarjetaSalon(salon));
        });
        contenedor.appendChild(seccionDisponibles);
      }

      if (noDisponibles.length > 0) {
        const titulo = this.crearElemento('h3', { class: 'text-muted mt-4' }, 'Actualmente no disponibles');
        contenedor.appendChild(titulo);

        const seccionNoDisponibles = this.crearElemento('div', { class: 'row g-4' });
        noDisponibles.forEach(salon => {
          seccionNoDisponibles.appendChild(this.crearTarjetaSalon(salon));
        });
        contenedor.appendChild(seccionNoDisponibles);
      }

    } catch (error) {
      console.error("Error al cargar salones:", error);
    } finally {
      if (overlay) overlay.style.display = "none";
    }
  }
};

window.addEventListener("load", () => {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) overlay.style.display = "none";
});