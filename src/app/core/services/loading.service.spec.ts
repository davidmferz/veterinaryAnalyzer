import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with isLoading false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should show loading when show is called', () => {
    service.show();
    expect(service.isLoading()).toBe(true);
  });

  it('should hide loading when hide is called after one show', () => {
    service.show();
    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should handle multiple concurrent requests', () => {
    service.show(); // Request 1
    service.show(); // Request 2
    expect(service.isLoading()).toBe(true);

    service.hide(); // Request 1 completes
    expect(service.isLoading()).toBe(true); // Still loading (request 2)

    service.hide(); // Request 2 completes
    expect(service.isLoading()).toBe(false); // All complete
  });

  it('should not go negative on extra hide calls', () => {
    service.hide();
    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should reset correctly', () => {
    service.show();
    service.show();
    service.show();

    service.reset();
    expect(service.isLoading()).toBe(false);
  });
});
