document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.nav-link');
    const message = document.querySelector('.message');

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
        if (montoRetiroSelect.value === 'Otro') {
            otroMontoInput.style.display = 'block';
        } else {
            otroMontoInput.style.display = 'none';
        }
    });
});
