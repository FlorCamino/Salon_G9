# 🎓 Trabajo Final Integrador - Introducción al Desarrollo Web

**Facultad de Ciencias de la Administración – UNER**  
**Tecnicatura Universitaria en Desarrollo Web – 2° Año · 1° Cuatrimestre 2025**

---

## 🧑‍🤝‍🧑 Integrantes del Grupo G9

- Franco Challiol  
- Florencia Camino  
- Micaela Zalazar  
- Damián Ottone  
- Janet Casaretto  

---

## 📌 Descripción del Proyecto

Este sitio web fue desarrollado como Trabajo Final Integrador para la materia **Introducción al Desarrollo Web**, con el objetivo de permitir la gestión de **casas de cumpleaños infantiles**. Ofrece un catálogo visualmente atractivo con información sobre salones, servicios y presupuestos.

Los usuarios pueden explorar opciones, solicitar presupuestos, y los administradores gestionar los salones y servicios disponibles. Se hace uso de **HTML5 semántico**, **CSS personalizado**, **Bootstrap 5**, **JavaScript** y **LocalStorage**.

---

## 🛠️ Funcionalidades Implementadas

- ABM de salones de eventos
- ABM de servicios
- Creación de presupuestos personalizados
- Filtrado y visualización de salones
- Sitio responsivo con diseño moderno
- Persistencia de datos con LocalStorage

---

## 🎥 Video de Presentación

📎 Enlace: [link]

---

## 🌐 Repositorio del Proyecto

📎 Enlace: (https://github.com/FlorCamino/Salon_G9.git)

---

## 📁 Estructura del Proyecto

```
SALON_G9/
├── administradores/                   # Vistas y paneles exclusivos para administración
│   ├── adm_reservas.html
│   ├── adm_salones.html
│   ├── adm_servicios.html
│   ├── adm_usuarios.html
│   └── home_admin.html
│
├── usuarios/                          # Vistas públicas accesibles por los usuarios
│   ├── buscar_reserva.html
│   ├── crear_presupuesto.html
│   ├── home_user.html
│   ├── ver_presupuesto.html
│   ├── ver_reserva.html
│   ├── ver_salon.html
│   ├── ver_servicio.html
│
├── componentes/                       # Componentes HTML reutilizables
│   ├── footer.html                    
│   ├── header_admin.html             # Header exclusivo para admin
│   ├── header_index.html             # Header para página de inicio pre-login
│   └── header.html                   # Header exclusivo para usuarios
│
├── assets/
│   ├── bootstrap/                     # Bootstrap CSS & JS (copiados localmente)
│   ├── img/                           # Imágenes del sitio (logos, fondos, salones, etc.)
│   └── data/                          # Archivos JSON como base de datos local
│       ├── institucional.json
│       ├── reservas.json
│       ├── salones.json
│       └── servicios.json
│
├── css/                               # Hojas de estilo por sección o módulo
│   ├── adm_reservas.css
│   ├── adm_salones.css
│   ├── adm_servicios.css
│   ├── adm_usuarios.css
│   ├── buscar_reserva.css
│   ├── contacto.css
│   ├── datos.css
│   ├── home_admin.css
│   ├── home_user.css
│   ├── index.css
│   ├── institucional.css
│   ├── presupuestos.css
│   ├── salones.css
│   ├── servicios.css
│   ├── template.css                   # Estilos base, colores, fuentes
│   ├── ver_reserva.css
│   ├── ver_salon.css
│   └── ver_servicio.css
│
├── js/                                # Archivos JavaScript
│   ├── adm_reservas.js
│   ├── adm_salones_filtrados.js
│   ├── adm_salones.js
│   ├── adm_servicios_filtrados.js
│   ├── adm_servicios.js
│   ├── adm_usuarios.js
│   ├── buscar_reserva.js
│   ├── contacto.js
│   ├── datos.js
│   ├── filtrar_salones.js
│   ├── filtrar_servicios.js
│   ├── gestordedatos.js              
│   ├── home_user.js
│   ├── institucional.js
│   ├── login.js
│   ├── presupuesto.js
│   ├── reservas.js
│   ├── salones.js
│   ├── servicios.js
│   ├── tarjetasdinamicas.js         
│   ├── templates.js                  # Header/Footer
│   ├── ver_reserva.js
│   ├── ver_salones_filtrados.js
│   ├── ver_salones.js
│   ├── ver_servicio.js
│   └── ver_servicios_filtrados.js
│
├── contacto.html
├── datos.html
├── index.html
├── institucional.html
└── README.md


