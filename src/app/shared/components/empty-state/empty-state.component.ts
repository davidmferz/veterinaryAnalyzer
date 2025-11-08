import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * Componente para mostrar estados vacíos de manera amigable
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center">
      <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <mat-icon class="text-gray-400 dark:text-gray-500 !w-12 !h-12 !text-5xl">
          {{ icon() }}
        </mat-icon>
      </div>

      <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {{ title() }}
      </h3>

      <p class="text-gray-600 dark:text-gray-400 max-w-md">
        {{ message() }}
      </p>
    </div>
  `,
  styles: [],
})
export class EmptyStateComponent {
  /** Icono de Material Icons */
  icon = input<string>('inbox');

  /** Título del estado vacío */
  title = input<string>('No hay datos');

  /** Mensaje descriptivo */
  message = input<string>('');
}
