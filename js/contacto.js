document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('.needs-validation');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      message: form.message.value.trim()
    };
    localStorage.setItem('contacto', JSON.stringify(data));
    alert('Gracias por contactarnos. Serás redirigido a la página de datos.');
    window.location.href = 'datos.html';
  });

  form.querySelector('button[type="reset"]').addEventListener('click', () => {
    form.classList.remove('was-validated');
  });

  form.addEventListener('input', () => {
    if (form.classList.contains('was-validated')) {
      form.classList.remove('was-validated');
    }
  });
});
