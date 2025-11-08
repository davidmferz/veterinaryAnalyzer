/**
 * Configuración para ambiente de producción
 */
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000', // Cambiar por la URL real en producción
  apiVersion: 'v1',
  enableLogging: false,
  requestTimeout: 120000, // 2 minutos
  retryAttempts: 2,
  retryDelay: 3000, // 3 segundos entre reintentos
};
