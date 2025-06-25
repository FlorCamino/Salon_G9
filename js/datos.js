document.addEventListener('DOMContentLoaded', () => {
  const dataList = document.getElementById('data-list');
  const volverBtn = document.getElementById('volver');
  const borrarBtn = document.getElementById('borrar');

  
  const data = JSON.parse(localStorage.getItem('contacto'));

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      const item = document.createElement('li');
      item.className = 'list-group-item';
      
      let label = '';
      switch (key) {
        case 'name': label = 'Nombre completo'; break;
        case 'email': label = 'Correo electrónico'; break;
        case 'phone': label = 'Teléfono'; break;
        case 'address': label = 'Dirección'; break;
        case 'message': label = 'Motivo / Consulta'; break;
        default: label = key;
      }
      item.innerHTML = `<strong>${label}:</strong> ${value}`;
      dataList.appendChild(item);
    }
  } else {
    dataList.innerHTML = '<li class="list-group-item text-danger">No se encontraron datos guardados.</li>';
  }

  volverBtn.addEventListener('click', () => {
    window.location.href = 'contacto.html';
  });

  borrarBtn.addEventListener('click', () => {
    localStorage.removeItem('contacto');
    dataList.innerHTML = '<li class="list-group-item text-danger">Datos borrados.</li>';
  });
});