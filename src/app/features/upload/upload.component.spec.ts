import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UploadComponent } from './upload.component';
import { VhsService } from '@core/services/vhs.service';
import { of, throwError } from 'rxjs';
import { VhsResponse } from '@core/models';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let vhsService: jasmine.SpyObj<VhsService>;

  const mockVhsResponse: VhsResponse = {
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

  beforeEach(async () => {
    const vhsServiceSpy = jasmine.createSpyObj('VhsService', [
      'analyzeRadiograph',
      'validateFile',
      'createImagePreview',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        UploadComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: VhsService, useValue: vhsServiceSpy }],
    }).compileComponents();

    vhsService = TestBed.inject(VhsService) as jasmine.SpyObj<VhsService>;
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate file on selection', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    vhsService.validateFile.and.returnValue({ valid: true, errors: [] });
    vhsService.createImagePreview.and.returnValue(
      Promise.resolve('data:image/jpeg;base64,test')
    );

    component['handleFile'](mockFile);

    expect(vhsService.validateFile).toHaveBeenCalledWith(mockFile);
    expect(component.selectedFile()).toBe(mockFile);
  });

  it('should show validation errors for invalid file', () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    vhsService.validateFile.and.returnValue({
      valid: false,
      errors: ['Invalid file type'],
    });

    component['handleFile'](mockFile);

    expect(component.validationErrors().length).toBeGreaterThan(0);
    expect(component.selectedFile()).toBeNull();
  });

  it('should analyze radiograph successfully', (done) => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    component.selectedFile.set(mockFile);
    vhsService.analyzeRadiograph.and.returnValue(of(mockVhsResponse));

    let emitted = false;
    component.analysisComplete.subscribe((result) => {
      expect(result).toEqual(mockVhsResponse);
      emitted = true;
      done();
    });

    component.analyzeRadiograph();

    expect(vhsService.analyzeRadiograph).toHaveBeenCalled();
    expect(emitted).toBe(true);
  });

  it('should handle analysis error', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    component.selectedFile.set(mockFile);
    vhsService.analyzeRadiograph.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.analyzeRadiograph();

    expect(component.error()).toBe('Network error');
    expect(component.isAnalyzing()).toBe(false);
  });

  it('should clear file', () => {
    component.selectedFile.set(
      new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    );
    component.previewUrl.set('data:image/jpeg;base64,test');

    component.clearFile();

    expect(component.selectedFile()).toBeNull();
    expect(component.previewUrl()).toBeNull();
    expect(component.error()).toBeNull();
  });

  it('should format file size correctly', () => {
    expect(component.formatFileSize(500)).toBe('500 B');
    expect(component.formatFileSize(1024)).toBe('1.00 KB');
    expect(component.formatFileSize(1024 * 1024)).toBe('1.00 MB');
  });
});
