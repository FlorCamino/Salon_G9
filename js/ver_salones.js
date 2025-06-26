import {
  obtenerSalones,
  inicializarSalones
} from './salones.js';

import { obtenerReservas } from './reservas.js';

const TarjetasSalonesUsuario = {
  crearElemento(tag, atributos = {}, texto = '') {
    const el = document.createElement(tag);
    Object.entries(atributos).forEach(([k, v]) => el.setAttribute(k, v));
    if (texto) el.textContent = texto;
    return el;
  },

  crearTarjetaSalon(salon) {
    const col = this.crearElemento('div', { class: 'col-12 col-md-4' });
    const card = this.crearElemento('div', { class: 'salon-card d-flex flex-column h-100' });

    const img = this.crearElemento('img', {
      class: 'img-fluid rounded-top',
      src: salon.img,
      alt: salon.nombre,
      loading: 'lazy'
    });

    const h3 = this.crearElemento('h3', {}, salon.nombre);

    const estadoTexto = salon.estado === 'Disponible' ? 'Disponible' : 'No disponible';
    const estado = this.crearElemento('div', {
      class: 'fw-bold text-start ps-2 pb-1 text-secondary'
    }, `Estado: ${estadoTexto}`);

    const capacidad = this.crearElemento('div', {
      class: 'text-start ps-2 pb-1 text-secondary small'
    }, `Capacidad: ${salon.capacidad}`);

    const fechaFormateada = salon.fechaDisponible ? formatearFecha(salon.fechaDisponible) : '-';
    const fechaProxima = this.crearElemento('div', {
      class: 'text-start ps-2 pb-2 text-secondary small'
    }, `Fecha: ${fechaFormateada}`);

    const ul = this.crearElemento('ul', { class: 'detalles-salon' });
    salon.detalles.forEach(d => {
      const li = this.crearElemento('li');
      const icon = this.crearElemento('i', { class: 'fa-solid fa-check' });
      li.append(icon, ' ' + d);
      ul.appendChild(li);
    });

    const precio = this.crearElemento('div', {
      class: 'precio-servicio mt-auto text-end pe-2 text-pink fw-bold'
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

    card.append(img, h3, estado, capacidad, fechaProxima, ul, precio, link);
    col.appendChild(card);
    return col;
  },

  async mostrarSalones() {
    const contenedorDisponibles = document.getElementById("contenedor-disponibles");
    const contenedorNoDisponibles = document.getElementById("contenedor-no-disponibles");
    const overlay = document.getElementById("loading-overlay");

    try {
      const salonesEnMemoria = JSON.parse(localStorage.getItem("salones_pkes"));

      if (!Array.isArray(salonesEnMemoria) || salonesEnMemoria.length === 0) {
        await inicializarSalones();
      }

      const salones = obtenerSalones();
      const reservas = obtenerReservas();

      const disponibles = [];
      const noDisponibles = [];

      salones.forEach(salon => {
        if (salon.estado === "Mantenimiento") return;

        const estaReservadaOPagada = reservas.some(r =>
          r.salon?.nombre === salon.nombre &&
          r.fecha === salon.fechaDisponible &&
          (r.estado === "Reservado" || r.estado === "Pagado")
        );

        if (salon.estado === "Disponible" && !estaReservadaOPagada) {
          disponibles.push(salon);
        } else if (
          salon.estado === "Reservado" ||
          salon.estado === "Pagado" ||
          estaReservadaOPagada
        ) {
          noDisponibles.push(salon);
        }
      });

      contenedorDisponibles.innerHTML = "";
      contenedorNoDisponibles.innerHTML = "";

      if (disponibles.length > 0) {
        const seccionDisponibles = this.crearElemento('div', { class: 'row g-4 mb-5' });
        disponibles.forEach(salon => {
          seccionDisponibles.appendChild(this.crearTarjetaSalon(salon));
        });
        contenedorDisponibles.appendChild(seccionDisponibles);
      }

      if (noDisponibles.length > 0) {
        const seccionNoDisponibles = this.crearElemento('div', { class: 'row g-4' });
        noDisponibles.forEach(salon => {
          seccionNoDisponibles.appendChild(this.crearTarjetaSalon(salon));
        });
        contenedorNoDisponibles.appendChild(seccionNoDisponibles);
      }

    } catch (error) {
      console.error("Error al cargar salones:", error);
    } finally {
      if (overlay) overlay.style.display = "none";
    }
  }
};

function formatearFecha(fechaStr) {
  if (!fechaStr || typeof fechaStr !== 'string') return '-';
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [anio, mes, dia] = fechaStr.split("-");
    return `${dia}/${mes}/${anio}`;
  }
  return fechaStr;
}

window.addEventListener("DOMContentLoaded", () => {
  TarjetasSalonesUsuario.mostrarSalones();
});

export {
  inicializarSalones,
  TarjetasSalonesUsuario
};
