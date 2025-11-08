import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '@core/services/loading.service';

/**
 * Componente de barra de progreso global
 * Se muestra en la parte superior cuando hay peticiones HTTP en curso
 */
@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    @if (loadingService.isLoading()) {
      <div class="fixed top-0 left-0 right-0 z-[9999]">
        <mat-progress-bar mode="indeterminate" color="primary"></mat-progress-bar>
      </div>
    }
  `,
  styles: [],
})
export class GlobalLoadingComponent {
  protected readonly loadingService = inject(LoadingService);
}
