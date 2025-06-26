import {
  obtenerServiciosPkes,
  inicializarServiciosPkes
} from './servicios.js';

import { cargarFiltrosServiciosUsuario } from './ver_servicios_filtrados.js';

export const TarjetasServiciosUsuario = {
  crearElemento(tag, atributos = {}, texto = '') {
    const el = document.createElement(tag);
    Object.entries(atributos).forEach(([k, v]) => el.setAttribute(k, v));
    if (texto) el.textContent = texto;
    return el;
  },

  crearTarjetaServicio(servicio) {
    const col = this.crearElemento('div', { class: 'col-12 col-md-4' });
    const cardClass = servicio.estado === 'Activo' ? 'salon-card d-flex flex-column h-100' : 'salon-card card-inactivo d-flex flex-column h-100';
    const card = this.crearElemento('div', { class: cardClass });

    const img = this.crearElemento('img', {
      class: 'img-fluid rounded-top',
      src: servicio.img,
      alt: servicio.titulo,
      loading: 'lazy'
    });

    const h3 = this.crearElemento('h3', {}, servicio.titulo);

    const estadoTexto = servicio.estado === 'Activo' ? 'Estado: Disponible' : 'Estado: No disponible';
    const estado = this.crearElemento('div', {
      class: 'fw-bold text-start ps-2 pb-1 text-secondary'
    }, estadoTexto);

    const fechaFormateada = servicio.fechaDisponible ? formatearFecha(servicio.fechaDisponible) : '-';
    const fecha = this.crearElemento('div', {
      class: 'text-start ps-2 pb-1 text-secondary small'
    }, `Fecha: ${fechaFormateada}`);

    const ul = this.crearElemento('ul', { class: 'detalles-salon' });
    servicio.detalles.forEach(d => {
      const li = this.crearElemento('li');
      const icon = this.crearElemento('i', { class: 'fa-solid fa-check' });
      li.append(icon, ' ' + d);
      ul.appendChild(li);
    });

    const precio = this.crearElemento('div', {
      class: 'precio-servicio mt-auto text-end pe-2 text-pink fw-bold'
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

    card.append(img, h3, estado, fecha, ul, precio, link);
    col.appendChild(card);
    return col;
  },

  async mostrarServicios() {
    const contenedorDisponibles = document.getElementById("contenedor-servicios-disponibles");
    const contenedorInactivos = document.getElementById("contenedor-servicios-inactivos");
    const overlay = document.getElementById("loading-overlay");

    try {
      await inicializarServiciosPkes();
      const servicios = obtenerServiciosPkes();

      const activos = servicios.filter(s => s.estado === 'Activo');
      const inactivos = servicios.filter(s => s.estado === 'Inactivo');

      contenedorDisponibles.innerHTML = "";
      contenedorInactivos.innerHTML = "";

      if (activos.length > 0) {
        const filaActivos = this.crearElemento('div', { class: 'row g-4 mb-5' });
        activos.forEach(servicio => {
          filaActivos.appendChild(this.crearTarjetaServicio(servicio));
        });
        contenedorDisponibles.appendChild(filaActivos);
      }

      if (inactivos.length > 0) {
        const filaInactivos = this.crearElemento('div', { class: 'row g-4' });
        inactivos.forEach(servicio => {
          filaInactivos.appendChild(this.crearTarjetaServicio(servicio));
        });
        contenedorInactivos.appendChild(filaInactivos);
      }

    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      if (overlay) overlay.style.display = "none";
    }
  }
};

function formatearFecha(fechaISO) {
  if (!fechaISO) return '-';
  if (fechaISO.includes('/')) return fechaISO;
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}

window.addEventListener("DOMContentLoaded", () => {
  TarjetasServiciosUsuario.mostrarServicios();
  cargarFiltrosServiciosUsuario();
});
