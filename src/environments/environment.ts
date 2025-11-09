/**
 * Configuración para ambiente de producción
 */
export const environment = {
  production: true,
  apiUrl: 'https://3.134.5.42/vhs-api', // URL del backend a través de proxy Apache
  apiVersion: 'v1',
  enableLogging: false,
  requestTimeout: 120000, // 2 minutos
  retryAttempts: 2,
  retryDelay: 3000, // 3 segundos entre reintentos
};
