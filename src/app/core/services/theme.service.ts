import { Injectable, signal, effect } from '@angular/core';

/**
 * Tipo de tema
 */
export type Theme = 'light' | 'dark';

/**
 * Servicio para gestionar el tema de la aplicación (claro/oscuro)
 * Persiste la preferencia en localStorage
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'vhs-theme';

  // Signal para el tema actual
  public readonly currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Effect para aplicar cambios de tema al DOM
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
    });
  }

  /**
   * Obtiene el tema inicial desde localStorage o preferencias del sistema
   */
  private getInitialTheme(): Theme {
    // Primero verificar localStorage
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }

    // Si no hay tema guardado, usar preferencia del sistema
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Aplica el tema al documento y lo persiste
   */
  private applyTheme(theme: Theme): void {
    const htmlElement = document.documentElement;

    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    // Persistir en localStorage
    localStorage.setItem(this.THEME_KEY, theme);
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(newTheme);
  }

  /**
   * Establece un tema específico
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  /**
   * Retorna true si el tema actual es oscuro
   */
  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }
}
