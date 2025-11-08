import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    expect(service.currentTheme()).toBe('light');
  });

  it('should toggle theme', () => {
    expect(service.currentTheme()).toBe('light');

    service.toggleTheme();
    expect(service.currentTheme()).toBe('dark');

    service.toggleTheme();
    expect(service.currentTheme()).toBe('light');
  });

  it('should set specific theme', () => {
    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');

    service.setTheme('light');
    expect(service.currentTheme()).toBe('light');
  });

  it('should persist theme in localStorage', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('vhs-theme')).toBe('dark');

    service.setTheme('light');
    expect(localStorage.getItem('vhs-theme')).toBe('light');
  });

  it('should apply dark class to document', () => {
    service.setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    service.setTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should return correct isDark value', () => {
    service.setTheme('light');
    expect(service.isDark()).toBe(false);

    service.setTheme('dark');
    expect(service.isDark()).toBe(true);
  });
});
