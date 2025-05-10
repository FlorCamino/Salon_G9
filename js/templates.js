document.addEventListener("DOMContentLoaded", function () {
  const isIndex = location.pathname.endsWith("/index.html") || location.pathname === "/" || location.pathname.endsWith("\\index.html");

  const nivelActual = location.pathname.split("/").filter(Boolean).length;
  const baseRuta = nivelActual <= 1 ? "componentes/" : "../componentes/";

  const headerPath = isIndex ? `${baseRuta}header_index.html` : `${baseRuta}header.html`;
  const footerPath = `${baseRuta}footer.html`;

  incluirComponente(headerPath, "header-placeholder");
  incluirComponente(footerPath, "footer-placeholder");
});

function incluirComponente(ruta, idContenedor) {
  fetch(ruta)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      const contenedor = document.getElementById(idContenedor);
      if (contenedor) {
        contenedor.innerHTML = data;
      }
    })
    .catch(error => console.error(`Error al cargar ${ruta}:`, error));
}
