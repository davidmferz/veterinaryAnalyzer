import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Componente de spinner de carga reutilizable
 * Soporta diferentes tamaños y mensajes personalizados
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 min-h-[200px]">
      <mat-spinner
        [diameter]="diameter()"
        [strokeWidth]="strokeWidth()"
        color="primary"
      ></mat-spinner>

      @if (message()) {
        <p class="mt-4 text-gray-600 dark:text-gray-300 text-center animate-pulse-soft">
          {{ message() }}
        </p>
      }
    </div>
  `,
  styles: [],
})
export class LoadingSpinnerComponent {
  /** Diámetro del spinner */
  diameter = input<number>(50);

  /** Grosor del spinner */
  strokeWidth = input<number>(5);

  /** Mensaje opcional a mostrar */
  message = input<string>('');
}
