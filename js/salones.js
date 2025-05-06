document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-salones');
    const btnIzquierda = document.querySelector('.flecha.izquierda');
    const btnDerecha = document.querySelector('.flecha.derecha');
  
    if (btnIzquierda && btnDerecha && contenedor) {
      btnIzquierda.addEventListener('click', () => {
        contenedor.scrollBy({ left: -300, behavior: 'smooth' });
      });
  
      btnDerecha.addEventListener('click', () => {
        contenedor.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  });
  