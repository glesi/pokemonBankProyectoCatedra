document.addEventListener("DOMContentLoaded", function () {
  // Variables para guardar los valores ingresados
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

  // Botón para poder ingresar
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

          // Obtener usuarios registrados del localStorage
          const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];

          // Verificar si el usuario y contraseña coinciden con alguno de los registrados
          const usuarioEncontrado = usuariosRegistrados.find(user => user.usuario === usuario && user.contrasena === contraseña);

          if (usuarioEncontrado) {
              // Almacenar datos del usuario logueado en localStorage
              localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));

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

  // Botón para abrir ventana de registro
  registerButton.addEventListener("click", function (event) {
      event.preventDefault();

      // Redirigir a usuarios.html
      window.location.href = "usuarios.html";
  });
});
