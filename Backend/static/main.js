document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/tipos_pago')
        .then(response => response.json())
        .then(data => {
            console.log('Datos recibidos de /api/tipos_pago:', data); // Verifica si los datos llegan
            const tipoPagoSelect = document.getElementById('tipo_pago');
            
            // Verifica si el select fue encontrado
            if (!tipoPagoSelect) {
                console.error('No se encontró el select con id "tipo_pago"');
                return;
            }

            // Llenar el select con los tipos de pago
            data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id;
                option.textContent = tipo.nombre;
                tipoPagoSelect.appendChild(option);
            });

            console.log('Select lleno con opciones:', tipoPagoSelect.innerHTML); // Verifica las opciones del select
        })
        .catch(error => console.error('Error al cargar tipos de pago:', error));

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
                if (!data.length) {
                    console.error('No hay datos para mostrar en el gráfico');
                    return;
                }
    
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
            .catch(error => console.error('Error al cargar los datos para la gráfica:', error));
    }
    
});
