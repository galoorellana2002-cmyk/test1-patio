# AutoHaus - Concesionario Premium

Sitio web profesional para concesionario de autos con inventario dinámico, filtros avanzados y formulario de citas.

## 📁 Estructura del Proyecto

```
/
├── index.html                 # Página principal (HTML limpio)
├── .gitignore                 # Configuración de Git
├── README.md                  # Este archivo
│
├── css/
│   └── styles.css            # Estilos principales (separados del HTML)
│
├── js/
│   └── main.js               # Lógica de JavaScript (funcionalidad del sitio)
│
├── config/
│   └── inventory.js          # Datos de inventario (escalable a API)
│
├── assets/
│   ├── images/               # Imágenes del sitio
│   ├── fonts/                # Fuentes locales (si las hay)
│   └── svg/                  # Iconos y vectores
│
├── pages/                    # Páginas adicionales (future)
│   ├── about.html           # Página Acerca de
│   ├── contact.html         # Página de contacto
│   └── inventory.html       # Inventario detallado
│
└── Nivel avanzado/          # Carpeta opcional para futuras mejoras
```

## 🚀 Características

- **Inventario Dinámico**: Carga desde `config/inventory.js` (fácil migración a API)
- **Filtros Avanzados**: Por marca, precio, año, categoría, combustible, transmisión
- **Vista Flexible**: Grid y vista de lista
- **Modal Detallado**: Información completa de vehículos
- **Formulario de Citas**: Validación y captura de leads
- **Integración WhatsApp**: Contacto directo
- **Responsive Design**: Optimizado para móvil
- **Animaciones Scroll**: Efecto reveal en scroll

## 📋 Cómo Usar

### 1. **Agregar Nuevos Vehículos**
Edita `config/inventory.js` y agrega objetos al array `INVENTORY`:

```javascript
const INVENTORY = [
  { 
    id: 1, 
    brand: 'Toyota', 
    model: 'Corolla Cross', 
    year: 2024, 
    price: 28500, 
    km: 0, 
    type: 'SUV', 
    fuel: 'Híbrido', 
    trans: 'CVT', 
    condition: 'nuevo', 
    color: 'Blanco Perla', 
    img: null 
  },
  // ...más vehículos
];
```

### 2. **Personalizar Estilos**
Modifica `css/styles.css` para cambiar colores, tipografía, espaciado, etc.

### 3. **Conectar a Base de Datos**
Reemplaza `config/inventory.js` con una llamada a API:

```javascript
fetch('/api/vehicles')
  .then(res => res.json())
  .then(data => {
    window.INVENTORY = data;
    renderCards(INVENTORY);
  });
```

## 🔧 Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsivo con variables CSS
- **JavaScript Vanilla** - Sin dependencias
- **Google Fonts** - Tipografía premium

## 🎨 Colores Principal

```css
--gold: #C9A84C
--gold-light: #E8D5A3
--gold-dark: #8B6914
--black: #0A0A0A
--dark: #111111
```

## 📱 Breakpoints Responsive

- Desktop: 1200px+
- Tablet: 900px - 1199px
- Mobile: 600px - 899px
- Small Mobile: < 600px

## 🚢 Deploy

### Opción 1: Hosting Estático (Recomendado)
- Vercel
- Netlify
- GitHub Pages
- Amazon S3 + CloudFront

**Pasos:**
1. Subir carpeta completa a repositorio Git
2. Conectar a hosting
3. Deploy automático en cada push

### Opción 2: Servidor Tradicional
1. Subir archivos vía FTP/SFTP
2. Mantener estructura de carpetas intacta
3. Asegurar permisos correctos (755 carpetas, 644 archivos)

### Verificar Deploy
- Abrir `index.html` en navegador
- Verificar que los estilos se cargan correctamente
- Probar funcionalidad de filtros
- Probar formulario y botones

## 📈 Escalabilidad

### Para Agregar Funcionalidades
1. **Búsqueda Avanzada**: Agregar función en `js/main.js`
2. **Comparar Vehículos**: Crear `js/compare.js`
3. **Sistema de Usuarios**: Crear carpeta `backend/`
4. **API**: Crear endpoints en servidor
5. **Base de Datos**: Conectar a PostgreSQL/MongoDB

## ⚠️ Mantenimiento

- Actualizar inventario regularmente en `config/inventory.js`
- Revisar compatibilidad navegadores
- Optimizar imágenes antes de subir
- Probar en dispositivos móviles
- Monitorear velocidad de carga

## 📞 Contacto y Soporte

Para modificaciones o bugs, revisar la sección de comentarios en el código.

---

**Versión**: 1.0  
**Última actualización**: 2025-06-09  
**Licencia**: Privada
