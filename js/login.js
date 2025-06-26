let modoLogin = "user"; 

document.addEventListener("DOMContentLoaded", () => {
  const userUsernameInput = document.getElementById("userUsername");
  const userPasswordInput = document.getElementById("userPassword");
  const confirmUserBtn = document.getElementById("confirmUser");
  const userError = document.getElementById("userError");

  document.getElementById("btnUser")?.addEventListener("click", () => {
    modoLogin = "user";
  });

  document.getElementById("btnAdmin")?.addEventListener("click", () => {
    modoLogin = "admin";
  });

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
      const loginResponse = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginResponse.json();
      console.log("Login OK:", loginData);

      if (!loginResponse.ok || !loginData.id) {
        mostrarError("Usuario o contraseña incorrectos");
        return;
      }

      const userId = loginData.id;
      const userResponse = await fetch(`https://dummyjson.com/users/${userId}`);
      const userData = await userResponse.json();
      console.log("Usuario obtenido:", userData);

      if (!userResponse.ok || !userData.role) {
        mostrarError("No se pudo verificar el rol del usuario.");
        return;
      }

      const rol = userData.role.toLowerCase();

      if (modoLogin === "admin" && rol !== "admin") {
        mostrarError("Permisos insuficientes para acceder como administrador");
        return;
      }

      sessionStorage.clear();
      sessionStorage.setItem("usuarioLogueado", "true");
      sessionStorage.setItem("usuarioData", JSON.stringify(userData));
      sessionStorage.setItem("accessToken", loginData.token); 

      if (modoLogin === "admin") {
        window.location.href = "administradores/home_admin.html";
      } else {
        window.location.href = "usuarios/home_user.html";
      }

    } catch (error) {
      console.error("Error en el proceso de login:", error);
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
