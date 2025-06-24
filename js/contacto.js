document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.needs-validation');

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
    } else {
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
    }
  });

  form.querySelector('button[type="reset"]').addEventListener('click', () => {
    form.classList.remove('was-validated');
    form.querySelectorAll('.is-valid, .is-invalid').forEach(input => {
      input.classList.remove('is-valid', 'is-invalid');
    });
  });

  form.addEventListener('input', e => {
    const target = e.target;
    if (target.checkValidity()) {
      target.classList.remove('is-invalid');
      target.classList.add('is-valid');
    } else {
      target.classList.remove('is-valid');
      if (form.classList.contains('was-validated')) {
        target.classList.add('is-invalid');
      } else {
        target.classList.remove('is-invalid');
      }
    }
  });
});



