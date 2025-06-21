document.addEventListener("DOMContentLoaded", () => {
  const userUsernameInput = document.getElementById("userUsername");
  const userPasswordInput = document.getElementById("userPassword");
  const confirmUserBtn = document.getElementById("confirmUser");
  const userError = document.getElementById("userError");
  const btnAutocompletar = document.getElementById("btnAutocompletar");

  
  document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = toggle.closest(".input-group").querySelector("input");
      const icon = toggle.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      }
    });
  });

  
  function validarInputs() {
    confirmUserBtn.disabled =
      !userUsernameInput.value.trim() || !userPasswordInput.value.trim();
  }

  userUsernameInput.addEventListener("input", validarInputs);
  userPasswordInput.addEventListener("input", validarInputs);

  
  if (btnAutocompletar) {
    btnAutocompletar.addEventListener("click", () => {
      userUsernameInput.value = "kminchelle";
      userPasswordInput.value = "0lelplR";
      validarInputs();
    });
  }

  
  confirmUserBtn.addEventListener("click", async () => {
    const username = userUsernameInput.value.trim();
    const password = userPasswordInput.value.trim();

    console.log("Enviando login con:", username, password);

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("usuarioLogueado", JSON.stringify(data));
        window.location.href = "usuarios/home_user.html";
      } else {
        userError.classList.remove("d-none");
      }
    } catch (error) {
      console.error("Error en login:", error);
      userError.classList.remove("d-none");
    }
  });

  userUsernameInput.addEventListener("input", () => userError.classList.add("d-none"));
  userPasswordInput.addEventListener("input", () => userError.classList.add("d-none"));
});
