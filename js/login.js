document.addEventListener("DOMContentLoaded", () => {
  const userUsernameInput = document.getElementById("userUsername");
  const userPasswordInput = document.getElementById("userPassword");
  const confirmUserBtn = document.getElementById("confirmUser");
  const userError = document.getElementById("userError");


  document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = toggle.closest(".input-group").querySelector("input");
      const icon = toggle.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye-slash", "fa-eye");
      } else {
        input.type = "password";
        icon.classList.replace("fa-eye", "fa-eye-slash");
      }
    });
  });

  function validarInputs() {
    const usuarioValido = userUsernameInput.value.trim();
    const passValido = userPasswordInput.value.trim();
    confirmUserBtn.disabled = !(usuarioValido && passValido);
  }

  userUsernameInput.addEventListener("input", validarInputs);
  userPasswordInput.addEventListener("input", validarInputs);

  confirmUserBtn.addEventListener("click", async () => {
    const username = userUsernameInput.value.trim();
    const password = userPasswordInput.value.trim();

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Respuesta:", data);

      if (response.ok && data.accessToken) {
        sessionStorage.setItem("usuarioLogueado", "true");
        sessionStorage.setItem("usuarioData", JSON.stringify(data));
        window.location.href = "usuarios/home_user.html";
      } else {
        mostrarError("Usuario o contraseña incorrectos");
      }

    } catch (error) {
      console.error("Error en login:", error);
      mostrarError("No se pudo conectar al servidor");
    }
  });

  function mostrarError(mensaje) {
    userError.textContent = mensaje;
    userError.classList.remove("d-none");
  }

  userUsernameInput.addEventListener("input", () => userError.classList.add("d-none"));
  userPasswordInput.addEventListener("input", () => userError.classList.add("d-none"));
});
