document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/tipos_pago')
        .then(response => response.json())
        .then(data => {
            const tipoPagoSelect = document.getElementById('tipo_pago');
            data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id;
                option.textContent = tipo.nombre;
                tipoPagoSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));

    // Manejar la navegación
    document.getElementById('nav-register').addEventListener('click', function(event) {
        event.preventDefault();
        showContainer('register-container');
    });

    document.getElementById('nav-add-type').addEventListener('click', function(event) {
        event.preventDefault();
        showContainer('add-type-container');
    });

    document.getElementById('nav-view-payments').addEventListener('click', function(event) {
        event.preventDefault();
        showContainer('view-payments-container');
    });

    document.getElementById('nav-view-chart').addEventListener('click', function(event) {
        event.preventDefault();
        showContainer('view-chart-container');
        drawChart();
    });

    function showContainer(containerId) {
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('add-type-container').style.display = 'none';
        document.getElementById('view-payments-container').style.display = 'none';
        document.getElementById('view-chart-container').style.display = 'none';

        document.getElementById(containerId).style.display = 'block';
    }

    // Mostrar la primera sección al cargar la página
    showContainer('register-container');

    function drawChart() {
        fetch('/api/suma_pagos_por_mes')
            .then(response => response.json())
            .then(data => {
                var dataArray = [['Mes', 'Total']];
                data.forEach(item => {
                    dataArray.push(['Mes ' + item.mes, parseFloat(item.total)]);
                });

                var googleData = google.visualization.arrayToDataTable(dataArray);

                var options = {
                    title: 'Suma Total de Pagos por Mes',
                    curveType: 'function',
                    legend: { position: 'bottom' }
                };

                var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
                chart.draw(googleData, options);
            })
            .catch(error => console.error('Error:', error));
    }
});
