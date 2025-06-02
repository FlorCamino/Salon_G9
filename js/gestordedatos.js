
const salonesIniciales = [
    {
        id: 1,
        nombre: "Salón Arcoíris",
        imagen: "../assets/img/salon1.jpg", 
        descripcion: "Colorido espacio con juegos educativos.",
        precio: "$200/hora",
        capacidad: "20 niños",
        destacado: true,
        disponibilidad: ["Lunes", "Miércoles", "Viernes"]
    },
    {
        id: 2,
        nombre: "Salón Fantasía",
        imagen: "../assets/img/salon2.jpg", 
        descripcion: "Ambiente mágico de cuentos de hadas.",
        precio: "$250/hora",
        capacidad: "25 niños",
        destacado: true,
        disponibilidad: ["Martes", "Jueves", "Sábado"]
    },
    {
        id: 3,
        nombre: "Salón Castillo",
        imagen: "../assets/img/salon3.jpg", 
        descripcion: "Majestuoso castillo medieval.",
        precio: "$300/hora",
        capacidad: "30 niños",
        destacado: false,
        disponibilidad: ["Lunes", "Miércoles", "Viernes", "Domingo"]
    },
    {
        id: 4,
        nombre: "Salón Safari",
        imagen: "../assets/img/salon4.jpg", 
        descripcion: "Aventura salvaje con animales.",
        precio: "$220/hora",
        capacidad: "22 niños",
        destacado: false,
        disponibilidad: ["Martes", "Jueves", "Sábado"]
    },
    {
        id: 5,
        nombre: "Salón Espacial",
        imagen: "../assets/img/salon5.jpg", 
        descripcion: "Viaje interestelar para niños.",
        precio: "$280/hora",
        capacidad: "18 niños",
        destacado: true,
        disponibilidad: ["Viernes", "Sábado", "Domingo"]
    },
    {
        id: 6,
        nombre: "Salón Dulce Hogar",
        imagen: "../assets/img/salon6.jpg", 
        descripcion: "Temática de golosinas y chocolate.",
        precio: "$180/hora",
        capacidad: "15 niños",
        destacado: false,
        disponibilidad: ["Lunes", "Miércoles", "Viernes"]
    }
];


const serviciosIniciales = [
    {
        id: 1,
        nombre: "Decoración Temática",
        imagen: "../assets/img/decoracion.jpg", 
        descripcion: "Transformación completa del espacio con la temática elegida.",
        precio: "$150",
        duracion: "3 horas",
        categoria: "decoración",
        incluye: ["Guirnaldas", "Globos", "Cartelería temática"]
    },
    {
        id: 2,
        nombre: "Animación Infantil",
        imagen: "../assets/img/animacion.jpg", 
        descripcion: "Payasos y personajes animados para divertir a los niños.",
        precio: "$200",
        duracion: "4 horas",
        categoria: "entretenimiento",
        incluye: ["2 animadores", "Juegos", "Premios"]
    },
    {
        id: 3,
        nombre: "Catering Infantil",
        imagen: "../assets/img/catering.jpg", 
        descripcion: "Menú saludable y divertido para los más pequeños.",
        precio: "$12 por niño",
        duracion: "Todo el evento",
        categoria: "alimentación",
        incluye: ["Sandwiches", "Jugos", "Postres", "Fruta"]
    },
    {
        id: 4,
        nombre: "Fotografía Profesional",
        imagen: "../assets/img/fotografia.jpg", 
        descripcion: "Sesión fotográfica temática para recordar el evento.",
        precio: "$180",
        duracion: "2 horas",
        categoria: "recuerdos",
        incluye: ["50 fotos editadas", "Marco digital", "Fotos impresas"]
    },
    {
        id: 5,
        nombre: "Alquiler de Disfraces",
        imagen: "../assets/img/disfraces.jpg", 
        descripcion: "Vestuario completo para los invitados según la temática.",
        precio: "$30 por disfraz",
        duracion: "Todo el evento",
        categoria: "vestuario",
        incluye: ["Disfraces adultos", "Disfraces niños", "Accesorios"]
    },
    {
        id: 6,
        nombre: "Torta Personalizada",
        imagen: "../assets/img/torta.jpg", 
        descripcion: "Diseño exclusivo de torta según tus preferencias.",
        precio: "$120",
        duracion: "Entrega en evento",
        categoria: "alimentación",
        incluye: ["Diseño personalizado", "Topper con nombre", "Velas"]
    }
];

