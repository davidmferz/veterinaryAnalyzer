import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';

/**
 * Interceptor para manejo global de errores HTTP
 * Muestra notificaciones al usuario y registra errores en consola
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 0:
            errorMessage = 'No se pudo conectar con el servidor';
            break;
          case 400:
            errorMessage = error.error?.error || 'Solicitud inválida';
            break;
          case 401:
            errorMessage = 'No autorizado';
            break;
          case 403:
            errorMessage = 'Acceso denegado';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 413:
            errorMessage = 'Archivo demasiado grande';
            break;
          case 429:
            errorMessage =
              'Demasiadas solicitudes. Por favor, espera un momento.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          case 503:
            errorMessage = 'Servicio temporalmente no disponible';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }

      // Mostrar snackbar solo para errores críticos
      if (error.status >= 500 || error.status === 0) {
        snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      }

      // Log en desarrollo
      if (environment.enableLogging) {
        console.error('HTTP Error:', {
          url: req.url,
          method: req.method,
          status: error.status,
          message: errorMessage,
          error,
        });
      }

      return throwError(() => error);
    })
  );
};
