/**
 * Configuración para ambiente de producción
 */
export const environment = {
  production: true,
  apiUrl: 'http://3.134.5.42:3001', // URL del backend Node.js
  apiVersion: 'v1',
  enableLogging: false,
  requestTimeout: 120000, // 2 minutos
  retryAttempts: 2,
  retryDelay: 3000, // 3 segundos entre reintentos
};
