import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { VhsService } from '@core/services/vhs.service';
import { VhsResponse, VHS_CONSTANTS } from '@core/models';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';

/**
 * Componente para subir y analizar radiografías
 * Incluye drag & drop, validación y preview
 */
@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  private readonly vhsService = inject(VhsService);

  // Signals para estado reactivo
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isDragging = signal<boolean>(false);
  isAnalyzing = signal<boolean>(false);
  includeOverlay = signal<boolean>(true);
  error = signal<string | null>(null);
  validationErrors = signal<string[]>([]);

  // Output para emitir resultados al componente padre
  analysisComplete = output<VhsResponse>();

  // Constantes expuestas al template
  readonly MAX_SIZE_MB = VHS_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024);
  readonly ALLOWED_TYPES = VHS_CONSTANTS.ALLOWED_EXTENSIONS.join(', ');

  /**
   * Maneja el evento de drag over
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  /**
   * Maneja el evento de drag leave
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  /**
   * Maneja el evento de drop
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  /**
   * Maneja la selección de archivo desde el input
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  /**
   * Procesa el archivo seleccionado
   */
  private async handleFile(file: File): Promise<void> {
    this.error.set(null);
    this.validationErrors.set([]);

    // Validar archivo
    const validation = this.vhsService.validateFile(file);
    if (!validation.valid) {
      this.validationErrors.set(validation.errors);
      return;
    }

    // Establecer archivo y crear preview
    this.selectedFile.set(file);

    try {
      const preview = await this.vhsService.createImagePreview(file);
      this.previewUrl.set(preview);
    } catch (err) {
      this.error.set('Error al crear la vista previa de la imagen');
    }
  }

  /**
   * Limpia el archivo seleccionado
   */
  clearFile(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.error.set(null);
    this.validationErrors.set([]);
  }

  /**
   * Inicia el análisis de la radiografía
   */
  analyzeRadiograph(): void {
    const file = this.selectedFile();
    if (!file) {
      this.error.set('Por favor selecciona un archivo primero');
      return;
    }

    this.isAnalyzing.set(true);
    this.error.set(null);

    this.vhsService
      .analyzeRadiograph(file, { includeOverlay: this.includeOverlay() })
      .subscribe({
        next: (response) => {
          this.isAnalyzing.set(false);
          if (response.success) {
            this.analysisComplete.emit(response);
            this.clearFile();
          } else {
            this.error.set(response.error || 'Error en el análisis');
          }
        },
        error: (err: Error) => {
          this.isAnalyzing.set(false);
          this.error.set(err.message);
        },
      });
  }

  /**
   * Reintenta el análisis
   */
  retry(): void {
    this.error.set(null);
    this.analyzeRadiograph();
  }

  /**
   * Formatea el tamaño del archivo
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
