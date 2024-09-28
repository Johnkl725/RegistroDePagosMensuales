document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const tipo_pago = document.getElementById('tipo_pago').value;
    const cantidad = document.getElementById('cantidad').value;
    const fecha = document.getElementById('fecha').value;

    fetch('/api/pagos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tipo_pago, cantidad, fecha })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('payment-form').reset();
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('month-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const mes = document.getElementById('mes').value;

    // Obtener pagos por mes
    fetch(`/api/pagos/${mes}`)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('payments-table').querySelector('tbody');
        tableBody.innerHTML = '';

        data.forEach(pago => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pago.id}</td>
                <td>${pago.tipo_pago}</td>
                <td>S/ ${pago.cantidad}</td>
                <td>${formatDate(pago.fecha)}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));

    // Obtener la suma total de pagos por mes
    fetch(`/api/suma_pagos/${mes}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('total-pagos').textContent = `S/ ${data.total || 0}`;
    })
    .catch(error => console.error('Error:', error));
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-PE', options);
}
