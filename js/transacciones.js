document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.nav-link');
    const message = document.querySelector('.message');

    // Cargar usuario y mostrar su información
    const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
    if (usuario.nombre && usuario.saldo !== undefined) {
        document.getElementById('nombreUsuario').textContent = usuario.nombre;
        document.getElementById('cuentaUsuario').textContent = usuario.cuenta;
    }

    // Asegurarse de que ninguna pestaña esté activa al cargar la página
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault(); // Evitar que se siga el enlace
            message.style.display = 'none'; // Ocultar el mensaje

            // Obtener el contenido asociado al enlace clicado
            const targetId = tab.getAttribute('href');
            const targetContent = document.querySelector(targetId);

            // Mostrar el contenido correspondiente
            targetContent.classList.add('show', 'active');

            // Ocultar los demás contenidos
            const otherContents = document.querySelectorAll('.tab-pane:not(' + targetId + ')');
            otherContents.forEach(content => {
                content.classList.remove('show', 'active');
            });

            // Marcar la pestaña como activa
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    const montoRetiroSelect = document.getElementById('montoRetiro');
    const otroMontoInput = document.querySelector('.otro-monto');

    montoRetiroSelect.addEventListener('change', () => {
        if (montoRetiroSelect.value === 'otro') {
            otroMontoInput.style.display = 'block';
        } else {
            otroMontoInput.style.display = 'none';
        }
    });

    // Vincular el evento submit del formulario de depósitos
    const depositoForm = document.getElementById('depositoForm');
    depositoForm.addEventListener('submit', ingresarDeposito);

    // Vincular el evento submit del formulario de retiros
    const retiroForm = document.getElementById('retiroForm');
    retiroForm.addEventListener('submit', ingresarRetiro);

    // Vincular el evento submit del formulario de pago de servicios
    const pagoServiciosForm = document.getElementById('pagoServiciosForm');
    pagoServiciosForm.addEventListener('submit', realizarPagoServicio);

    mostrarSaldo();
});

const constraints = {
    depCantidadDeposito: {
        presence: { allowEmpty: false, message: "^La cantidad a depositar es requerida" },
        numericality: {
            greaterThan: 0,
            lessThanOrEqualTo: 5000,
            message: "^La cantidad debe ser un número mayor a cero y no más de 5000 Pokédólares"
        }
    },
    depCuentaDestino: {
        presence: { allowEmpty: false, message: "^La cuenta destino es requerida" },
        format: {
            pattern: /^\d{10}$/,
            message: "^Ingrese una cuenta válida, solo 10 números"
        }
    }
};

const retiroConstraints = {
    montoRetiro: {
        presence: { allowEmpty: false, message: "^Debe seleccionar un monto de retiro" },
        numericality: {
            greaterThan: 0,
            lessThanOrEqualTo: 500,
            message: "^El monto debe ser mayor a cero y no más de 500 Pokédólares"
        }
    },
    motivoRetiro: {
        presence: { allowEmpty: false, message: "^El motivo de retiro es requerido" }
    }
};

const pagoConstraints = {
    tipoServicio: {
        presence: { allowEmpty: false, message: "^Debe seleccionar un tipo de servicio" }
    },
    psMontoPago: {
        presence: { allowEmpty: false, message: "^Debe ingresar un monto" },
        numericality: {
            greaterThan: 0,
            message: "^El monto debe ser mayor a cero"
        }
    },
    psNumeroCuenta: {
        presence: { allowEmpty: false, message: "^Debe ingresar un número de cuenta o NPE" },
        format: {
            pattern: /^\d+$/,
            message: "^El número de cuenta debe contener solo números"
        }
    }
};


//Funciones para realizar deposito.
function ingresarDeposito(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores del formulario
    const depositoData = {
        depCantidadDeposito: document.getElementById('depCantidadDeposito').value,
        depCuentaDestino: document.getElementById('depCuentaDestino').value,
        depDescripcionDeposito: document.getElementById('depDescripcionDeposito').value
    };

    // Validar los datos del formulario
    const errors = validate(depositoData, constraints);

    // Si hay errores, mostrar mensajes de error
    if (errors) {
        let errorMessages = '';
        for (let key in errors) {
            if (errors.hasOwnProperty(key)) {
                errorMessages += errors[key] + '\n';
            }
        }
        swal("Errores de validación", errorMessages, "error");
    } else {
        const transaccion = {
            monto: depositoData.depCantidadDeposito,
            cuentaDestino: depositoData.depCuentaDestino,
            descripcion: depositoData.depDescripcionDeposito || '',
            tipo: 'deposito',
        };
        // Si no hay errores, guardamos la transacción y mostramos el mensaje de éxito
        guardarTransaccion(transaccion);
        actualizarSaldo(transaccion.monto, 'deposito', transaccion.cuentaDestino);
        //swal("Éxito", "Depósito realizado correctamente", "success");
        // Limpiamos el formulario
        document.querySelector('#pills-depositos form').reset();
    }
}

