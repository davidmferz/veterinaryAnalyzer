import {
  Component,
  input,
  signal,
  viewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Componente avanzado para visualizar imágenes con zoom y pan
 * Soporta interacción con mouse y touch
 */
@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements AfterViewInit {
  // Inputs
  imageBase64 = input.required<string>();
  alt = input<string>('Image');

  // ViewChild para acceder al canvas y container
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  container = viewChild<ElementRef<HTMLDivElement>>('container');

  // Signals para estado
  scale = signal<number>(1);
  translateX = signal<number>(0);
  translateY = signal<number>(0);
  isDragging = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Variables para drag
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastY = 0;
  private image: HTMLImageElement | null = null;

  ngAfterViewInit(): void {
    this.loadImage();
  }

  /**
   * Carga la imagen base64 y la dibuja en el canvas
   */
  private loadImage(): void {
    const img = new Image();
    img.onload = () => {
      this.image = img;
      this.drawImage();
      this.isLoading.set(false);
    };
    img.onerror = () => {
      console.error('Error loading image');
      this.isLoading.set(false);
    };
    img.src = `data:image/png;base64,${this.imageBase64()}`;
  }

  /**
   * Dibuja la imagen en el canvas con las transformaciones aplicadas
   */
  private drawImage(): void {
    const canvasEl = this.canvas()?.nativeElement;
    const containerEl = this.container()?.nativeElement;
    if (!canvasEl || !containerEl || !this.image) return;

    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    // Ajustar canvas al container
    const containerWidth = containerEl.clientWidth;
    const containerHeight = containerEl.clientHeight || 500;

    canvasEl.width = containerWidth;
    canvasEl.height = containerHeight;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    // Calcular escala inicial para fit
    const scaleX = containerWidth / this.image.width;
    const scaleY = containerHeight / this.image.height;
    const initialScale = Math.min(scaleX, scaleY, 1);

    // Calcular posición centrada
    const currentScale = this.scale() * initialScale;
    const imgWidth = this.image.width * currentScale;
    const imgHeight = this.image.height * currentScale;

    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    const x = centerX - imgWidth / 2 + this.translateX();
    const y = centerY - imgHeight / 2 + this.translateY();

    // Aplicar transformaciones y dibujar
    ctx.save();
    ctx.drawImage(this.image, x, y, imgWidth, imgHeight);
    ctx.restore();
  }

  /**
   * Zoom in
   */
  zoomIn(): void {
    const newScale = Math.min(this.scale() * 1.2, 5);
    this.scale.set(newScale);
    this.drawImage();
  }

  /**
   * Zoom out
   */
  zoomOut(): void {
    const newScale = Math.max(this.scale() / 1.2, 0.5);
    this.scale.set(newScale);
    this.drawImage();
  }

  /**
   * Reset view
   */
  resetView(): void {
    this.scale.set(1);
    this.translateX.set(0);
    this.translateY.set(0);
    this.drawImage();
  }

  /**
   * Maneja el inicio del drag (mouse)
   */
  onMouseDown(event: MouseEvent): void {
    this.isDragging.set(true);
    this.startX = event.clientX - this.translateX();
    this.startY = event.clientY - this.translateY();
    event.preventDefault();
  }

  /**
   * Maneja el movimiento del drag (mouse)
   */
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) return;

    const newX = event.clientX - this.startX;
    const newY = event.clientY - this.startY;

    this.translateX.set(newX);
    this.translateY.set(newY);
    this.drawImage();
  }

  /**
   * Maneja el fin del drag (mouse)
   */
  onMouseUp(): void {
    this.isDragging.set(false);
  }

  /**
   * Maneja el inicio del drag (touch)
   */
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.isDragging.set(true);
      this.startX = touch.clientX - this.translateX();
      this.startY = touch.clientY - this.translateY();
      this.lastX = touch.clientX;
      this.lastY = touch.clientY;
      event.preventDefault();
    }
  }

  /**
   * Maneja el movimiento del drag (touch)
   */
  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging() || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const newX = touch.clientX - this.startX;
    const newY = touch.clientY - this.startY;

    this.translateX.set(newX);
    this.translateY.set(newY);
    this.drawImage();

    this.lastX = touch.clientX;
    this.lastY = touch.clientY;
    event.preventDefault();
  }

  /**
   * Maneja el fin del drag (touch)
   */
  onTouchEnd(): void {
    this.isDragging.set(false);
  }

  /**
   * Maneja el zoom con la rueda del mouse
   */
  onWheel(event: WheelEvent): void {
    event.preventDefault();

    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(this.scale() * delta, 0.5), 5);

    this.scale.set(newScale);
    this.drawImage();
  }

  /**
   * Retorna el porcentaje de zoom actual
   */
  getZoomPercentage(): number {
    return Math.round(this.scale() * 100);
  }
}
