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

        if (
          ruta.includes("header.html") ||
          ruta.includes("header_admin.html") ||
          ruta.includes("header_index.html")
        ) {
          const offcanvasList = document.querySelectorAll(".offcanvas");
          offcanvasList.forEach(offcanvasEl => {
            new bootstrap.Offcanvas(offcanvasEl);
          });

          const niveles = location.pathname.split("/").filter(Boolean).length;
          const subir = "../".repeat(niveles - 1);
          const logoutBtns = contenedor.querySelectorAll(".logoutBtn");

          logoutBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              sessionStorage.clear();
              window.location.href = `${subir}index.html`;
            });
          });
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
  if (esPaginaAdmin && sessionStorage.getItem("usuarioLogueado") !== "true") {
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

  if (!localStorage.getItem("cacheWarningShown")) {
      const modal = new bootstrap.Modal(document.getElementById("modalCacheWarning"));
      modal.show();

      const modalEl = document.getElementById("modalCacheWarning");
      modalEl.addEventListener("hidden.bs.modal", () => {
        localStorage.setItem("cacheWarningShown", "true");
      });
    }
});
