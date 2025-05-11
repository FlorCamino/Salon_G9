
document.addEventListener('DOMContentLoaded', function() {

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
            anchor.addEventListener('click', function(e) {
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
    
    setupAccordion();
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