import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '@core/services/loading.service';

/**
 * Interceptor para mostrar indicador de carga global
 * Incrementa/decrementa contador de peticiones activas
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Incrementar contador de peticiones
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Decrementar contador cuando termine (éxito o error)
      loadingService.hide();
    })
  );
};
