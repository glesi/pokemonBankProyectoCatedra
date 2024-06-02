document.addEventListener('DOMContentLoaded', function() {
    // Obtener el contexto del gráfico semanal
    var ctxSemanal = document.getElementById('grafico-semanal').getContext('2d');

    // Datos inventados para las transacciones de la semana actual
    var datosSemanales = {
        depositos: [500, 700, 600, 800, 900, 1000, 1200],
        retiros: [200, 400, 300, 200, 100, 200, 300],
        pagos: [300, 200, 400, 500, 600, 700, 800]
    };

    // Configurar los datos para el gráfico semanal
    var dataSemanal = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], // Supongamos que la semana comienza en lunes
        datasets: [{
            label: 'Depósitos',
            data: datosSemanales.depositos,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }, {
            label: 'Retiros',
            data: datosSemanales.retiros,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }, {
            label: 'Pagos',
            data: datosSemanales.pagos,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    // Configuración del gráfico
    var options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Crear el gráfico semanal
    var chartSemanal = new Chart(ctxSemanal, {
        type: 'bar',
        data: dataSemanal,
        options: options
    });

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
