
document.addEventListener('DOMContentLoaded', function () {
    // Función para mostrar los datos del usuario
    function mostrarDatosUsuario() {
        // Obtener el usuario logueado del localStorage
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {};

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

    // Función para mostrar las transacciones del usuario logueado
    function mostrarTransaccionesUsuario() {
        // Obtener las transacciones del localStorage
        const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
        // Obtener el usuario logueado del localStorage
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};

        // Filtrar las transacciones del usuario logueado
        const transaccionesUsuario = transacciones.filter(transaccion => transaccion.numeroCuenta === usuarioLogueado.numeroCuenta);

        // Mostrar las transacciones en las tablas correspondientes
        mostrarTransacciones(transaccionesUsuario.filter(transaccion => transaccion.tipo === 'deposito'), 'tabla-depositos');
        mostrarTransacciones(transaccionesUsuario.filter(transaccion => transaccion.tipo === 'retiro'), 'tabla-retiros');
        mostrarTransacciones(transaccionesUsuario.filter(transaccion => transaccion.tipo === 'pago'), 'tabla-pagos');
        mostrarTransacciones(transaccionesUsuario, 'tabla-informe');
    }

    // Función para mostrar las transacciones en una tabla
    function mostrarTransacciones(transacciones, tablaId) {
        // Obtener el cuerpo de la tabla
        const tbody = document.querySelector(`#${tablaId} tbody`);

        // Limpiar el contenido previo de la tabla
        tbody.innerHTML = '';

        // Recorrer todas las transacciones y agregarlas a la tabla
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

    // Función para guardar la transacción en el localStorage
    function guardarTransaccion(transaccion) {
        // Obtener la fecha actual
        const fechaActual = new Date().toLocaleDateString();
        
        // Agregar la fecha a la transacción
        transaccion.fecha = fechaActual;

        let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
        transacciones.push(transaccion);
        localStorage.setItem('transacciones', JSON.stringify(transacciones));
    }

    // Ejecutar función para mostrar los datos del usuario al cargar la página
    mostrarDatosUsuario();

    // Ejecutar función para mostrar las transacciones del usuario al cargar la página
    mostrarTransaccionesUsuario();
    //-----------------------------------------------------------------------
    var content = document.getElementById('pills-tabContent'),
pdfout=document.getElementById('pdfout');
    pdfout.onclick = function(){
        var doc = new jsPDF('p','pt','letter');
        var margin= 20;
        var scale = (doc.internal.pageSize.width - margin *2)/document.body.clientWidth;
        var scale_mobile=(doc.internal.pageSize.width - margin*2)/document.body.getBoundingClientRect();

        //verificar navegador web o mobile
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test
            (navigator.userAgent)){
                //mobile
                doc.html(content , {
                    x:margin,
                    y:margin,
                    html2canvas:{
                        scale:scale_mobile,
                    },
                    callback: function(doc){
                        doc.output('dataurlnewwindow',
                        {filename:'pdf.pdf'});
                    }
                });
            }else{
                //PC
                doc.html(content , {
                    x:margin,
                    y:margin,
                    html2canvas:{
                        scale:scale,
                    },
                    callback: function(doc){
                        doc.output('dataurlnewwindow',
                        {filename:'pdf.pdf'});
                    }
                });
            }
    };

    
});
