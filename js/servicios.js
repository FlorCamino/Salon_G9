const SERVICIOS_KEY = "servicios_pkes";

function obtenerServicios() {
  return JSON.parse(localStorage.getItem(SERVICIOS_KEY)) || [];
}

function guardarServicios(servicios) {
  localStorage.setItem(SERVICIOS_KEY, JSON.stringify(servicios));
}

function cargarServiciosIniciales() {
  if (localStorage.getItem(SERVICIOS_KEY)) return;

  const servicios = [
    {
      id: Date.now() + 1,
      titulo: "Decoración Temática",
      descripcion: "Transformamos el espacio con una ambientación única, creativa y personalizada según la temática elegida.",
      img: "../assets/img/decoracion_tematica.jpg",
      detalles: [
        "Ambientación temática completa",
        "Centros de mesa personalizados",
        "Arcos de globos",
        "Cartelería personalizada"
      ]
    },
    {
      id: Date.now() + 2,
      titulo: "Animación Infantil",
      descripcion: "Animadores expertos que garantizan risas, juegos y participación de todos los niños durante el evento.",
      img: "../assets/img/animacion_infantil.jpg",
      detalles: [
        "Shows interactivos",
        "Juegos organizados",
        "Bailes y coreografías",
        "Personajes disfrazados"
      ]
    },
    {
      id: Date.now() + 3,
      titulo: "Catering",
      descripcion: "Menú variado y adaptado a las edades de los invitados. Opciones saludables y deliciosas para todos.",
      img: "../assets/img/catering_infantil.jpg",
      detalles: [
        "Menú infantil completo",
        "Mesa dulce",
        "Bebidas sin alcohol",
        "Opción sin TACC"
      ]
    },
    {
      id: Date.now() + 4,
      titulo: "Fotografía Profesional",
      descripcion: "Capturamos cada sonrisa y momento especial con calidad profesional. Entregamos recuerdos imborrables.",
      img: "../assets/img/fotografia_profesional.jpg",
      detalles: [
        "Álbum digital completo",
        "Sesión fotográfica previa",
        "Entrega en pendrive o nube",
        "Fotos impresas opcionales"
      ]
    },
    {
      id: Date.now() + 5,
      titulo: "Castillo Inflable",
      descripcion: "Diversión asegurada para los más chicos con castillos inflables seguros y coloridos.",
      img: "../assets/img/castillo_inflable.jpg",
      detalles: [
        "Tamaño mediano y grande",
        "Supervisión incluida",
        "Limpieza y mantenimiento",
        "Colores y formas divertidas"
      ]
    },
    {
      id: Date.now() + 6,
      titulo: "Pintura de Rostro",
      descripcion: "Colores vibrantes, materiales seguros y mucha imaginación para que cada niño sea su personaje favorito.",
      img: "../assets/img/pintura_rostro.jpg",
      detalles: [
        "Diseños temáticos variados",
        "Pinturas hipoalergénicas",
        "Secado rápido",
        "Incluye glitter y piedras"
      ]
    },
    {
      id: Date.now() + 7,
      titulo: "Alquiler de Disfraces",
      descripcion: "Gran variedad de disfraces temáticos para niños y adultos, todos en excelente estado.",
      img: "../assets/img/disfraces.jpg",
      detalles: [
        "Temáticas infantiles clásicas",
        "Talles para todas las edades",
        "Higienizados y seguros",
        "Accesorios incluidos"
      ]
    },
    {
      id: Date.now() + 8,
      titulo: "Diseño de Invitaciones",
      descripcion: "Invitaciones digitales o impresas con el estilo y la temática de tu evento.",
      img: "../assets/img/invitaciones.jpg",
      detalles: [
        "Diseño personalizado",
        "Formato digital y físico",
        "Entrega rápida",
        "Opción eco-friendly"
      ]
    }
  ];  

  guardarServicios(servicios);
}

document.addEventListener("DOMContentLoaded", () => {
  cargarServiciosIniciales();
  const servicios = obtenerServicios();
  const contenedor = document.getElementById("contenedor-servicios");

  if (!servicios.length || !contenedor) return;

  contenedor.innerHTML = servicios.map(servicio => `
    <div class="col-12 col-md-4">
      <div class="servicio-card">
        <img src="${servicio.img}" class="img-fluid" alt="${servicio.titulo}">
        <h3>${servicio.titulo}</h3>
        <p>${servicio.descripcion}</p>
        <ul>
          ${servicio.detalles.map(det => `<li><i class="fa-solid fa-check"></i>${det}</li>`).join("")}
        </ul>
        <a href="crear_presupuesto.html" class="boton">Agregar al presupuesto</a>
      </div>
    </div>
  `).join("");
});
  
  document.addEventListener("DOMContentLoaded", () => {
    cargarServiciosIniciales();
    renderizarServiciosCarousel();
  });
  