export const GestorDatos = {
    
    async init() {
        try {
            if (!localStorage.getItem('salones') || JSON.parse(localStorage.getItem('salones')).length === 0) {
                localStorage.setItem('salones', JSON.stringify(salonesIniciales));
            }
            if (!localStorage.getItem('servicios') || JSON.parse(localStorage.getItem('servicios')).length === 0) {
                localStorage.setItem('servicios', JSON.stringify(serviciosIniciales));
            }
            return true;
        } catch (error) {
            console.error('Error al inicializar datos:', error);
            return false;
        }
    },

    getSalones() {
        try {
            const salones = JSON.parse(localStorage.getItem('salones'));
            return Array.isArray(salones) ? salones : [];
        } catch (e) {
            console.error('Error al obtener salones:', e);
            return [];
        }
    },

    getSalonById(id) {
        const salones = this.getSalones();
        return salones.find(salon => salon.id === id);
    },

    agregarSalon(nuevoSalon) {
        const salones = this.getSalones();
        const nuevoId = salones.length > 0 ? Math.max(...salones.map(s => s.id)) + 1 : 1;
        nuevoSalon.id = nuevoId;
        salones.push(nuevoSalon);
        localStorage.setItem('salones', JSON.stringify(salones));
        return nuevoSalon;
    },

    actualizarSalon(id, datosActualizados) {
        const salones = this.getSalones();
        const index = salones.findIndex(s => s.id === id);
        if (index !== -1) {
            salones[index] = { ...salones[index], ...datosActualizados, id: salones[index].id };
            localStorage.setItem('salones', JSON.stringify(salones));
            return true;
        }
        return false;
    },

    eliminarSalon(id) {
        let salones = this.getSalones();
        salones = salones.filter(salon => salon.id !== id); 
        localStorage.setItem('salones', JSON.stringify(salones));
        return true;
    },

    getSalonesDestacados() {
        return this.getSalones().filter(salon => salon.destacado);
    },

    getServicios() {
        try {
            const servicios = JSON.parse(localStorage.getItem('servicios'));
            return Array.isArray(servicios) ? servicios : [];
        } catch (e) {
            console.error('Error al obtener servicios:', e);
            return [];
        }
    },

    getServicioById(id) {
        const servicios = this.getServicios();
        return servicios.find(servicio => servicio.id === id);
    },

    agregarServicio(nuevoServicio) {
        const servicios = this.getServicios();
        const nuevoId = servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 1;
        nuevoServicio.id = nuevoId;
        servicios.push(nuevoServicio);
        localStorage.setItem('servicios', JSON.stringify(servicios));
        return nuevoServicio;
    },

    actualizarServicio(id, datosActualizados) {
        const servicios = this.getServicios();
        const index = servicios.findIndex(s => s.id === id);
        if (index !== -1) {
            servicios[index] = { ...servicios[index], ...datosActualizados, id: servicios[index].id };
            localStorage.setItem('servicios', JSON.stringify(servicios));
            return true;
        }
        return false;
    },

    eliminarServicio(id) {
        let servicios = this.getServicios(); 
        servicios = servicios.filter(servicio => servicio.id !== id); 
        localStorage.setItem('servicios', JSON.stringify(servicios));
        return true;
    },

    getServiciosPorCategoria(categoria) {
        return this.getServicios().filter(servicio => servicio.categoria === categoria);
    },

    getSalonesPorDisponibilidad(dia) {
        return this.getSalones().filter(salon => salon.disponibilidad.includes(dia));
    },

    getServiciosPorPrecioMaximo(precioMax) {
        return this.getServicios().filter(servicio => {
            const precioNum = parseFloat(servicio.precio.replace(/[^0-9.]/g, ''));
            return precioNum <= precioMax;
        });
    },

    guardarDatos(tipo, datos) {
        try {
            if (['salones', 'servicios'].includes(tipo)) {
                localStorage.setItem(tipo, JSON.stringify(datos));
                return true;
            }
            return false;
        } catch (e) {
            console.error(`Error al guardar ${tipo}:`, e);
            return false;
        }
    }
};