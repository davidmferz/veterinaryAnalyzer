import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Interceptors
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { loggingInterceptor } from '@core/interceptors/logging.interceptor';
import { loadingInterceptor } from '@core/interceptors/loading.interceptor';

/**
 * Configuración principal de la aplicación Angular 19
 * Define los providers globales y configuración de interceptores
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Zone.js optimizado
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router (sin rutas por ahora, single page app)
    provideRouter([]),

    // HttpClient con interceptores funcionales
    provideHttpClient(
      withInterceptors([
        loggingInterceptor,    // 1. Logging (primero para capturar todo)
        loadingInterceptor,    // 2. Loading indicator
        errorInterceptor,      // 3. Error handling (último para catch all)
      ])
    ),

    // Animaciones async para mejor performance
    provideAnimationsAsync(),
  ],
};
