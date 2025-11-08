/**
 * Configuración para ambiente de desarrollo
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000', // URL del backend VHS Analyzer
  apiVersion: 'v1',
  enableLogging: true,
  requestTimeout: 120000, // 2 minutos para análisis de imágenes
  retryAttempts: 3,
  retryDelay: 2000, // 2 segundos entre reintentos
};
