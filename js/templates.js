function incluirComponente(ruta, idContenedor) {
  fetch(ruta)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return response.text();
    })
    .then(data => {
      const contenedor = document.getElementById(idContenedor);
      if (contenedor) {
        contenedor.innerHTML = data;

        if (ruta.includes("header_admin.html") || ruta.includes("header.html")) {
          const niveles = location.pathname.split("/").filter(Boolean).length;
          const subir = "../".repeat(niveles - 1);

          const logoutBtn = contenedor.querySelector("#logoutBtn");
          if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
              e.preventDefault();
              sessionStorage.removeItem("adminLogueado");
              window.location.href = `${subir}index.html`;
            });
          }
        }
      }
    })
    .catch(error => console.error(`Error al cargar ${ruta}:`, error));
}


document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname;
  const nivelActual = path.split("/").filter(Boolean).length;
  const baseRuta = nivelActual <= 1 ? "componentes/" : "../componentes/";

  const isAdmin = path.includes("/administradores/");
  const isIndex = path.endsWith("/index.html") || path === "/" || path.endsWith("\\index.html");

  const headerPath = isAdmin
    ? `${baseRuta}header_admin.html`
    : (isIndex ? `${baseRuta}header_index.html` : `${baseRuta}header.html`);
  const footerPath = `${baseRuta}footer.html`;

  incluirComponente(headerPath, "header-placeholder");
  if (!isIndex) {
    incluirComponente(footerPath, "footer-placeholder");
  }


  const esPaginaAdmin = path.includes("adm_") || path.includes("home_admin") || path.includes("/administradores/");
  if (esPaginaAdmin && sessionStorage.getItem("adminLogueado") !== "true") {
    const niveles = path.split("/").filter(Boolean).length;
    const redirectPath = niveles >= 2 ? "../../index.html" : "../index.html";
    window.location.href = redirectPath;
  }

  const esPaginaUsuario = path.includes("/usuarios/") || path.includes("home_user");
  if (esPaginaUsuario && sessionStorage.getItem("usuarioLogueado") !== "true") {
    const niveles = path.split("/").filter(Boolean).length;
    const redirectPath = niveles >= 2 ? "../../index.html" : "../index.html";
    window.location.href = redirectPath;
  }

  // ---- Administrador ----
  const adminPasswordInput = document.getElementById("adminPassword");
  const confirmAdminBtn = document.getElementById("confirmAdmin");
  const adminError = document.getElementById("adminError");
  const toggleAdminPassword = document.querySelector("#adminModal .toggle-password");

  adminPasswordInput?.addEventListener("input", () => {
    confirmAdminBtn.disabled = adminPasswordInput.value.trim() === "";
    adminError.classList.add("d-none");
  });

  toggleAdminPassword?.addEventListener("click", () => {
    const icon = toggleAdminPassword.querySelector("i");
    if (adminPasswordInput.type === "password") {
      adminPasswordInput.type = "text";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    } else {
      adminPasswordInput.type = "password";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    }
  });

  confirmAdminBtn?.addEventListener("click", () => {
    if (adminPasswordInput.value.trim() === "admin123") {
      sessionStorage.setItem("adminLogueado", "true");
      const modal = bootstrap.Modal.getInstance(document.getElementById("adminModal"));
      modal.hide();
      adminPasswordInput.value = "";
      confirmAdminBtn.disabled = true;
      window.location.href = "administradores/home_admin.html";
    } else {
      adminError.classList.remove("d-none");
    }
  });

  document.getElementById("adminModal")?.addEventListener("hidden.bs.modal", () => {
    adminPasswordInput.value = "";
    confirmAdminBtn.disabled = true;
    adminError.classList.add("d-none");
  });
});

