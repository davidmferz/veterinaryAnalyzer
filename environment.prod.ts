/**
 * Configuración para ambiente de producción en AWS EC2
 *
 * IMPORTANTE: Antes de hacer el build de producción, actualiza:
 * - apiUrl: con la IP pública o dominio de tu instancia EC2
 * - Si usas HTTPS, cambia http:// por https://
 */
export const environment = {
  production: true,
  // CAMBIAR POR LA IP PÚBLICA DE TU EC2 O TU DOMINIO
  apiUrl: 'http://YOUR_EC2_PUBLIC_IP:8000', // Ejemplo: http://54.123.45.67:8000
  apiVersion: 'v1',
  enableLogging: false,
  requestTimeout: 120000, // 2 minutos
  retryAttempts: 2,
  retryDelay: 3000, // 3 segundos entre reintentos
};
