/**
 * Modelos TypeScript exactos basados en la documentación del backend VHS Analyzer
 * Estos modelos reflejan la respuesta real de la API
 */

/**
 * Tipo de clasificación clínica del VHS
 */
export type VhsClassification = 'normal' | 'borderline' | 'cardiomegaly';

/**
 * Nivel de severidad de la cardiomegalia
 */
export type VhsSeverity = 'none' | 'mild' | 'moderate' | 'severe';

/**
 * Nivel de confianza del análisis
 */
export type VhsConfidence = 'low' | 'medium' | 'high';

/**
 * Mediciones VHS del corazón en la radiografía
 */
export interface VhsMeasurements {
  /** Puntuación VHS total (suma de long_axis + short_axis) */
  vhs_score: number;

  /** Longitud del eje largo en vértebras */
  long_axis: number;

  /** Longitud del eje corto en vértebras */
  short_axis: number;

  /** Número de vértebras que abarca el eje largo */
  long_axis_vertebrae: number;

  /** Número de vértebras que abarca el eje corto */
  short_axis_vertebrae: number;
}

/**
 * Clasificación clínica y recomendaciones
 */
export interface ClinicalClassification {
  /** Clasificación del tamaño cardíaco */
  classification: VhsClassification;

  /** Severidad de la condición */
  severity: VhsSeverity;

  /** Nivel de confianza del análisis */
  confidence: VhsConfidence;

  /** Recomendación clínica para el veterinario */
  recommendation: string;

  /** Notas clínicas adicionales */
  clinical_notes: string[];
}

/**
 * Metadata adicional del análisis
 */
export interface VhsMetadata {
  /** Timestamp del análisis */
  timestamp?: string;

  /** Versión del modelo utilizado */
  model_version?: string;

  /** Información adicional */
  [key: string]: unknown;
}

/**
 * Respuesta completa del backend VHS Analyzer
 */
export interface VhsResponse {
  /** Indica si el análisis fue exitoso */
  success: boolean;

  /** Puntos clave detectados en la radiografía [x, y] */
  keypoints: number[][];

  /** Mediciones VHS calculadas */
  vhs_measurements: VhsMeasurements;

  /** Clasificación clínica y recomendaciones */
  clinical_classification: ClinicalClassification;

  /** Metadata del análisis */
  metadata: VhsMetadata;

  /** Imagen overlay en base64 (opcional, solo si se solicitó) */
  overlay_image?: string;

  /** Tiempo de procesamiento en milisegundos */
  processing_time_ms: number;

  /** Mensaje de error si success es false */
  error?: string;
}

/**
 * Respuesta de error del backend
 */
export interface VhsErrorResponse {
  success: false;
  error: string;
  details?: string;
  status_code?: number;
}

/**
 * Estado de carga del análisis
 */
export interface VhsAnalysisState {
  loading: boolean;
  data: VhsResponse | null;
  error: string | null;
}

/**
 * Opciones para el análisis
 */
export interface VhsAnalysisOptions {
  /** Incluir imagen overlay con las anotaciones */
  includeOverlay: boolean;

  /** Timeout en milisegundos (opcional) */
  timeout?: number;
}

/**
 * Validación de archivo para upload
 */
export interface FileValidation {
  valid: boolean;
  errors: string[];
}

/**
 * Constantes para validación
 */
export const VHS_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png'],
  MIN_IMAGE_DIMENSION: 224, // Mínimo esperado por el modelo
  RECOMMENDED_IMAGE_DIMENSION: 512,
} as const;

/**
 * Mensajes de error predefinidos
 */
export const VHS_ERROR_MESSAGES = {
  NO_FILE: 'No se seleccionó archivo',
  INVALID_TYPE: 'El backend rechazó el archivo: formato inválido',
  FILE_TOO_LARGE: 'Archivo mayor a 10MB',
  RATE_LIMIT: 'Rate limit excedido (429) – intenta en unos segundos',
  SERVICE_UNAVAILABLE: 'Servicio temporalmente no disponible (503)',
  NETWORK_ERROR: 'Error inesperado, revisa tu conexión',
  TIMEOUT: 'El análisis tardó demasiado tiempo',
  UNKNOWN: 'Error desconocido al procesar la radiografía',
};
