import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { VhsResponse } from '@core/models';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';

/**
 * Componente para mostrar los resultados del análisis VHS
 * Incluye visualización de medidas, clasificación y overlay con zoom/pan
 */
@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatTableModule,
    ImageViewerComponent,
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  // Input del resultado del análisis
  result = input.required<VhsResponse>();

  // Columnas de la tabla de mediciones
  displayedColumns = ['metric', 'value'];

  // Computed signals para derivar datos
  vhsScore = computed(() => this.result().vhs_measurements.vhs_score);
  classification = computed(() => this.result().clinical_classification.classification);
  severity = computed(() => this.result().clinical_classification.severity);
  confidence = computed(() => this.result().clinical_classification.confidence);

  /**
   * Retorna la clase CSS basada en la clasificación
   */
  getClassificationColor(): string {
    const classification = this.classification();
    switch (classification) {
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'borderline':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'cardiomegaly':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }

  /**
   * Retorna el ícono basado en la clasificación
   */
  getClassificationIcon(): string {
    const classification = this.classification();
    switch (classification) {
      case 'normal':
        return 'check_circle';
      case 'borderline':
        return 'warning';
      case 'cardiomegaly':
        return 'error';
      default:
        return 'help';
    }
  }

  /**
   * Retorna la clase CSS basada en la severidad
   */
  getSeverityColor(): string {
    const severity = this.severity();
    switch (severity) {
      case 'none':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'mild':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'moderate':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'severe':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }

  /**
   * Retorna el label en español para la clasificación
   */
  getClassificationLabel(): string {
    const classification = this.classification();
    switch (classification) {
      case 'normal':
        return 'Normal';
      case 'borderline':
        return 'Límite';
      case 'cardiomegaly':
        return 'Cardiomegalia';
      default:
        return classification;
    }
  }

  /**
   * Retorna el label en español para la severidad
   */
  getSeverityLabel(): string {
    const severity = this.severity();
    switch (severity) {
      case 'none':
        return 'Ninguna';
      case 'mild':
        return 'Leve';
      case 'moderate':
        return 'Moderada';
      case 'severe':
        return 'Severa';
      default:
        return severity;
    }
  }

  /**
   * Retorna el label en español para la confianza
   */
  getConfidenceLabel(): string {
    const confidence = this.confidence();
    switch (confidence) {
      case 'low':
        return 'Baja';
      case 'medium':
        return 'Media';
      case 'high':
        return 'Alta';
      default:
        return confidence;
    }
  }

  /**
   * Formatea el tiempo de procesamiento
   */
  formatProcessingTime(ms: number): string {
    if (ms < 1000) {
      return `${ms.toFixed(0)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  }

  /**
   * Descarga el overlay como imagen
   */
  downloadOverlay(): void {
    const overlayImage = this.result().overlay_image;
    if (!overlayImage) return;

    const link = document.createElement('a');
    link.href = `data:image/png;base64,${overlayImage}`;
    link.download = `vhs-overlay-${new Date().getTime()}.png`;
    link.click();
  }

  /**
   * Exporta los resultados como JSON
   */
  exportResults(): void {
    const dataStr = JSON.stringify(this.result(), null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vhs-results-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
