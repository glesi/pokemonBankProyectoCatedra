document.addEventListener('DOMContentLoaded', function () {
    // Función para mostrar los datos del usuario
    function mostrarDatosUsuario() {
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};
        if (usuarioLogueado && usuarioLogueado.usuario && usuarioLogueado.numeroCuenta) {
            document.getElementById('nombreUsuario').textContent = usuarioLogueado.usuario;
            document.getElementById('cuentaUsuario').textContent = usuarioLogueado.numeroCuenta;
        } else {
            document.getElementById('nombreUsuario').textContent = "Nombre de Usuario por Defecto";
            document.getElementById('cuentaUsuario').textContent = "Número de Cuenta por Defecto";
        }
    }

    function mostrarTransaccionesUsuario() {
        const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};
        const transaccionesUsuario = transacciones.filter(transaccion => transaccion.numeroCuenta === usuarioLogueado.numeroCuenta);
        mostrarTransacciones(transaccionesUsuario.filter(transaccion => transaccion.tipo === 'deposito'), 'tabla-depositos');
        mostrarTransacciones(transaccionesUsuario.filter(transaccion => transaccion.tipo === 'retiro'), 'tabla-retiros');
        mostrarTransacciones(transaccionesUsuario.filter(transaccion => transaccion.tipo === 'pago'), 'tabla-pagos');
        mostrarTransacciones(transaccionesUsuario, 'tabla-informe');
    }

    function mostrarTransacciones(transacciones, tablaId) {
        const tbody = document.querySelector(`#${tablaId} tbody`);
        tbody.innerHTML = '';
        transacciones.forEach(transaccion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaccion.fecha}</td>
                <td>${transaccion.tipo}</td>
                <td>$${transaccion.monto.toFixed(2)}</td>
                <td>${transaccion.descripcion}</td>
            `;
            tbody.appendChild(row);
        });
    }

    function guardarTransaccion(transaccion) {
        const fechaActual = new Date().toLocaleDateString();
        transaccion.fecha = fechaActual;
        let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
        transacciones.push(transaccion);
        localStorage.setItem('transacciones', JSON.stringify(transacciones));
    }

    mostrarDatosUsuario();
    mostrarTransaccionesUsuario();
    
    var content = document.getElementById('pills-tabContent'),
        pdfout = document.getElementById('pdfout');
    
    pdfout.onclick = function() {
        var jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF('p', 'pt', 'letter');
        var margin = 20;
        var scale = (doc.internal.pageSize.width - margin * 2) / document.body.clientWidth;
        var scale_mobile = (doc.internal.pageSize.width - margin * 2) / document.body.getBoundingClientRect();

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            doc.html(content, {
                x: margin,
                y: margin,
                html2canvas: {
                    scale: scale_mobile,
                },
                callback: function(doc) {
                    doc.output('dataurlnewwindow', { filename: 'pdf.pdf' });
                }
            });
        } else {
            doc.html(content, {
                x: margin,
                y: margin,
                html2canvas: {
                    scale: scale,
                },
                callback: function(doc) {
                    doc.output('dataurlnewwindow', { filename: 'pdf.pdf' });
                }
            });
        }
    };
});
