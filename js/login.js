document.addEventListener("DOMContentLoaded", function () {
  //Variables para guardar los valores ingresados
  const usuarioInput = document.getElementById("usuarioInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");
  const errorMessage = document.getElementById("errorMessage");
  const errorMessageUsuario = document.getElementById("errorMessageUsuario");
  errorMessage.innerHTML = "";
  errorMessageUsuario.innerHTML = "";
  usuarioInput.parentElement.removeAttribute("id");
  passwordInput.parentElement.removeAttribute("id");

  // Definir las restricciones de validación
  const constraints = {
    contraseña: {
      presence: {
        allowEmpty: false,
        message: "no puede estar vacío",
      },
      length: {
        is: 4,
        message: " debe tener exactamente 4 dígitos",
      },
      format: {
        pattern: "[0-9]+",
        message: " solo puede contener números",
      },
    },
    usuario: {
      presence: {
        allowEmpty: false,
        message: "no puede estar vacío",
      },
    },
  };

  //Boton para poder ingresar
  loginButton.addEventListener("click", function (event) {
    // Evita el envío del formulario y la recarga de la página
    event.preventDefault();
    errorMessage.innerHTML = "";
    errorMessageUsuario.innerHTML = "";
    usuarioInput.parentElement.removeAttribute("id");
    passwordInput.parentElement.removeAttribute("id");
    // Recoger los valores del formulario
    const formData = {
      usuario: usuarioInput.value.trim(),
      contraseña: passwordInput.value,
    };

    // Validar el formulario
    const errors = validate(formData, constraints);

    if (errors) {
      if (errors.usuario) {
        errorMessageUsuario.innerHTML = errors.usuario.join(",  ");
        usuarioInput.parentElement.setAttribute("id", "usuario-error");
      } else {
        errorMessageUsuario.innerHTML = "";
      }

      if (errors.contraseña) {
        errorMessage.innerHTML = errors.contraseña.join(",  ");
        passwordInput.parentElement.setAttribute("id", "password-error");
      } else {
        errorMessage.innerHTML = "";
      }
    } else {
      const usuario = usuarioInput.value.trim();
      const contraseña = passwordInput.value.trim();

      if (usuario === "admin" && contraseña === "1234") {
        // Datos del usuario
        const user = {
          name: "Ash Ketchum",
          account: "0987654321",
          balance: 500.0,
        };
        // Almacenar datos en LocalStorage
        //se coniverte el objeto a string
        localStorage.setItem("user", JSON.stringify(user));
        // Redirigir a la página de transacciones
        window.location.href = "transacciones.html";
      } else {
        swal({
          icon: "error",
          title: "Error",
          text: "Usuario o PIN incorrecto.",
        });
      }
    }
  });

  //Boton para abrir ventana de registro
  registerButton.addEventListener("click", function (event) {
    event.preventDefault();

    // Redirigir a usuarios.html
    window.location.href = "usuarios.html";
  });
});
