# Guía de Deploy - AutoHaus

Instrucciones detalladas para desplegar el sitio en producción.

## 📋 Checklist Pre-Deploy

- [ ] Todos los archivos estén optimizados (CSS minificado, imágenes comprimidas)
- [ ] Revisar todas las rutas sean relativas (no absolutas)
- [ ] Probar en navegadores: Chrome, Firefox, Safari, Edge
- [ ] Probar en dispositivos móviles reales
- [ ] Verificar velocidad de carga (Google PageSpeed)
- [ ] Probar formulario completo
- [ ] Revisar enlaces y botones
- [ ] SSL/HTTPS configurado

## 🚀 Opción 1: Vercel (Recomendado - Más Fácil)

### Requisitos
- Cuenta en Vercel (vercel.com)
- Repositorio Git (GitHub, GitLab, Bitbucket)

### Pasos
1. **Subir código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conectar a Vercel**
   - Ir a vercel.com/new
   - Seleccionar repositorio
   - Vercel detecta automáticamente que es HTML/CSS/JS
   - Click en "Deploy"

3. **Configuración de dominio**
   - Ir a Configuración del proyecto
   - Agregar dominio personalizado
   - Actualizar DNS del dominio

### Ventajas
- Deploy en 30 segundos
- SSL automático
- CDN global
- Redeploy automático en cada push

---

## 🚀 Opción 2: Netlify (Fácil)

### Pasos
1. **Conectar repositorio**
   - netlify.com → New site from Git
   - Autorizar y seleccionar repo

2. **Configuración (automática)**
   - Rama: main
   - Comando build: (dejar vacío)
   - Directorio de publicación: . (raíz)

3. **Deploy y dominio**
   - Netlify genera URL temporal
   - Cambiar a dominio personalizado

---

## 🚀 Opción 3: Hosting Tradicional (Apache/cPanel)

### Requisitos
- Hosting con Apache 2.4+
- Acceso FTP o cPanel
- Dominio apuntando al hosting

### Pasos

#### 1. Preparar archivos
```bash
# En local, crear carpeta de deploy
mkdir autohaus-deploy
cp -r css js config assets index.html README.md .htaccess autohaus-deploy/
```

#### 2. Subir vía FTP
1. Abrir cliente FTP (FileZilla, WinSCP)
2. Conectar con credenciales del hosting
3. Navegar a carpeta `public_html` o `www`
4. Subir carpeta `autohaus-deploy`

#### 3. Verificar estructura
```
public_html/
├── autohaus-deploy/
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── config/
│   ├── assets/
│   └── .htaccess
```

#### 4. Configurar permisos
```bash
# Via SSH o cPanel Terminal
chmod 755 autohaus-deploy
chmod 755 autohaus-deploy/css
chmod 755 autohaus-deploy/js
chmod 755 autohaus-deploy/config
chmod 755 autohaus-deploy/assets
chmod 644 autohaus-deploy/*.html
chmod 644 autohaus-deploy/.htaccess
chmod 644 autohaus-deploy/css/*.css
chmod 644 autohaus-deploy/js/*.js
```

#### 5. Configurar dominio
- En cPanel → Addon Domains
- Apuntar dominio a carpeta `public_html/autohaus-deploy`

#### 6. Forzar HTTPS
- En cPanel → AutoSSL
- O configurar en `.htaccess` (ver sección comentada)

---

## 🚀 Opción 4: AWS S3 + CloudFront

### Pasos

1. **Crear bucket S3**
   - AWS Console → S3
   - Crear bucket (ej: `autohaus.com`)
   - Deshabilitar "Block Public Access"

2. **Subir archivos**
   - Upload carpeta completa
   - Permissions → Make public

3. **Habilitar Static Website Hosting**
   - Properties → Static website hosting
   - Index document: `index.html`
   - Error document: `index.html`

4. **Crear distribución CloudFront**
   - CloudFront → Distributions
   - Origin: S3 bucket
   - Default root object: `index.html`

5. **Conectar dominio**
   - Route 53 → Crear alias a CloudFront

---

## ✅ Verificaciones Post-Deploy

### Funcionalidad
```javascript
// Abrir consola (F12) y ejecutar:
console.log('INVENTORY:', INVENTORY);  // Verificar datos
console.log('Funciones:', {
  renderCards: typeof renderCards,
  openModal: typeof openModal,
  submitForm: typeof submitForm
});
```

### Performance
- Abrir DevTools → Network
- Verificar que archivos se cargan correctamente
- Tiempo de carga < 3 segundos

### SEO Básico
- [ ] Título correcto: "AutoHaus — Concesionario Premium"
- [ ] Meta description
- [ ] Favicon (opcional)

### Seg

uridad
- [ ] HTTPS funcionando
- [ ] No hay errores de consola
- [ ] Form no envía datos en GET
- [ ] Variables sensibles no expuestas

---

## 🔄 Actualizaciones Futuras

### Para actualizarInventario
```bash
# Local
1. Editar config/inventory.js
2. git add config/inventory.js
3. git commit -m "Update inventory"
4. git push

# Si usa Vercel/Netlify: Auto deploy en 30 seg
# Si usa FTP: Subir solo config/inventory.js
```

### Para cambios de estilos
```bash
# Local
1. Editar css/styles.css
2. git push
# Deploy automático
```

---

## 🐛 Troubleshooting

### "No se cargan los estilos"
- Verificar ruta en `<link rel="stylesheet" href="css/styles.css">`
- Ir a View Page Source y clickear en el enlace del CSS
- Verificar permisos de archivo (644)

### "JavaScript no funciona"
- F12 → Console y buscar errores
- Verificar que `inventory.js` se carga antes de `main.js`
- Revisar rutas relativas

### "Formulario no envía"
- Verificar que IDs coinciden: `f-nombre`, `f-telefono`, `f-fecha`
- Revisar consola para errores de validación
- WhatsApp: verificar formato de teléfono

### "Modal no abre"
- Elemento `#car-modal` debe existir
- Verificar que JavaScript se ejecuta (`console.log` en main.js)

---

## 📞 Soporte

Para problemas específicos del hosting, contactar al proveedor.

---

**Última actualización**: 2025-06-09
