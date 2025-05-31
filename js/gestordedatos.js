
export const GestorDatos = {
   
    salonesIniciales: [
        {
            id: 1,
            nombre: "Salón Arcoíris",
            imagen: "../assets/img/salon1.jpg",
            descripcion: "Colorido espacio con juegos educativos.",
            precio: "$200/hora",
            capacidad: "20 niños",
            destacado: true
        },
        {
            id: 2,
            nombre: "Salón Fantasía",
            imagen: "../assets/img/salon2.jpg",
            descripcion: "Ambiente mágico de cuentos de hadas.",
            precio: "$250/hora",
            capacidad: "25 niños",
            destacado: true
        },
        {
            id: 3,
            nombre: "Salón Castillo",
            imagen: "../assets/img/salon3.jpg",
            descripcion: "Majestuoso castillo medieval.",
            precio: "$300/hora",
            capacidad: "30 niños"
        },
        {
            id: 4,
            nombre: "Salón Safari",
            imagen: "../assets/img/salon4.jpg",
            descripcion: "Aventura salvaje con animales.",
            precio: "$220/hora",
            capacidad: "22 niños"
        },
        {
            id: 5,
            nombre: "Salón Espacial",
            imagen: "../assets/img/salon5.jpg",
            descripcion: "Viaje interestelar para niños.",
            precio: "$280/hora",
            capacidad: "18 niños",
            destacado: true
        },
        {
            id: 6,
            nombre: "Salón Dulce Hogar",
            imagen: "../assets/img/salon6.jpg",
            descripcion: "Temática de golosinas y chocolate.",
            precio: "$180/hora",
            capacidad: "15 niños"
        }
    ],


    serviciosIniciales: [
        {
            id: 1,
            nombre: "Decoración Temática",
            imagen: "../assets/img/decoracion.jpg",
            descripcion: "Transformación completa del espacio.",
            precio: "$150",
            duracion: "3 horas",
            categoria: "decoracion"
        },
        {
            id: 2,
            nombre: "Animación Infantil",
            imagen: "../assets/img/animacion.jpg",
            descripcion: "Payasos y personajes animados.",
            precio: "$200",
            duracion: "4 horas",
            categoria: "entretenimiento"
        },
        {
            id: 3,
            nombre: "Catering Infantil",
            imagen: "../assets/img/catering.jpg",
            descripcion: "Menú saludable para niños.",
            precio: "$12/niño",
            duracion: "Todo el evento",
            categoria: "alimentacion"
        },
        {
            id: 4,
            nombre: "Fotografía Profesional",
            imagen: "../assets/img/fotografia.jpg",
            descripcion: "Sesión fotográfica temática.",
            precio: "$180",
            duracion: "2 horas",
            categoria: "recuerdos"
        },
        {
            id: 5,
            nombre: "Alquiler de Disfraces",
            imagen: "../assets/img/disfraces.jpg",
            descripcion: "Vestuario completo temático.",
            precio: "$30/disfraz",
            duracion: "Todo el evento",
            categoria: "vestuario"
        },
        {
            id: 6,
            nombre: "Torta Personalizada",
            imagen: "../assets/img/torta.jpg",
            descripcion: "Diseño exclusivo de torta.",
            precio: "$120",
            duracion: "Entrega en evento",
            categoria: "alimentacion"
        }
    ],


    init() {
        if (!localStorage.getItem('salones')) {
            localStorage.setItem('salones', JSON.stringify(this.salonesIniciales));
        }
        if (!localStorage.getItem('servicios')) {
            localStorage.setItem('servicios', JSON.stringify(this.serviciosIniciales));
        }
    },


    getSalones() {
        return JSON.parse(localStorage.getItem('salones')) || [];
    },

  
    getServicios() {
        return JSON.parse(localStorage.getItem('servicios')) || [];
    },


    getSalonesDestacados() {
        return this.getSalones().filter(salon => salon.destacado);
    },

    guardarDatos(tipo, datos) {
        localStorage.setItem(tipo, JSON.stringify(datos));
    }
};