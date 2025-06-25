document.addEventListener('DOMContentLoaded', function () {
    fetch('assets/data/institucional.json')
        .then(res => res.json())
        .then(data => {
            renderNosotros(data.nosotros);
            renderHistoria(data.historia);
            renderOfrecemos(data.ofrecemos);
            renderPilares(data.pilares);

            setupAccordion(); 
        });

    function renderNosotros({ intro }) {
        const seccion = document.getElementById("nosotros-intro");
        if (!seccion) return;

        intro.forEach((texto, index) => {
            const p = document.createElement("p");
            p.className = index === 0 ? "lead col-lg-8 mx-auto" : "col-lg-8 mx-auto";
            p.textContent = texto;
            seccion.appendChild(p);
        });
    }

    function renderHistoria(historia) {
        const container = document.querySelector("#accordionHistoriaPkekes");
        if (!container) return;

        container.innerHTML = "";

        historia.forEach((item, i) => {
            const id = `historia${i}`;
            container.innerHTML += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${id}">
                        <button class="accordion-button ${i !== 0 ? 'collapsed' : ''}" type="button"
                            data-bs-toggle="collapse" data-bs-target="#collapse${id}"
                            aria-expanded="${i === 0}" aria-controls="collapse${id}">
                            <strong>${item.anio}:</strong> ${item.titulo}
                        </button>
                    </h2>
                    <div id="collapse${id}" class="accordion-collapse collapse ${i === 0 ? 'show' : ''}"
                        aria-labelledby="heading${id}" data-bs-parent="#accordionHistoriaPkekes">
                        <div class="accordion-body">${item.descripcion}</div>
                    </div>
                </div>`;
        });
    }

    function renderOfrecemos(lista) {
        const ul = document.querySelector('.lista-ofrecemos-bs');
        if (!ul) return;

        ul.innerHTML = "";

        lista.forEach(item => {
            ul.innerHTML += `
                <li class="mb-3 d-flex align-items-start">
                    <i class="fas ${item.icono} text-${item.color} fa-fw me-2 mt-1"></i>
                    <div><strong>${item.titulo}:</strong> ${item.detalle}</div>
                </li>`;
        });
    }

    function renderPilares(pilares) {
        const ul = document.querySelector("#que-ofrecemos .list-group");
        if (!ul) return;

        ul.innerHTML = pilares.map((p, i) => `
            <li class="list-group-item ${i === 1 ? 'list-group-item-primary' : i === 2 ? 'list-group-item-success' : ''}">
                ${p}
            </li>`).join('');
    }

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-fade-in-up');
        elements.forEach(el => {
            const elementPosition = el.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;

            if (elementPosition < screenPosition) {
                el.classList.add('animate-fade-in-up-active');
            }
        });
    };

    const setupAccordion = () => {
        const accordionItems = document.querySelectorAll('#accordionHistoriaPkekes .accordion-item');

        accordionItems.forEach(item => {
            const button = item.querySelector('.accordion-button');

            button.addEventListener('click', () => {
                item.classList.toggle('active-history-item');

                if (button.getAttribute('aria-expanded') === 'true') {
                    accordionItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active-history-item');
                        }
                    });
                }
            });
        });
    };

    const setupFeatureList = () => {
        const listItems = document.querySelectorAll('.lista-ofrecemos-bs li');

        listItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('i');
                icon.style.transform = 'scale(1.2)';
            });

            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('i');
                icon.style.transform = 'scale(1)';
            });
        });
    };

    const setupSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
    setupFeatureList();
    setupSmoothScroll();

    const title = document.querySelector('#nosotros-intro h1');
    if (title) {
        title.addEventListener('mouseover', () => {
            title.style.transform = 'rotate(-2deg)';
        });
        title.addEventListener('mouseout', () => {
            title.style.transform = 'rotate(0)';
        });
    }
});
