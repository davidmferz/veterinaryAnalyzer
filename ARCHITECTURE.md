# Arquitectura del Frontend VHS Analyzer

## 📐 Visión General

Este documento describe las decisiones arquitectónicas del frontend del sistema VHS Analyzer.

## 🎯 Principios de Diseño

### 1. Clean Architecture
- **Separación de responsabilidades** por capas
- **Core**: Servicios singleton, modelos, interceptores
- **Features**: Componentes específicos de funcionalidad
- **Shared**: Componentes reutilizables

### 2. SOLID Principles

#### Single Responsibility
Cada componente/servicio tiene una única responsabilidad:
- `VhsService`: Comunicación con backend
- `LoadingService`: Estado de carga
- `ThemeService`: Gestión de tema

#### Open/Closed
- Componentes abiertos a extensión mediante `@Input()` signals
- Cerrados a modificación mediante interfaces bien definidas

#### Liskov Substitution
- Uso de interfaces TypeScript para contratos
- Modelos que extienden interfaces base

#### Interface Segregation
- Interfaces específicas por caso de uso
- No interfaces monolíticas

#### Dependency Inversion
- Inyección de dependencias de Angular
- Servicios abstraídos mediante interfaces

### 3. DRY (Don't Repeat Yourself)
- Componentes shared reutilizables
- Servicios singleton
- Utilidades centralizadas

## 🏗️ Estructura por Capas

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Components + Templates)         │
├─────────────────────────────────────┤
│         Application Layer           │
│      (Services + State)             │
├─────────────────────────────────────┤
│         Domain Layer                │
│      (Models + Interfaces)          │
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│  (HTTP + Interceptors + External)   │
└─────────────────────────────────────┘
```

### Presentation Layer
**Ubicación**: `src/app/features/`, `src/app/shared/components/`

**Responsabilidades**:
- Renderizar UI
- Manejar interacción del usuario
- Delegar lógica a servicios
- Usar signals para reactividad

**Ejemplo**:
```typescript
@Component({
  selector: 'app-upload',
  standalone: true,
  // ...
})
export class UploadComponent {
  private readonly vhsService = inject(VhsService);
  selectedFile = signal<File | null>(null);

  analyzeRadiograph(): void {
    this.vhsService.analyzeRadiograph(/* ... */)
      .subscribe(/* ... */);
  }
}
```

### Application Layer
**Ubicación**: `src/app/core/services/`

**Responsabilidades**:
- Lógica de negocio
- Orquestación de operaciones
- Gestión de estado
- Comunicación entre componentes

**Ejemplo**:
```typescript
@Injectable({ providedIn: 'root' })
export class VhsService {
  private readonly http = inject(HttpClient);

  analyzeRadiograph(file: File): Observable<VhsResponse> {
    // Lógica de análisis
  }
}
```

### Domain Layer
**Ubicación**: `src/app/core/models/`

**Responsabilidades**:
- Definir modelos de datos
- Interfaces y tipos
- Constantes de dominio
- Validaciones de negocio

**Ejemplo**:
```typescript
export interface VhsResponse {
  success: boolean;
  vhs_measurements: VhsMeasurements;
  // ...
}
```

### Infrastructure Layer
**Ubicación**: `src/app/core/interceptors/`

**Responsabilidades**:
- Comunicación HTTP
- Logging
- Error handling
- Interacción con APIs externas

**Ejemplo**:
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(/* ... */)
  );
};
```

## 🔄 Flujo de Datos

### Upload Flow

```
Usuario selecciona archivo
        ↓
UploadComponent.handleFile()
        ↓
VhsService.validateFile()
        ↓
Usuario click "Analizar"
        ↓
UploadComponent.analyzeRadiograph()
        ↓
VhsService.analyzeRadiograph()
        ↓
HTTP POST /v1/vhs/analyze
        ↓
Interceptores (logging → loading → error)
        ↓
Backend procesa
        ↓
VhsResponse recibida
        ↓
UploadComponent emite analysisComplete
        ↓
AppComponent.onAnalysisComplete()
        ↓
Navega a ResultsComponent
```

