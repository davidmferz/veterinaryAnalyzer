import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Componente para mostrar mensajes de error de manera elegante
 * Incluye icono, mensaje y botón de retry opcional
 */
@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center">
      <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <mat-icon class="text-red-600 dark:text-red-400 !w-8 !h-8 !text-4xl">
          {{ icon() }}
        </mat-icon>
      </div>

      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {{ title() }}
      </h3>

      <p class="text-gray-600 dark:text-gray-300 max-w-md mb-6">
        {{ message() }}
      </p>

      @if (showRetry()) {
        <button
          mat-raised-button
          color="primary"
          (click)="retry.emit()"
          class="!min-w-[120px]"
        >
          <mat-icon class="mr-2">refresh</mat-icon>
          Reintentar
        </button>
      }
    </div>
  `,
  styles: [],
})
export class ErrorMessageComponent {
  /** Icono de Material Icons a mostrar */
  icon = input<string>('error_outline');

  /** Título del error */
  title = input<string>('Ha ocurrido un error');

  /** Mensaje descriptivo del error */
  message = input<string>('');

  /** Mostrar botón de reintentar */
  showRetry = input<boolean>(true);

  /** Evento emitido al hacer click en reintentar */
  retry = output<void>();
}
