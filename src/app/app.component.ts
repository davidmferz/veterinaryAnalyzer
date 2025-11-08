import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploadComponent } from '@features/upload/upload.component';
import { ResultsComponent } from '@features/results/results.component';
import { GlobalLoadingComponent } from '@shared/components/global-loading/global-loading.component';
import { ThemeService } from '@core/services/theme.service';
import { VhsResponse } from '@core/models';

/**
 * Componente raíz de la aplicación
 * Gestiona el flujo entre Upload y Results
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    UploadComponent,
    ResultsComponent,
    GlobalLoadingComponent,
  ],
  template: `
    <!-- Barra de progreso global -->
    <app-global-loading />

    <!-- Toolbar -->
    <mat-toolbar color="primary" class="shadow-md">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between px-4">
        <div class="flex items-center gap-3">
          <mat-icon class="!w-8 !h-8 !text-3xl">favorite</mat-icon>
          <span class="text-xl font-bold">VHS Analyzer</span>
        </div>

        <div class="flex items-center gap-2">
          @if (analysisResult()) {
            <button
              mat-stroked-button
              (click)="newAnalysis()"
              class="!text-white !border-white"
            >
              <mat-icon class="mr-1">add</mat-icon>
              Nuevo Análisis
            </button>
          }

          <button
            mat-icon-button
            (click)="toggleTheme()"
            [matTooltip]="themeService.isDark() ? 'Modo claro' : 'Modo oscuro'"
          >
            <mat-icon>
              {{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}
            </mat-icon>
          </button>
        </div>
      </div>
    </mat-toolbar>

    <!-- Contenido principal -->
    <main class="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      @if (!analysisResult()) {
        <!-- Vista de Upload -->
        <app-upload (analysisComplete)="onAnalysisComplete($event)" />
      } @else {
        <!-- Vista de Resultados -->
        <app-results [result]="analysisResult()!" />
      }
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p class="mb-2">
          <strong>VHS Analyzer</strong> - Sistema de análisis radiográfico veterinario
        </p>
        <p>
          Diseñado para estudiantes y profesionales de medicina veterinaria
        </p>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      mat-toolbar {
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      main {
        animation: fadeIn 0.3s ease-in;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class AppComponent {
  protected readonly themeService = inject(ThemeService);

  // Signal para almacenar el resultado del análisis
  analysisResult = signal<VhsResponse | null>(null);

  /**
   * Maneja la finalización del análisis
   */
  onAnalysisComplete(result: VhsResponse): void {
    this.analysisResult.set(result);
    // Scroll to top suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Inicia un nuevo análisis
   */
  newAnalysis(): void {
    this.analysisResult.set(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Alterna el tema
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
