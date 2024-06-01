document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.nav-link');
    const message = document.querySelector('.message');

    // Función para obtener y establecer el saldo inicial
    function establecerSaldoInicial() {
        let usuario = JSON.parse(localStorage.getItem('usuario')) || {};
        if (!usuario.hasOwnProperty('saldo')) {
            usuario.saldo = 500; // Establecer saldo inicial en $500.00 si no está definido
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }
        if (!usuario.hasOwnProperty('nombre')) {
            usuario.nombre = "Nombre de Usuario por Defecto"; // Cambia esto por el nombre real del usuario
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }
        if (!usuario.hasOwnProperty('cuenta')) {
            usuario.cuenta = "Número de Cuenta por Defecto"; // Cambia esto por el número real de la cuenta
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }
    }

    // Cargar usuario y mostrar su información
    const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
    if (usuario.nombre && usuario.saldo !== undefined) {
        document.getElementById('nombreUsuario').textContent = usuario.nombre;
        document.getElementById('cuentaUsuario').textContent = usuario.cuenta;
        document.getElementById('saldoUsuario').textContent = usuario.saldo.toFixed(2); // Mostrar saldo con dos decimales
    } else {
        establecerSaldoInicial(); // Establecer saldo inicial si no se encuentra en el localStorage
    }

    // Restablecer mensaje de error
    function resetErrorMessage() {
        message.style.display = 'none';
    }

    // Manejar clic en las pestañas
    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            resetErrorMessage();
            const targetId = tab.getAttribute('href');
            const targetContent = document.querySelector(targetId);
            targetContent.classList.add('show', 'active');
            const otherContents = document.querySelectorAll('.tab-pane:not(' + targetId + ')');
            otherContents.forEach(content => {
                content.classList.remove('show', 'active');
            });
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Función para actualizar el saldo del usuario en el localStorage y mostrarlo
    function actualizarSaldo(monto, tipo, cuentaDestino = '') {
        let usuario = JSON.parse(localStorage.getItem('usuario')) || {};
        let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};
    
        const transaccion = {
            monto: monto,
            cuentaDestino: cuentaDestino,
            descripcion: tipo,
            tipo: tipo,
            numeroCuenta: usuarioLogueado.numeroCuenta, // Incluir el número de cuenta del usuario logueado
            fecha: new Date().toLocaleString() // Fecha y hora actual del sistema
        };

        if (tipo === 'retiro' || tipo === 'pago') {
            if (monto > usuario.saldo) {
                swal("Error", "Fondos insuficientes para realizar esta operación", "error");
                return; // No ejecutar la transacción si el monto es mayor al saldo
            }
        }

        if (tipo === 'deposito' && cuentaDestino === '0987654321') {
            usuario.saldo += parseFloat(monto);
            swal("Éxito", `Se ha abonado ${monto.toFixed(2)} Pokédólares a tu cuenta.`, "success");
        } else if (tipo === 'retiro' || (tipo === 'deposito' && cuentaDestino !== '0987654321') || tipo === 'pago') {
            usuario.saldo -= parseFloat(monto);
            let mensaje = `Se ha realizado una transacción de ${monto.toFixed(2)} Pokédólares.`;
            if (tipo === 'deposito') {
                mensaje = `Se ha hecho una transferencia de ${monto.toFixed(2)} Pokédólares a la cuenta ${cuentaDestino}.`;
            } else if (tipo === 'pago') {
                mensaje = `Se ha realizado un pago de ${monto.toFixed(2)} Pokédólares.`;
            }
            swal("Éxito", mensaje, "success");
        }

        // Guardar la transacción en el localStorage
        guardarTransaccion(transaccion);

        // Actualizar el saldo del usuario en el localStorage
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Mostrar el saldo actualizado
        document.getElementById('saldoUsuario').textContent = usuario.saldo.toFixed(2); // Actualizar saldo mostrado
    }


    // Manejar el evento submit del formulario de depósitos
    const depositoForm = document.getElementById('depositoForm');
    depositoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        resetErrorMessage();

        const montoDeposito = parseFloat(document.getElementById('depCantidadDeposito').value);
        const cuentaDestino = document.getElementById('depCuentaDestino').value.trim();
        const descripcion = document.getElementById('depDescripcionDeposito').value.trim();

        if (isNaN(montoDeposito) || montoDeposito <= 0 || cuentaDestino === '') {
            swal("Error", "Por favor, complete todos los campos correctamente", "error");
            return; 
        }

        const transaccion = {
            monto: montoDeposito,
            cuentaDestino: cuentaDestino,
            descripcion: descripcion,
            tipo: 'deposito',
            numeroCuenta: usuario.cuenta // Agregar el número de cuenta del usuario a la transacción
        };

        guardarTransaccion(transaccion);
        actualizarSaldo(transaccion.monto, 'deposito', transaccion.cuentaDestino);
        depositoForm.reset();
    });

    //
    // Manejar el evento submit del formulario de retiros
    const retiroForm = document.getElementById('retiroForm');
    retiroForm.addEventListener('submit', function (event) {
        event.preventDefault();
        resetErrorMessage();

        let montoRetiro = parseFloat(document.getElementById('montoRetiro').value);
        if (montoRetiro === 'otro') {
            montoRetiro = parseFloat(document.getElementById('otroMontoRetiro').value);
        }
        const motivoRetiro = document.getElementById('motivoRetiro').value.trim();

        if (isNaN(montoRetiro) || montoRetiro <= 0 || motivoRetiro === '') {
            swal("Error", "Por favor, complete todos los campos correctamente", "error");
            return;
        }

        const transaccion = {
            monto: montoRetiro,
            descripcion: motivoRetiro,
            tipo: 'retiro',
            numeroCuenta: usuario.cuenta // Agregar el número de cuenta del usuario a la transacción
        };

        guardarTransaccion(transaccion);
        actualizarSaldo(transaccion.monto, 'retiro');
        retiroForm.reset();
    });

    //
    // Manejar el evento submit del formulario de pago de servicios
    const pagoServiciosForm = document.getElementById('pagoServiciosForm');
    pagoServiciosForm.addEventListener('submit', function (event) {
        event.preventDefault();
        resetErrorMessage();

        const tipoServicio = document.getElementById('tipoServicio').value.trim();
        const montoPago = parseFloat(document.getElementById('psMontoPago').value);
        const numeroCuenta = document.getElementById('psNumeroCuenta').value.trim();

        if (tipoServicio === '' || isNaN(montoPago) || montoPago <= 0 || numeroCuenta === '') {
            swal("Error", "Por favor, complete todos los campos correctamente", "error");
            return;
        }

        const transaccion = {
            monto: montoPago,
            cuentaDestino: numeroCuenta,
            descripcion: tipoServicio,
            tipo: 'pago',
            numeroCuenta: usuario.cuenta // Agregar el número de cuenta del usuario a la transacción
        };

        guardarTransaccion(transaccion);
        actualizarSaldo(transaccion.monto, 'pago');
        pagoServiciosForm.reset();
    });

    // Función para guardar la transacción en el localStorage
    function guardarTransaccion(transaccion) {
        let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
        transaccion.fecha = new Date().toLocaleString(); // Agregar fecha y hora actual del sistema
        transacciones.push(transaccion);
        localStorage.setItem('transacciones', JSON.stringify(transacciones));
    }

    // Función para restablecer el mensaje de error
    function resetErrorMessage() {
        message.style.display = 'none';
    }

    // Función para mostrar el saldo en la sección de consulta de saldo
    function mostrarSaldo() {
        const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
        if (usuario.saldo !== undefined) {
            document.getElementById('saldoUsuario').textContent = usuario.saldo.toFixed(2);
            document.getElementById('nombreUsuario').textContent = usuario.nombre;
            document.getElementById('cuentaUsuario').textContent = usuario.cuenta;
        }
    }

    // Ejecutar función para mostrar el saldo al cargar la página
    mostrarSaldo();

    // Función para mostrar los datos del usuario
    function mostrarDatosUsuario() {
        // Obtener el usuario logueado del localStorage
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};

        // Mostrar los datos del usuario en la página
        if (usuarioLogueado && usuarioLogueado.usuario && usuarioLogueado.numeroCuenta) {
            document.getElementById('nombreUsuario').textContent = usuarioLogueado.usuario;
            document.getElementById('cuentaUsuario').textContent = usuarioLogueado.numeroCuenta;
        } else {
            // Manejar el caso en que los datos del usuario no estén disponibles
            document.getElementById('nombreUsuario').textContent = "Nombre de Usuario por Defecto";
            document.getElementById('cuentaUsuario').textContent = "Número de Cuenta por Defecto";
        }
    }

    // Ejecutar función para mostrar los datos del usuario al cargar la página
    mostrarDatosUsuario();

});
