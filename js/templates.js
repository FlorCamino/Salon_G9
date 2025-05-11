document.addEventListener("DOMContentLoaded", function () {
  const path = location.pathname;
  const nivelActual = path.split("/").filter(Boolean).length;
  const baseRuta = nivelActual <= 1 ? "componentes/" : "../componentes/";

  const isAdmin = path.includes("/administradores/") || path.includes("adm_");
  const isIndex = path.endsWith("/index.html") || path === "/" || path.endsWith("\\index.html");

  const headerPath = isAdmin
    ? `${baseRuta}header_admin.html`
    : (isIndex ? `${baseRuta}header_index.html` : `${baseRuta}header.html`);

  const footerPath = `${baseRuta}footer.html`;

  incluirComponente(headerPath, "header-placeholder");
  incluirComponente(footerPath, "footer-placeholder");
});

function incluirComponente(ruta, idContenedor) {
  fetch(ruta)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return response.text();
    })
    .then(data => {
      const contenedor = document.getElementById(idContenedor);
      if (contenedor) contenedor.innerHTML = data;
    })
    .catch(error => console.error(`Error al cargar ${ruta}:`, error));
}


  document.addEventListener("DOMContentLoaded", () => {
    const h1 = document.querySelector(".bienvenida-overlay h1");
    const p = document.querySelector(".bienvenida-overlay p");
    if (h1) h1.textContent = "¡Estás en P’KES!";
    if (p) p.textContent = "Elegí cómo querés empezar 🎈";

    const confirmAdmin = document.getElementById("confirmAdmin");
    const passwordInput = document.getElementById("adminPassword");
    const errorBox = document.getElementById("adminError");

    confirmAdmin.addEventListener("click", () => {
      const pass = passwordInput.value.trim();
      if (pass === "admin123") {
        window.location.href = "administradores/home_admin.html";
      } else {
        errorBox.classList.remove("d-none");
      }
    });

    const modalElement = document.getElementById('adminModal');
    modalElement.addEventListener('hidden.bs.modal', () => {
      passwordInput.value = "";
      errorBox.classList.add("d-none");
    });
  });
