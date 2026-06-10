/**
 * config/api-example.js
 * EJEMPLO: Cómo conectar a una API REST para inventario dinámico
 * 
 * Descomentar en index.html y comentar inventory.js para usar
 */

// Opción 1: Cargar desde API remota
async function loadInventoryFromAPI() {
  try {
    const response = await fetch('https://tu-servidor.com/api/vehicles');
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    window.INVENTORY = await response.json();
    
    console.log('✓ Inventario cargado desde API:', INVENTORY.length, 'vehículos');
    renderCards(INVENTORY);
    
  } catch (error) {
    console.error('✗ Error al cargar inventario:', error);
    // Fallback a datos locales
    console.log('Usando datos locales');
  }
}

// Opción 2: Backend con Node.js/Express
/*
En servidor (Node.js):

app.get('/api/vehicles', (req, res) => {
  const vehicles = [
    { id: 1, brand: 'Toyota', model: 'Corolla', ... },
    { id: 2, brand: 'BMW', model: 'Serie 3', ... }
  ];
  res.json(vehicles);
});

En index.html:
<script src="config/api-example.js"></script>
<script>
  loadInventoryFromAPI(); // Llamar en lugar de renderCards(INVENTORY)
</script>
*/

// Opción 3: Buscar vehículo específico
async function searchVehicle(id) {
  try {
    const response = await fetch(`https://tu-servidor.com/api/vehicles/${id}`);
    const vehicle = await response.json();
    openModal(id); // Abrir modal con datos actualizados
  } catch (error) {
    console.error('Error al buscar vehículo:', error);
  }
}

// Opción 4: Enviar formulario a servidor
async function submitFormToServer() {
  const formData = {
    nombre: document.getElementById('f-nombre').value,
    telefono: document.getElementById('f-telefono').value,
    email: document.getElementById('f-email').value,
    vehiculo: document.getElementById('f-vehiculo').value,
    fecha: document.getElementById('f-fecha').value,
    hora: document.getElementById('f-hora').value,
    tipo: document.getElementById('f-tipo').value,
    mensaje: document.getElementById('f-mensaje').value
  };
  
  try {
    const response = await fetch('https://tu-servidor.com/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      console.log('✓ Cita enviada exitosamente');
      document.getElementById('form-success').style.display = 'block';
    } else {
      throw new Error('Error al enviar');
    }
  } catch (error) {
    console.error('✗ Error:', error);
    alert('Error al enviar la cita. Por favor intenta de nuevo.');
  }
}

// Opción 5: Backend PHP (tradicional)
/*
En PHP (guardar en /api/save-appointment.php):

<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

// Validar datos
if (empty($data['nombre']) || empty($data['telefono']) || empty($data['fecha'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Datos incompletos']);
  exit;
}

// Guardar en BD o enviar email
$to = 'ventas@autohaus.com';
$subject = 'Nueva Cita - ' . $data['nombre'];
$message = "Nombre: {$data['nombre']}\nTeléfono: {$data['telefono']}\n...";

mail($to, $subject, $message);

http_response_code(200);
echo json_encode(['success' => true]);
?>

En JavaScript:
async function submitFormToServer() {
  const formData = new FormData(document.querySelector('form'));
  const response = await fetch('api/save-appointment.php', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData))
  });
  // ...
}
*/

// Opción 6: Integración con servicios terceros
// Ejemplo: SendGrid para emails automáticos
async function sendEmailNotification(appointmentData) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: appointmentData.email }],
        subject: `Confirmación de cita - ${appointmentData.fecha}`
      }],
      from: { email: 'noreply@autohaus.com' },
      content: [{
        type: 'text/html',
        value: `<h2>Hola ${appointmentData.nombre}</h2><p>Tu cita ha sido confirmada...</p>`
      }]
    })
  });
  
  return response.ok;
}

console.log('✓ API Examples cargado - Descomentar en index.html para usar');
