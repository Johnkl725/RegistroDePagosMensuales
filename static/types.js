document.getElementById('tipo-pago-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nuevo_tipo_pago = document.getElementById('nuevo_tipo_pago').value;

    fetch('/api/tipos_pago', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nuevo_tipo_pago })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        // Recargar tipos de pago
        fetch('/api/tipos_pago')
            .then(response => response.json())
            .then(data => {
                const tipoPagoSelect = document.getElementById('tipo_pago');
                tipoPagoSelect.innerHTML = '';
                data.forEach(tipo => {
                    const option = document.createElement('option');
                    option.value = tipo.id;
                    option.textContent = tipo.nombre;
                    tipoPagoSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));
});
