document.addEventListener('DOMContentLoaded', function () {
    /**Variables para guardar los valores ingresados */
    const loginForm = document.getElementById('loginForm');
    const usuarioInput = document.getElementById('usuarioInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');

    /**Boton para poder ingresar */
    loginButton.addEventListener('click', function (event) {
        event.preventDefault();

        const usuario = usuarioInput.value.trim();
        const password = passwordInput.value.trim();

        /**Validacion para ver que los campos no esten vacios */
        if (usuario === '' || password === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, ingrese su usuario y PIN.',
            });
        } else if (usuario === 'admin' && password === '1234') {
            // Redirigir a panel.html
            window.location.href = 'transacciones.html';
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Usuario o PIN incorrecto.',
            });
        }
    });

    /**Boton para abrir ventana de registro */
    registerButton.addEventListener('click', function (event) {
        event.preventDefault(); 

        // Redirigir a usuarios.html
        window.location.href = 'usuarios.html';
    });
});
