import { Injectable, signal } from '@angular/core';

/**
 * Servicio para gestionar el estado de carga global de la aplicación
 * Usa signals de Angular 19 para reactividad
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private requestCount = 0;

  // Signal que indica si hay peticiones en curso
  public readonly isLoading = signal<boolean>(false);

  /**
   * Incrementa el contador de peticiones y muestra el loading
   */
  show(): void {
    this.requestCount++;
    this.isLoading.set(true);
  }

  /**
   * Decrementa el contador de peticiones y oculta el loading si no hay más
   */
  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0) {
      this.isLoading.set(false);
    }
  }

  /**
   * Resetea el contador (útil para testing o casos especiales)
   */
  reset(): void {
    this.requestCount = 0;
    this.isLoading.set(false);
  }
}