### State Management Flow

```
Componente modifica Signal
        ↓
Signal.set(newValue)
        ↓
Angular detecta cambio
        ↓
Re-renderiza componente
        ↓
Computed signals se actualizan
        ↓
UI refleja nuevo estado
```

## 🎨 Patterns Utilizados

### 1. Dependency Injection
```typescript
export class UploadComponent {
  private readonly vhsService = inject(VhsService);
  // Inyección mediante inject() de Angular 19
}
```

### 2. Observer Pattern (RxJS)
```typescript
this.vhsService.analyzeRadiograph(file)
  .pipe(
    timeout(120000),
    retry({ count: 3 })
  )
  .subscribe({
    next: (response) => { /* ... */ },
    error: (error) => { /* ... */ }
  });
```

### 3. Facade Pattern
```typescript
// VhsService actúa como facade para el backend
export class VhsService {
  analyzeRadiograph() { /* ... */ }
  validateFile() { /* ... */ }
  checkHealth() { /* ... */ }
}
```

### 4. Strategy Pattern (Interceptors)
```typescript
// Diferentes estrategias de manejo HTTP
export const errorInterceptor = /* ... */;
export const loggingInterceptor = /* ... */;
export const loadingInterceptor = /* ... */;
```

### 5. Singleton Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Singleton automático de Angular
}
```

### 6. Reactive Programming (Signals)
```typescript
selectedFile = signal<File | null>(null);
vhsScore = computed(() => this.result().vhs_measurements.vhs_score);
```

## 🔐 Seguridad

### Input Validation
- Validación de tipo de archivo
- Validación de tamaño
- Sanitización de datos

### Output Encoding
- Base64 manejado de forma segura
- XSS prevention mediante Angular's sanitization

### HTTP Security
- CORS configurado
- Timeout de peticiones
- Rate limiting handling

## 🚀 Performance

### Optimizaciones Implementadas

1. **Lazy Loading**: Componentes standalone
2. **OnPush Change Detection**: Signals optimizan detección
3. **Tree Shaking**: Standalone components permiten mejor tree-shaking
4. **Image Optimization**: Canvas para renderizado eficiente
5. **Bundle Optimization**: Build de producción optimizado

### Métricas Objetivo

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90

## 📱 Responsive Strategy

### Mobile-First Approach
```scss
// Base: Mobile
.container { width: 100%; }

// Desktop: Override
@media (min-width: 1024px) {
  .container { width: 1024px; }
}
```

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

## 🧪 Testing Strategy

### Unit Tests
- Servicios: 100% coverage objetivo
- Componentes: Lógica crítica
- Interceptores: Todos los casos

### Integration Tests
- Flujo completo de upload
- Flujo completo de resultados

### E2E Tests (Futuro)
- Cypress para flujos de usuario

## 🔮 Escalabilidad Futura

### Preparado para:
1. **Micro-frontends**: Arquitectura modular
2. **State Management Complejo**: Fácil migración a NgRx si necesario
3. **Internacionalización**: Estructura preparada para i18n
4. **PWA**: Service workers fáciles de añadir
5. **SSR**: Compatible con Angular Universal

## 📊 Diagramas

### Component Tree
```
AppComponent
├── GlobalLoadingComponent
├── MatToolbar
└── Main Content
    ├── UploadComponent
    │   ├── LoadingSpinnerComponent
    │   └── ErrorMessageComponent
    └── ResultsComponent
        ├── ImageViewerComponent
        └── Clinical Cards
```

### Service Dependency Graph
```
AppComponent
    ↓
UploadComponent → VhsService → HttpClient
    ↓                  ↓
ThemeService    LoadingService
```

## 🎓 Referencias

- [Angular Architecture Guide](https://angular.io/guide/architecture)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Angular Signals](https://angular.io/guide/signals)

---

**Última actualización**: Enero 2025
