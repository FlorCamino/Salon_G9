document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("tbody-usuarios");
  const paginacion = document.getElementById("paginacionUsuarios");
  const usuariosPorPagina = 10;
  let usuarios = [];

  try {
    const response = await fetch("https://dummyjson.com/users");
    const data = await response.json();
    usuarios = data.users || [];
    renderizarPagina(1);
    renderizarPaginacion();
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar los usuarios.</td></tr>`;
  }

  function renderizarPagina(pagina) {
    tbody.innerHTML = "";
    const inicio = (pagina - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;
    const usuariosPagina = usuarios.slice(inicio, fin);

    usuariosPagina.forEach(user => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td class="align-middle" data-label="Nombre">${user.firstName} ${user.lastName}</td>
        <td class="align-middle" data-label="Usuario">${user.username}</td>
        <td class="align-middle" data-label="Email">${user.email}</td>
        <td class="align-middle" data-label="Género">${user.gender}</td>
        <td class="align-middle" data-label="Edad">${user.role}</td>
        <td class="align-middle" data-label="Imagen">
          <img src="${user.image}" alt="${user.username}" width="40" class="rounded-circle">
        </td>
      `;
      tbody.appendChild(fila);
    });
  }

  function renderizarPaginacion() {
    const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);
    paginacion.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
      const li = document.createElement("li");
      li.className = "page-item";
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;

      li.addEventListener("click", (e) => {
        e.preventDefault();
        renderizarPagina(i);
        document.querySelectorAll("#paginacionUsuarios .page-item").forEach(p => p.classList.remove("active"));
        li.classList.add("active");
      });

      if (i === 1) li.classList.add("active");
      paginacion.appendChild(li);
    }
  }
});
