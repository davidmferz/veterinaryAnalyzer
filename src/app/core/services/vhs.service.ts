import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout, retry } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {
  VhsResponse,
  VhsErrorResponse,
  VhsAnalysisOptions,
  VHS_ERROR_MESSAGES,
} from '@core/models';

/**
 * Servicio principal para interactuar con el backend VHS Analyzer
 * Maneja el análisis de radiografías y la comunicación con la API
 */
@Injectable({
  providedIn: 'root',
})
export class VhsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/${environment.apiVersion}`;

  /**
   * Analiza una radiografía torácica y retorna el VHS score
   * @param file Archivo de imagen (JPEG, PNG)
   * @param options Opciones del análisis (includeOverlay, timeout)
   * @returns Observable con la respuesta del análisis
   */
  analyzeRadiograph(
    file: File,
    options: VhsAnalysisOptions = { includeOverlay: true }
  ): Observable<VhsResponse> {
    // Validar que se proporcionó un archivo
    if (!file) {
      return throwError(() => new Error(VHS_ERROR_MESSAGES.NO_FILE));
    }

    // Crear FormData para multipart/form-data
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Configurar parámetros de query
    const params = new HttpParams().set(
      'includeOverlay',
      options.includeOverlay.toString()
    );

    // Realizar petición con manejo de timeout y retry
    return this.http
      .post<VhsResponse>(`${this.apiUrl}/vhs/analyze`, formData, { params })
      .pipe(
        timeout(options.timeout || environment.requestTimeout),
        retry({
          count: environment.retryAttempts,
          delay: (error: HttpErrorResponse, retryCount: number) => {
            // Solo reintentar en casos específicos
            if (error.status === 503 || error.status === 429) {
              console.warn(
                `Retry attempt ${retryCount} due to status ${error.status}`
              );
              return new Observable<void>((observer) => {
                setTimeout(() => {
                  observer.next();
                  observer.complete();
                }, environment.retryDelay * retryCount);
              });
            }
            // No reintentar en otros casos
            throw error;
          },
        }),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Verifica el estado del backend
   * @returns Observable con el estado de salud
   */
  checkHealth(): Observable<{ status: string; timestamp: string }> {
    return this.http
      .get<{ status: string; timestamp: string }>(
        `${environment.apiUrl}/health`
      )
      .pipe(
        timeout(5000),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Maneja errores HTTP de manera centralizada
   * @param error Error HTTP o de otro tipo
   * @returns Observable que emite error con mensaje apropiado
   */
  private handleError(error: unknown): Observable<never> {
    let errorMessage: string = VHS_ERROR_MESSAGES.UNKNOWN;

    if (error instanceof HttpErrorResponse) {
      // Errores del servidor
      switch (error.status) {
        case 0:
          errorMessage = VHS_ERROR_MESSAGES.NETWORK_ERROR;
          break;
        case 400:
          errorMessage =
            (error.error as VhsErrorResponse)?.error ||
            VHS_ERROR_MESSAGES.INVALID_TYPE;
          break;
        case 413:
          errorMessage = VHS_ERROR_MESSAGES.FILE_TOO_LARGE;
          break;
        case 429:
          errorMessage = VHS_ERROR_MESSAGES.RATE_LIMIT;
          break;
        case 503:
          errorMessage = VHS_ERROR_MESSAGES.SERVICE_UNAVAILABLE;
          break;
        case 500:
        case 502:
        case 504:
          errorMessage =
            (error.error as VhsErrorResponse)?.error ||
            'Error interno del servidor';
          break;
        default:
          errorMessage =
            (error.error as VhsErrorResponse)?.error ||
            `Error ${error.status}: ${error.statusText}`;
      }
    } else if (error instanceof TimeoutError) {
      errorMessage = VHS_ERROR_MESSAGES.TIMEOUT;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Log en desarrollo
    if (environment.enableLogging) {
      console.error('VhsService Error:', {
        error,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Valida un archivo antes de enviarlo
   * @param file Archivo a validar
   * @returns Objeto con resultado de validación y errores
   */
  validateFile(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      errors.push(
        `Tipo de archivo no válido. Solo se permiten: ${allowedTypes.join(
          ', '
        )}`
      );
    }

    // Validar tamaño
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push(`El archivo excede el tamaño máximo de 10MB`);
    }

    // Validar que el archivo tenga contenido
    if (file.size === 0) {
      errors.push('El archivo está vacío');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Crea una URL de datos para previsualizar una imagen
   * @param file Archivo de imagen
   * @returns Promise con la URL de datos
   */
  createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('No se pudo crear la vista previa'));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  }
}
