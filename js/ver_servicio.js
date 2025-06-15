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
      alt: servicio.titulo,
      loading: 'lazy'
    });

    const h3 = this.crearElemento('h3', {}, servicio.titulo);

    const estadoTexto = servicio.estado === 'Activo' ? 'Estado: Disponible' : 'Estado: No disponible';
    const estado = this.crearElemento('div', {
      class: 'fw-bold text-start ps-2 pb-2 text-secondary'
    }, estadoTexto);

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

    let link;
    if (servicio.estado === 'Activo') {
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

  async mostrarServicios(selector) {
    const contenedor = document.querySelector(selector);
    const overlay = document.getElementById("loading-overlay");

    try {
      await cargarServiciosIniciales();
      const servicios = obtenerServicios();

      const activos = servicios.filter(s => s.estado === 'Activo');
      const inactivos = servicios.filter(s => s.estado !== 'Activo');

      if (activos.length > 0) {
        const seccionActivos = this.crearElemento('div', { class: 'row g-4 mb-5' });
        activos.forEach(servicio => {
          seccionActivos.appendChild(this.crearTarjetaServicio(servicio));
        });
        contenedor.appendChild(seccionActivos);
      }

      if (inactivos.length > 0) {
        const titulo = this.crearElemento('h3', { class: 'text-muted mt-4' }, 'Actualmente no disponibles');
        contenedor.appendChild(titulo);

        const seccionInactivos = this.crearElemento('div', { class: 'row g-4' });
        inactivos.forEach(servicio => {
          seccionInactivos.appendChild(this.crearTarjetaServicio(servicio));
        });
        contenedor.appendChild(seccionInactivos);
      }

    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      if (overlay) overlay.style.display = "none";
    }
  }
};

window.addEventListener("load", () => {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) overlay.style.display = "none";
});
