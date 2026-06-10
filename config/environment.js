/**
 * config/environment.js
 * Configuración de ambientes (desarrollo, staging, producción)
 */

// Detectar ambiente actual
const ENVIRONMENT = {
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isStaging: window.location.hostname === 'staging.autohaus.com',
  isProduction: window.location.hostname === 'autohaus.com'
};

// Configuración por ambiente
const CONFIG = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    logLevel: 'debug',
    cache: false,
    whatsapp: '+593999000111',
    email: 'dev@autohaus.local',
    enableAnalytics: false
  },
  
  staging: {
    apiUrl: 'https://staging-api.autohaus.com/api',
    logLevel: 'info',
    cache: true,
    whatsapp: '+593999000111',
    email: 'staging@autohaus.com',
    enableAnalytics: true
  },
  
  production: {
    apiUrl: 'https://api.autohaus.com/api',
    logLevel: 'error',
    cache: true,
    whatsapp: '+593999000111',
    email: 'ventas@autohaus.com',
    enableAnalytics: true,
    enableSentry: true // Error tracking
  }
};

// Determinar config actual
let activeConfig = CONFIG.development;

if (ENVIRONMENT.isStaging) {
  activeConfig = CONFIG.staging;
} else if (ENVIRONMENT.isProduction) {
  activeConfig = CONFIG.production;
}

// Logger personalizado
const Logger = {
  debug: (...args) => {
    if (activeConfig.logLevel === 'debug') console.log('[DEBUG]', ...args);
  },
  info: (...args) => {
    if (['debug', 'info'].includes(activeConfig.logLevel)) console.log('[INFO]', ...args);
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
  }
};

// Exportar
window.CONFIG = activeConfig;
window.ENVIRONMENT = ENVIRONMENT;
window.Logger = Logger;

Logger.info('✓ Environment configurado:', ENVIRONMENT.isDevelopment ? 'DESARROLLO' : ENVIRONMENT.isStaging ? 'STAGING' : 'PRODUCCIÓN');
