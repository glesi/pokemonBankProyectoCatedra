document.addEventListener('DOMContentLoaded', function () {
    // Capturar elementos del formulario
    const form = document.getElementById('registroForm');

    // Agregar evento de envío del formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar envío del formulario por defecto

        // Obtener los valores de los campos del formulario
        const usuarioValue = document.getElementById('usuario').value.trim();
        const numeroCuentaValue = document.getElementById('numeroCuenta').value.trim();
        const emailValue = document.getElementById('email').value.trim();
        const contrasenaValue = document.getElementById('contrasena').value.trim();
        const confirmarContrasenaValue = document.getElementById('confirmarContrasena').value.trim();

        // Validar que todos los campos estén llenos
        if (usuarioValue === '' || numeroCuentaValue === '' || emailValue === '' || contrasenaValue === '' || confirmarContrasenaValue === '') {
            // Mostrar mensaje de error con SweetAlert
            swal("Oops...", "Por favor, completa todos los campos.", "error");
            return; // Detener el proceso si hay campos vacíos
        }

        // Validar si el número de cuenta ya existe
        if (numeroCuentaYaExiste(numeroCuentaValue)) {
            // Mostrar mensaje de error con SweetAlert
            swal("Oops...", "El número de cuenta ya está registrado.", "error");
            return; // Detener el proceso si el número de cuenta ya existe
        }

        // Definir las reglas de validación
        const constraints = {
            usuario: {
                presence: { message: "Debe ingresar un usuario" },
                length: {
                    minimum: 3,
                    message: "Debe tener al menos 3 caracteres"
                }
            },
            numeroCuenta: {
                presence: { message: "Debe ingresar un número de cuenta" },
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0,
                    message: "Debe ser un número entero mayor que 0"
                }
            },
            email: {
                presence: { message: "Debe ingresar un correo electrónico" },
                email: { message: "Debe ser una dirección de correo electrónico válida" }
            },
            contrasena: {
                presence: { message: "Debe ingresar una contraseña" },
                length: {
                    minimum: 6,
                    message: "Debe tener al menos 6 caracteres"
                }
            },
            confirmarContrasena: {
                presence: { message: "Debe confirmar la contraseña" },
                equality: {
                    attribute: "contrasena",
                    message: "^Las contraseñas no coinciden"
                }
            }
        };

        // Crear un objeto con los valores de los campos
        const formValues = {
            usuario: usuarioValue,
            numeroCuenta: numeroCuentaValue,
            email: emailValue,
            contrasena: contrasenaValue,
            confirmarContrasena: confirmarContrasenaValue
        };

        // Validar el formulario con los valores y las reglas de validación
        const errors = validate(formValues, constraints);

        if (errors) {
            // Mostrar mensajes de error con SweetAlert
            let errorMessage = Object.values(errors).map(error => error.join('\n')).join('\n');
            swal("Oops...", errorMessage, "error");
        } else {
            // Si no hay errores, almacenar datos en localStorage
            guardarDatosUsuario(formValues);
            mostrarMensajeRegistroExitoso(usuarioValue, numeroCuentaValue);
        }
    });

    // Función para guardar los datos del usuario en localStorage
    function guardarDatosUsuario(usuario) {
        // Obtener usuarios registrados del localStorage
        let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
        // Agregar nuevo usuario al array de usuarios
        usuariosRegistrados.push(usuario);
        // Guardar el array actualizado en el localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));
    }

    // Función para verificar si el número de cuenta ya existe
    function numeroCuentaYaExiste(numeroCuenta) {
        // Obtener usuarios registrados del localStorage
        let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
        // Verificar si el número de cuenta está presente en los usuarios registrados
        return usuariosRegistrados.some(usuario => usuario.numeroCuenta === numeroCuenta);
    }

    // Función para mostrar el mensaje de registro exitoso
    function mostrarMensajeRegistroExitoso(usuario, numeroCuenta) {
        swal("Registro exitoso", `Usuario: ${usuario}\nNúmero de cuenta: ${numeroCuenta}`, "success");
        document.querySelector('.mensaje').style.display = 'block';
    }
});
