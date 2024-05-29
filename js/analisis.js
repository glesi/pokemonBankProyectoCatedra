document.addEventListener('DOMContentLoaded', function() {
    // Obtener los contextos de los gráficos
    var ctxSemanal = document.getElementById('grafico-semanal').getContext('2d');
    var ctxMensual = document.getElementById('grafico-mensual').getContext('2d');
    var ctxAnual = document.getElementById('grafico-anual').getContext('2d');

    // Datos de ejemplo para los gráficos
    var dataSemanal = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        datasets: [{
            label: 'Depósitos',
            data: [1200, 1900, 300, 500, 200],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }, {
            label: 'Retiros',
            data: [800, 600, 500, 700, 400],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }, {
            label: 'Pagos',
            data: [400, 300, 200, 100, 150],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    var dataMensual = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{
            label: 'Depósitos',
            data: [6500, 5900, 8000, 8100, 5600],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }, {
            label: 'Retiros',
            data: [3000, 2500, 4000, 3500, 2800],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }, {
            label: 'Pagos',
            data: [2000, 1500, 1000, 1200, 1800],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    var dataAnual = {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            label: 'Depósitos',
            data: [20000, 25000, 30000, 35000, 40000],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }, {
            label: 'Retiros',
            data: [15000, 18000, 22000, 20000, 24000],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }, {
            label: 'Pagos',
            data: [8000, 10000, 12000, 11000, 13000],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    // Configuración de los gráficos
    var options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Crear los gráficos
    var chartSemanal = new Chart(ctxSemanal, {
        type: 'bar',
        data: dataSemanal,
        options: options
    });

    var chartMensual = new Chart(ctxMensual, {
        type: 'bar',
        data: dataMensual,
        options: options
    });

    var chartAnual = new Chart(ctxAnual, {
        type: 'bar',
        data: dataAnual,
        options: options
    });
});

