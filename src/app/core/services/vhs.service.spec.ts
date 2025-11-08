import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { VhsService } from './vhs.service';
import { VhsResponse, VHS_ERROR_MESSAGES } from '@core/models';
import { environment } from '@environments/environment';

describe('VhsService', () => {
  let service: VhsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/${environment.apiVersion}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VhsService],
    });
    service = TestBed.inject(VhsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('analyzeRadiograph', () => {
    it('should send multipart/form-data with file', (done) => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse: VhsResponse = {
        success: true,
        keypoints: [[100, 200], [150, 250]],
        vhs_measurements: {
          vhs_score: 10.5,
          long_axis: 6.2,
          short_axis: 4.3,
          long_axis_vertebrae: 6.2,
          short_axis_vertebrae: 4.3,
        },
        clinical_classification: {
          classification: 'normal',
          severity: 'none',
          confidence: 'high',
          recommendation: 'Tamaño cardíaco normal',
          clinical_notes: ['Corazón dentro de límites normales'],
        },
        metadata: {},
        processing_time_ms: 245.67,
      };

      service.analyzeRadiograph(mockFile, { includeOverlay: true }).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(response.success).toBe(true);
          expect(response.vhs_measurements.vhs_score).toBe(10.5);
          done();
        },
        error: () => fail('should not fail'),
      });

      const req = httpMock.expectOne(
        `${apiUrl}/vhs/analyze?includeOverlay=true`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      req.flush(mockResponse);
    });

    it('should handle 400 error (invalid file)', (done) => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      service.analyzeRadiograph(mockFile).subscribe({
        next: () => fail('should not succeed'),
        error: (error: Error) => {
          expect(error.message).toContain('formato inválido');
          done();
        },
      });

      const req = httpMock.expectOne((r) =>
        r.url.includes('/vhs/analyze')
      );
      req.flush(
        { success: false, error: 'Invalid file type' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should handle 429 rate limit error', (done) => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      service.analyzeRadiograph(mockFile).subscribe({
        next: () => fail('should not succeed'),
        error: (error: Error) => {
          expect(error.message).toBe(VHS_ERROR_MESSAGES.RATE_LIMIT);
          done();
        },
      });

      const req = httpMock.expectOne((r) =>
        r.url.includes('/vhs/analyze')
      );
      req.flush(null, { status: 429, statusText: 'Too Many Requests' });
    });

    it('should handle 503 service unavailable', (done) => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      service.analyzeRadiograph(mockFile).subscribe({
        next: () => fail('should not succeed'),
        error: (error: Error) => {
          expect(error.message).toBe(VHS_ERROR_MESSAGES.SERVICE_UNAVAILABLE);
          done();
        },
      });

      const req = httpMock.expectOne((r) =>
        r.url.includes('/vhs/analyze')
      );
      req.flush(null, { status: 503, statusText: 'Service Unavailable' });
    });

    it('should throw error when no file provided', (done) => {
      service.analyzeRadiograph(null as any).subscribe({
        next: () => fail('should not succeed'),
        error: (error: Error) => {
          expect(error.message).toBe(VHS_ERROR_MESSAGES.NO_FILE);
          done();
        },
      });
    });
  });

  describe('validateFile', () => {
    it('should validate correct JPEG file', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const result = service.validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should reject file too large', () => {
      const largeContent = new Array(11 * 1024 * 1024).fill('a').join('');
      const file = new File([largeContent], 'large.jpg', {
        type: 'image/jpeg',
      });
      const result = service.validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'El archivo excede el tamaño máximo de 10MB'
      );
    });

    it('should reject invalid file type', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = service.validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject empty file', () => {
      const file = new File([], 'empty.jpg', { type: 'image/jpeg' });
      const result = service.validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('El archivo está vacío');
    });
  });

  describe('checkHealth', () => {
    it('should check backend health', (done) => {
      const mockHealth = { status: 'healthy', timestamp: '2025-01-08T12:00:00Z' };

      service.checkHealth().subscribe({
        next: (health) => {
          expect(health.status).toBe('healthy');
          done();
        },
        error: () => fail('should not fail'),
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/health`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHealth);
    });
  });
});
