# Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto VHS Analyzer Frontend!

## 🚀 Cómo Empezar

### 1. Fork y Clone

```bash
git clone https://github.com/tu-usuario/vhs-analyzer-frontend.git
cd vhs-analyzer-frontend
npm install
```

### 2. Crear una Rama

```bash
git checkout -b feature/mi-nueva-funcionalidad
```

### 3. Hacer Cambios

- Sigue las convenciones de código
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación si es necesario

### 4. Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: añadir exportación a PDF"
git commit -m "fix: corregir zoom en Safari"
git commit -m "docs: actualizar README con nuevas features"
```

Tipos de commit:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan lógica)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

### 5. Push y Pull Request

```bash
git push origin feature/mi-nueva-funcionalidad
```

Luego crea un Pull Request en GitHub.

## 📋 Convenciones de Código

### TypeScript

```typescript
// ✅ Bueno
export class VhsService {
  private readonly http = inject(HttpClient);

  analyzeRadiograph(file: File): Observable<VhsResponse> {
    // ...
  }
}

// ❌ Malo
export class VhsService {
  constructor(private http: HttpClient) {} // Usar inject()

  analyzeRadiograph(file: any): any { // Tipar correctamente
    // ...
  }
}
```

### Componentes

```typescript
// ✅ Bueno - Standalone component con signals
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  // ...
})
export class MyComponent {
  data = signal<Data | null>(null);
}

// ❌ Malo - No standalone
@Component({
  selector: 'app-my-component',
  // ...
})
export class MyComponent {
  data: Data | null = null; // Usar signals
}
```

### Naming Conventions

- **Componentes**: PascalCase + Component suffix (`UploadComponent`)
- **Servicios**: PascalCase + Service suffix (`VhsService`)
- **Interfaces**: PascalCase (`VhsResponse`)
- **Signals**: camelCase (`selectedFile`)
- **Métodos**: camelCase (`analyzeRadiograph()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

## 🧪 Testing

### Escribir Tests

Cada nueva funcionalidad debe incluir tests:

```typescript
describe('VhsService', () => {
  it('should analyze radiograph successfully', (done) => {
    // Arrange
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    // Act
    service.analyzeRadiograph(mockFile).subscribe({
      next: (response) => {
        // Assert
        expect(response.success).toBe(true);
        done();
      }
    });
  });
});
```

### Ejecutar Tests

```bash
npm test                    # Watch mode
npm test -- --code-coverage # Con cobertura
```

## 📝 Documentación

### Comentarios JSDoc

```typescript
/**
 * Analiza una radiografía torácica y retorna el VHS score
 * @param file Archivo de imagen (JPEG, PNG)
 * @param options Opciones del análisis
 * @returns Observable con la respuesta del análisis
 */
analyzeRadiograph(file: File, options: VhsAnalysisOptions): Observable<VhsResponse> {
  // ...
}
```

### README

Si añades una nueva feature importante, actualiza el README.md con:
- Descripción de la feature
- Cómo usarla
- Screenshots si aplica

## 🎨 UI/UX Guidelines

### Responsive

```html
<!-- ✅ Bueno - Mobile first -->
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- ... -->
</div>

<!-- ❌ Malo - Desktop first -->
<div class="w-1/3 md:w-full">
  <!-- ... -->
</div>
```

### Accesibilidad

```html
<!-- ✅ Bueno -->
<button
  mat-raised-button
  aria-label="Analizar radiografía"
  (click)="analyze()"
>
  Analizar
</button>

<!-- ❌ Malo -->
<button (click)="analyze()">
  Analizar
</button>
```

### Material + Tailwind

```html
<!-- ✅ Bueno - Combinar correctamente -->
<mat-card class="card shadow-lg">
  <mat-card-content class="p-6">
    <!-- ... -->
  </mat-card-content>
</mat-card>

<!-- ❌ Malo - Sobrescribir estilos de Material -->
<mat-card style="padding: 24px !important">
  <!-- ... -->
</mat-card>
```

## 🔍 Code Review

Tu PR será revisado en base a:

1. **Funcionalidad**: ¿Funciona correctamente?
2. **Tests**: ¿Tiene tests adecuados?
3. **Código**: ¿Sigue las convenciones?
4. **Performance**: ¿Es eficiente?
5. **Accesibilidad**: ¿Es accesible?
6. **Documentación**: ¿Está documentado?

## 🐛 Reportar Bugs

Usa el template de issues de GitHub e incluye:

1. **Descripción** del bug
2. **Pasos para reproducir**
3. **Comportamiento esperado**
4. **Comportamiento actual**
5. **Screenshots** si aplica
6. **Entorno** (OS, navegador, versión)

## 💡 Proponer Features

Para proponer una nueva feature:

1. Abre un issue con el label "enhancement"
2. Describe el problema que resuelve
3. Propón una solución
4. Discute con el equipo antes de implementar

## ❓ Preguntas

Si tienes preguntas:
- Abre un issue con el label "question"
- Contacta al equipo de desarrollo

---

¡Gracias por contribuir! 🎉