//Realizar retiro

function ingresarRetiro(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores del formulario
    let montoRetiro = document.getElementById('montoRetiro').value;
    if (montoRetiro === 'otro') {
        montoRetiro = document.getElementById('otroMontoRetiro').value;
    }
    const retiroData = {
        montoRetiro: montoRetiro,
        motivoRetiro: document.getElementById('motivoRetiro').value
    };

    // Validar los datos del formulario
    const errors = validate(retiroData, retiroConstraints);

    // Si hay errores, mostrar mensajes de error
    if (errors) {
        let errorMessages = '';
        for (let key in errors) {
            if (errors.hasOwnProperty(key)) {
                errorMessages += errors[key] + '\n';
            }
        }
        swal("Errores de validación", errorMessages, "error");
    } else {
        // Si no hay errores, guardar la transacción y mostrar mensaje de éxito
        const transaccion = {
            monto: retiroData.montoRetiro,
            descripcion: retiroData.motivoRetiro,
            tipo: 'retiro',
        };
        guardarTransaccion(transaccion);
        actualizarSaldo(transaccion.monto, 'retiro');
        //swal("Éxito", "Retiro realizado correctamente", "success");
        // Limpiar el formulario
        document.querySelector('#pills-retiros form').reset();
        mostrarOtroMonto(); // Resetear la visualización del campo "Otro"
    }
}

function realizarPagoServicio(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores del formulario
    const pagoData = {
        tipoServicio: document.getElementById('tipoServicio').value,
        psMontoPago: document.getElementById('psMontoPago').value,
        psNumeroCuenta: document.getElementById('psNumeroCuenta').value
    };

    // Validar los datos del formulario
    const errors = validate(pagoData, pagoConstraints);

    // Si hay errores, mostrar mensajes de error
    if (errors) {
        let errorMessages = '';
        for (let key in errors) {
            if (errors.hasOwnProperty(key)) {
                errorMessages += errors[key] + '\n';
            }
        }
        swal("Errores de validación", errorMessages, "error");
    } else {
        const transaccion = {
            monto: pagoData.psMontoPago,
            cuentaDestino: pagoData.psNumeroCuenta,
            descripcion: pagoData.tipoServicio,
            tipo: 'pago',
        };
        // Si no hay errores, guardar la transacción y mostrar mensaje de éxito
        guardarTransaccion(transaccion);
        actualizarSaldo(transaccion.monto, 'pago');
        //swal("Éxito", "Pago realizado correctamente", "success");
        // Limpiar el formulario
        document.querySelector('#pills-pagos form').reset();
    }
}

function guardarTransaccion(transaccion) {
    let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    transacciones.push(transaccion);
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
}

// Función para mostrar el saldo en la sección de consulta de saldo
function mostrarSaldo() {
    const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
    if (usuario.saldo !== undefined) {
        document.getElementById('saldoUsuario').textContent = usuario.saldo.toLocaleString();
    }
}

// Función para actualizar el saldo del usuario en el local storage
function actualizarSaldo(monto, tipo, cuentaDestino = '') {
    let usuario = JSON.parse(localStorage.getItem('usuario')) || {};

    if (tipo === 'deposito' && cuentaDestino === '0987654321') {
        usuario.saldo += parseFloat(monto);
        swal("Éxito", `Se ha abonado ${monto} Pokédólares a tu cuenta.`, "success");
    } else if (tipo === 'retiro' || (tipo === 'deposito' && cuentaDestino !== '0987654321') || tipo === 'pago') {
        usuario.saldo -= parseFloat(monto);
        let mensaje = `Se ha realizado una transacción de ${monto} Pokédólares.`;
        if (tipo === 'deposito') {
            mensaje = `Se ha hecho una transferencia de ${monto} Pokédólares a la cuenta ${cuentaDestino}.`;
        } else if (tipo === 'pago') {
            mensaje = `Se ha realizado un pago de ${monto} Pokédólares.`;
        }
        swal("Éxito", mensaje, "success");
    }

    localStorage.setItem('usuario', JSON.stringify(usuario));
    mostrarSaldo();
}