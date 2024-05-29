// Inicializar los datos del usuario
const usuario = {
    nombre: "Ash Ketchum",
    pin: "1234",
    cuenta: "0987654321",
    saldo: 500.00
};

// Guardar los datos del usuario en LocalStorage si no están ya presentes
if (!localStorage.getItem('usuario')) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

// Validaciones con Validate.js
const constraints = {
    cantidadDeposito: {
        presence: { message: "es obligatorio" },
        numericality: {
            greaterThan: 0,
            message: "debe ser un número mayor a cero"
        }
    },
    cuentaDestino: {
        presence: { message: "es obligatorio" },
        format: {
            pattern: "\\d{10}",
            message: "debe ser un número de cuenta válido de 10 dígitos"
        }
    },
    montoRetiro: {
        presence: { message: "es obligatorio" },
        numericality: {
            greaterThan: 0,
            message: "debe ser un número mayor a cero"
        }
    },
    montoPago: {
        presence: { message: "es obligatorio" },
        numericality: {
            greaterThan: 0,
            message: "debe ser un número mayor a cero"
        }
    },
    numeroCuenta: {
        presence: { message: "es obligatorio" },
        format: {
            pattern: "\\d{10}",
            message: "debe ser un número de cuenta válido de 10 dígitos"
        }
    }
};

// Función para mostrar mensajes de error con SweetAlert
const mostrarError = (errores) => {
    let mensajes = "";
    for (let campo in errores) {
        mensajes += `${errores[campo]}\n`;
    }
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensajes,
    });
};

// Función para realizar depósito
function realizarDeposito(event) {
    event.preventDefault();
    const cantidadDeposito = document.getElementById('cantidadDeposito').value;
    const cuentaDestino = document.getElementById('cuentaDestino').value;

    const errores = validate({cantidadDeposito, cuentaDestino}, {
        cantidadDeposito: constraints.cantidadDeposito,
        cuentaDestino: constraints.cuentaDestino
    });
    if (errores) {
        mostrarError(errores);
    } else {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        usuario.saldo += parseFloat(cantidadDeposito);
        localStorage.setItem('usuario', JSON.stringify(usuario));

        Swal.fire({
            icon: 'success',
            title: 'Depósito realizado',
            text: `Has depositado ${cantidadDeposito} Pokédólares en la cuenta ${cuentaDestino}`
        });
    }
}

// Función para realizar retiro
function realizarRetiro(event) {
    event.preventDefault();
    let montoRetiro = document.getElementById('montoRetiro').value;
    if (montoRetiro === "Otro") {
        montoRetiro = document.getElementById('otroMontoRetiro').value;
    }

    const errores = validate({montoRetiro}, {
        montoRetiro: constraints.montoRetiro
    });
    if (errores) {
        mostrarError(errores);
    } else {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario.saldo >= parseFloat(montoRetiro)) {
            usuario.saldo -= parseFloat(montoRetiro);
            localStorage.setItem('usuario', JSON.stringify(usuario));

            Swal.fire({
                icon: 'success',
                title: 'Retiro realizado',
                text: `Has retirado ${montoRetiro} Pokédólares`
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Saldo insuficiente',
                text: 'No tienes suficiente saldo para realizar esta transacción'
            });
        }
    }
}

// Función para realizar pago de servicios
function realizarPago(event) {
    event.preventDefault();
    const tipoServicio = document.getElementById('tipoServicio').value;
    const montoPago = document.getElementById('montoPago').value;
    const numeroCuenta = document.getElementById('numeroCuenta').value;

    const errores = validate({montoPago, numeroCuenta}, {
        montoPago: constraints.montoPago,
        numeroCuenta: constraints.numeroCuenta
    });
    if (errores) {
        mostrarError(errores);
    } else {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario.saldo >= parseFloat(montoPago)) {
            usuario.saldo -= parseFloat(montoPago);
            localStorage.setItem('usuario', JSON.stringify(usuario));

            Swal.fire({
                icon: 'success',
                title: 'Pago realizado',
                text: `Has pagado ${montoPago} Pokédólares por el servicio de ${tipoServicio}`
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Saldo insuficiente',
                text: 'No tienes suficiente saldo para realizar esta transacción'
            });
        }
    }
}

// Evento para mostrar/ocultar campo de monto personalizado en retiro
document.getElementById('montoRetiro').addEventListener('change', function () {
    if (this.value === 'Otro') {
        document.querySelector('.otro-monto').style.display = 'block';
    } else {
        document.querySelector('.otro-monto').style.display = 'none';
    }
});

// Eventos de envío de formularios
document.getElementById('formDeposito').addEventListener('submit', realizarDeposito);
document.getElementById('formRetiro').addEventListener('submit', realizarRetiro);
document.getElementById('formPago').addEventListener('submit', realizarPago);

// Función para salir del sistema
const salir = () => {
    Swal.fire({
        title: "¿Realmente desea salir del sistema?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            location.href = "login.html";
        }
    });
};
