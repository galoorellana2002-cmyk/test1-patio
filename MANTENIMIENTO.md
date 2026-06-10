# MANTENIMIENTO Y ACTUALIZACIONES

Guía para mantener el proyecto después del deploy inicial.

## 📅 Actualizaciones Regulares

### Diarias / Semanales
- [ ] Revisar nuevo inventario
- [ ] Verificar formularios de citas en email
- [ ] Monitorear velocidad del sitio
- [ ] Revisar errores en consola (F12)

### Mensuales
- [ ] Actualizar datos de inventario
- [ ] Revisar analytics (si está habilitado)
- [ ] Hacer backup de datos
- [ ] Revisar y responder comentarios/sugerencias

### Trimestrales
- [ ] Revisar compatibilidad con nuevos navegadores
- [ ] Optimizar imágenes
- [ ] Revisar seguridad (HTTPS, permisos)
- [ ] Actualizar números de contacto si cambian

## 🔄 Actualizar Inventario

### Método 1: Archivos Locales (Fácil)
```bash
# 1. Editar en local
Abrir: config/inventory.js
Cambiar datos del array INVENTORY

# 2. Subir cambios
git add config/inventory.js
git commit -m "Update inventory - June 2025"
git push

# 3. Deploy automático (en 30 segundos)
Vercel/Netlify detecta cambios automáticamente
```

### Método 2: FTP (Sin Git)
```bash
# 1. Conectar con FileZilla
- Host: ftp.tu-hosting.com
- Usuario: tu-usuario
- Contraseña: tu-contraseña

# 2. Navegar a public_html/autohaus/config/

# 3. Descargar config/inventory.js
(hacer backup local)

# 4. Editar en local y subir
```

### Método 3: Panel cPanel
```bash
# 1. File Manager → public_html → autohaus → config
# 2. Click derecho → Edit en inventory.js
# 3. Editar y guardar
# 4. Cambios aplicados al instante
```

## 📝 Formato de Inventario

```javascript
const INVENTORY = [
  { 
    id: 1,                           // ID único (incrementar)
    brand: 'Toyota',                 // Marca
    model: 'Corolla Cross',          // Modelo
    year: 2024,                      // Año
    price: 28500,                    // Precio en USD
    km: 0,                           // Kilómetros (0 para nuevo)
    type: 'SUV',                     // Categoría: Sedán, SUV, Pickup, Hatchback, etc
    fuel: 'Híbrido',                 // Combustible: Gasolina, Diesel, Eléctrico, Híbrido
    trans: 'CVT',                    // Transmisión: Automático, Manual, CVT
    condition: 'nuevo',              // Condición: nuevo, seminuevo
    color: 'Blanco Perla',          // Color
    img: null                        // Imagen (null = placeholder, o URL)
  }
];
```

## 🎨 Personalizar Colores

```css
/* Editar css/styles.css */
:root {
  --gold: #C9A84C;              /* Color principal - cambiar aquí */
  --gold-light: #E8D5A3;        /* Color claro */
  --gold-dark: #8B6914;         /* Color oscuro */
  --black: #0A0A0A;             /* Fondo principal */
  /* ... más variables */
}
```

## 📞 Cambiar Contacto

```html
<!-- Editar en index.html (o buscar en comentarios) -->

<!-- LLÁMANOS -->
<a href="tel:+593999000111" class="phone-link">+593 999 000 111</a>

<!-- WHATSAPP -->
<a href="https://wa.me/593999000111?text=Hola" class="whatsapp-btn">
  
<!-- EMAIL -->
ventas@autohaus.com

<!-- DIRECCIÓN -->
Av. Principal 123, Quito, Ecuador
```

## 🖼️ Agregar Imágenes

```bash
# 1. Crear carpeta en assets/images
# Ejemplos: banner/, thumbnails/, logos/

# 2. Comprimir imágenes antes de subir
# Herramientas: TinyPNG, ImageOptim

# 3. En HTML o CSS, usar ruta relativa
<img src="assets/images/car-1.jpg" alt="Coche 1">
background-image: url('../../assets/images/pattern.png');

# 4. Formatos recomendados:
- JPG: Fotos (80% calidad)
- PNG: Transparencias, logos
- WebP: Mejor compresión (2x más pequeño)
```

## 🔒 Seguridad

### Cambiar Credenciales Regulares
```bash
# Si tienes acceso FTP/SSH
- Cambiar contraseña mensualmente
- No compartir credenciales
- Usar contraseñas fuertes (16+ caracteres)
```

### Backup
```bash
# Usar SFTP para descargar copia completa
# O usar opción de backup en cPanel

# Guardar en 2 lugares:
1. Disco externo
2. Google Drive o Dropbox
```

## 🐛 Solucionar Problemas Comunes

### "El sitio se ve lento"
1. Comprimir imágenes
2. Reducir tamaño de fonts descargadas
3. Eliminar scripts innecesarios
4. Usar herramienta: https://pagespeed.web.dev

### "Formulario no envía"
1. Revisar consola (F12) para errores
2. Validar que servidor recibe datos
3. Revisar CORS si es API remota
4. Ver si hay firewall bloqueando

### "Estilos no cargan correctamente"
1. Hard refresh: Ctrl+Shift+R (o Cmd+Shift+R en Mac)
2. Limpiar caché del navegador
3. Verificar ruta de archivo CSS

### "Modal no funciona"
1. Abrir consola (F12)
2. Escribir: `console.log(typeof openModal)` 
3. Si dice "undefined" → JavaScript no se cargó
4. Verificar archivo `js/main.js` existe

## 📊 Monitoreo

### Herramientas Recomendadas
- **Google Analytics**: Rastrear visitantes
- **Google PageSpeed**: Velocidad
- **Uptime Robot**: Verificar si está online
- **Sentry**: Rastrear errores

### Configurar Google Analytics
```html
<!-- Agregar al <head> de index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🚨 Emergencias

### Sitio caído
1. Verificar con uptime-robot o acceder desde otra red
2. Verificar DNS (https://dnschecker.org)
3. Contactar hosting si error 500/502/503
4. Revisar archivo .htaccess por errores de sintaxis

### Ataque o código malicioso
1. No publicar información
2. Cambiar todas las contraseñas inmediatamente
3. Contactar hosting de seguridad
4. Buscar scripts/archivos extraños en carpetas

### Pérdida de datos
1. Contactar hosting para restaurar backups
2. Si hay backup local, reuploaderlo
3. Revisar qué se perdió exactamente

## 📈 Escalar en Futuro

### Cuando crezca el sitio

**Fase 1: Sitio estático actual** ✓ (Ahora)
- Inventario en JSON
- Formulario básico

**Fase 2: Backend simple**
- Database (MySQL, PostgreSQL)
- API REST (Node.js, Python, PHP)
- Panel de administrador

**Fase 3: E-commerce**
- Carrito de compras
- Pagos (Stripe, PayPal)
- Cuenta de usuario

**Fase 4: Aplicación completa**
- App móvil
- Chat en vivo
- Sistema de financiamiento

---

## 📞 Contactos Útiles

**Hosting**: [tu-hosting]
**Dominio**: [tu-registrar]
**Email técnico**: [soporte@email]
**Backup**: [ubicación en nube]

---

**Última actualización**: 2025-06-09
