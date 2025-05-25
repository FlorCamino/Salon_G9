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
  if (!isIndex) {
    incluirComponente(footerPath, "footer-placeholder");
  }

  if (isIndex && sessionStorage.getItem("adminLogueado") === "true") {
    window.location.href = "administradores/home_admin.html";
    return;
  }

  const h1 = document.querySelector(".bienvenida-overlay h1");
  const p = document.querySelector(".bienvenida-overlay p");
  if (h1) h1.textContent = "¡Estás en P’KES!";
  if (p) p.textContent = "Elegí cómo querés empezar 🎈";

  const confirmAdmin = document.getElementById("confirmAdmin");
  const passwordInput = document.getElementById("adminPassword");
  const errorBox = document.getElementById("adminError");

  document.addEventListener("click", (e) => {
    if (e.target.closest(".toggle-password")) {
      const input = document.getElementById("adminPassword");
      const icon = e.target.closest(".toggle-password").querySelector("i");
      const isHidden = input.getAttribute("type") === "password";
      input.setAttribute("type", isHidden ? "text" : "password");
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    }
  });

  if (passwordInput && confirmAdmin) {
    passwordInput.addEventListener("input", () => {
      confirmAdmin.disabled = passwordInput.value.trim() === "";
    });

    confirmAdmin.addEventListener("click", () => {
      const pass = passwordInput.value.trim();
      if (pass === "admin123") {
        sessionStorage.setItem("adminLogueado", "true");
        window.location.href = "administradores/home_admin.html";
      } else {
        errorBox.classList.remove("d-none");
      }
    });
  }

  const modalElement = document.getElementById("adminModal");
  if (modalElement) {
    modalElement.addEventListener("hidden.bs.modal", () => {
      if (passwordInput) passwordInput.value = "";
      if (confirmAdmin) confirmAdmin.disabled = true;
      if (errorBox) errorBox.classList.add("d-none");
    });
  }

  const esPaginaAdmin =
    path.includes("adm_") || path.includes("home_admin") || path.includes("/administradores/");

  if (esPaginaAdmin) {
    const logueado = sessionStorage.getItem("adminLogueado");
    if (logueado !== "true") {
      const niveles = path.split("/").filter(Boolean).length;
      const redirectPath = niveles >= 2 ? "../../index.html" : "../index.html";
      window.location.href = redirectPath;
    }
  }

  const headerObserver = new MutationObserver(() => {
    const logoutWrapper = document.getElementById("logoutWrapper");
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutWrapper) {
      logoutWrapper.style.display = "list-item";
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("adminLogueado");
        sessionStorage.removeItem("usuarioLogueado");

        const niveles = location.pathname.split("/").filter(Boolean).length;
        const redirectPath = niveles >= 2 ? "../../index.html" : "../index.html";
        window.location.href = redirectPath;
      });
      headerObserver.disconnect();
    }
  });

  headerObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
});
