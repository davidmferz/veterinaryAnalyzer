import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '@environments/environment';

/**
 * Interceptor para logging de requests HTTP
 * Solo activo en modo desarrollo
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.enableLogging) {
    return next(req);
  }

  const startTime = Date.now();

  return next(req).pipe(
    tap({
      next: (event: any) => {
        if (event.type === 4) {
          // HttpEventType.Response
          const duration = Date.now() - startTime;
          console.log(
            `%c[HTTP] ${req.method} ${req.url}`,
            'color: #4CAF50; font-weight: bold',
            {
              status: event.status,
              duration: `${duration}ms`,
              body: event.body,
            }
          );
        }
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        console.error(
          `%c[HTTP ERROR] ${req.method} ${req.url}`,
          'color: #F44336; font-weight: bold',
          {
            status: error.status,
            duration: `${duration}ms`,
            error,
          }
        );
      },
    })
  );
};
