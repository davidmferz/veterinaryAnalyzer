# VHS Analyzer Frontend

> Sistema profesional de análisis VHS (Vertebral Heart Score) para radiografías veterinarias - Frontend Angular 19

![Angular](https://img.shields.io/badge/Angular-19-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)
![Material](https://img.shields.io/badge/Material-19-purple?logo=material-design)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Deployment en AWS EC2](#-deployment-en-aws-ec2)
- [Arquitectura](#-arquitectura)
- [Testing](#-testing)
- [Decisiones Técnicas](#-decisiones-técnicas)
- [Troubleshooting](#-troubleshooting)
- [Contribuir](#-contribuir)

## ✨ Características

### Funcionalidades Core

- ✅ **Subida de radiografías** con drag & drop
- ✅ **Análisis VHS automatizado** mediante backend
- ✅ **Visualización de resultados** con métricas detalladas
- ✅ **Overlay interactivo** con zoom y pan
- ✅ **Clasificación clínica** automática (normal, borderline, cardiomegaly)
- ✅ **Exportación de resultados** en JSON
- ✅ **Descarga de overlay** como imagen PNG

### Características Técnicas

- ✅ **Angular 19** con standalone components
- ✅ **Signals** para manejo de estado reactivo
- ✅ **TypeScript** fuertemente tipado
- ✅ **Tailwind CSS** + Angular Material para UI moderna
- ✅ **Responsive design** (mobile-first)
- ✅ **Modo claro/oscuro** persistente
- ✅ **Interceptores HTTP** para logging, loading y errors
- ✅ **Retry automático** para 503 y 429
- ✅ **Accesibilidad WCAG 2.1 AA**
- ✅ **Testing unitario** con Jasmine/Karma

## 📦 Requisitos Previos

- **Node.js**: v18.x o superior
- **npm**: v9.x o superior
- **Angular CLI**: v19.x (se instala automáticamente)
- **Backend VHS Analyzer**: debe estar corriendo (ver configuración)

## 🚀 Instalación

### 1. Clonar o usar el proyecto

```bash
cd /Volumes/SATECHI/DATASET/frontEnd
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando instalará:

- Angular 19 y sus dependencias
- Angular Material 19
- TailwindCSS 3.4
- Todas las dev dependencies

### 3. Verificar instalación

```bash
ng version
```

Deberías ver Angular CLI 19.x y Angular 19.x

## ⚙️ Configuración

### Configurar URL del Backend

Edita el archivo de environment según tu entorno:

**Desarrollo**: `src/environments/environment.development.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000', // Cambiar si el backend está en otra URL
  apiVersion: 'v1',
  enableLogging: true,
  requestTimeout: 120000,
  retryAttempts: 3,
  retryDelay: 2000,
};
```

**Producción**: `src/environments/environment.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.vhs-analyzer.com', // URL del backend en producción
  apiVersion: 'v1',
  enableLogging: false,
  requestTimeout: 120000,
  retryAttempts: 2,
  retryDelay: 3000,
};
```

## 🎯 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start
# o
ng serve

# Abrir automáticamente el navegador
ng serve --open
```

La aplicación estará disponible en: `http://localhost:4200`

### Producción Local

```bash
# Build de producción
npm run build:prod

# Los archivos compilados estarán en dist/vhs-analyzer-frontend/browser/
```

### Testing

```bash
# Ejecutar tests unitarios
npm test
# o
ng test

# Ejecutar tests con cobertura
ng test --code-coverage
```

## 🚀 Deployment en AWS EC2

### Guía Rápida

Para deployar en AWS EC2 Ubuntu, sigue estos pasos:

1. **Lee la guía completa**: [`DEPLOYMENT.md`](DEPLOYMENT.md)
2. **Sigue el checklist**: [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)
3. **Revisa la arquitectura**: [`ARCHITECTURE.md`](ARCHITECTURE.md)

### Scripts Disponibles

- `setup-ec2.sh` - Configuración inicial de la instancia EC2
- `deploy.sh` - Script de deployment automático
- `create-backend-service.sh` - Crear servicio systemd para el backend
- `test-deployment.sh` - Probar que el deployment funcione

### Pasos Resumidos

```bash
# 1. En EC2, configurar el servidor
./setup-ec2.sh

# 2. Clonar el proyecto
git clone tu-repositorio.git
cd tu-repositorio

# 3. Actualizar variables de entorno
# Edita src/environments/environment.ts con tu IP de EC2

# 4. Deployar
./deploy.sh

# 5. Probar
./test-deployment.sh TU_IP_EC2
```

Ver documentación completa en [DEPLOYMENT.md](DEPLOYMENT.md)

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Módulo core (singleton services)
│   │   ├── interceptors/        # HTTP interceptors
│   │   │   ├── error.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   └── loading.interceptor.ts
│   │   ├── models/              # TypeScript interfaces
│   │   │   └── vhs-response.model.ts
│   │   └── services/            # Singleton services
│   │       ├── vhs.service.ts
│   │       ├── loading.service.ts
│   │       └── theme.service.ts
│   ├── features/                # Feature modules
│   │   ├── upload/              # Upload feature
│   │   │   ├── upload.component.ts
│   │   │   ├── upload.component.html
│   │   │   └── upload.component.scss
│   │   └── results/             # Results feature
│   │       ├── results.component.ts
│   │       ├── results.component.html
│   │       ├── results.component.scss
│   │       └── components/
│   │           └── image-viewer/ # Zoom/Pan viewer
│   ├── shared/                  # Shared components
│   │   └── components/
│   │       ├── loading-spinner/
│   │       ├── error-message/
│   │       ├── empty-state/
│   │       └── global-loading/
│   ├── app.component.ts         # Root component
│   └── app.config.ts            # App configuration
├── environments/                # Environment configs
├── styles.scss                  # Global styles
└── main.ts                      # Bootstrap
```

### Flujo de Datos

```
Usuario → Upload Component
           ↓
        VhsService → Backend API (POST /v1/vhs/analyze)
           ↓
        Interceptors (logging, loading, error)
           ↓
        Results Component → Image Viewer (zoom/pan)
           ↓
        Exportación / Descarga
```

### Modelos TypeScript

Los modelos están definidos exactamente según la documentación del backend:

```typescript
interface VhsResponse {
  success: boolean;
  keypoints: number[][];
  vhs_measurements: VhsMeasurements;
  clinical_classification: ClinicalClassification;
  metadata: VhsMetadata;
  overlay_image?: string;
  processing_time_ms: number;
  error?: string;
}
```

Ver archivo completo: [`src/app/core/models/vhs-response.model.ts`](src/app/core/models/vhs-response.model.ts)

## 🧪 Testing

### Cobertura Actual

- ✅ **VhsService**: Tests completos de análisis, validación y manejo de errores
- ✅ **LoadingService**: Tests de conteo de peticiones
- ✅ **ThemeService**: Tests de persistencia y aplicación de tema
- ✅ **UploadComponent**: Tests de validación, análisis y manejo de archivos

### Ejecutar Tests

```bash
# Watch mode (recomendado para desarrollo)
ng test

# Single run
ng test --watch=false

# Con cobertura
ng test --code-coverage

# Ver reporte de cobertura
open coverage/vhs-analyzer-frontend/index.html
```

## 🎨 Theming

### Modo Claro/Oscuro

El tema se gestiona mediante:

- **Signal reactivo** en `ThemeService`
- **localStorage** para persistencia
- **Clase CSS** `dark` en el `<html>`
- **Variables CSS** personalizadas

```typescript
// Alternar tema
themeService.toggleTheme();

// Establecer tema específico
themeService.setTheme('dark');

// Verificar tema actual
themeService.isDark(); // boolean
```

### Personalización de Colores

Edita [`tailwind.config.js`](tailwind.config.js):

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Tu paleta personalizada
      }
    }
  }
}
```

## 📱 Responsive Design

La aplicación está optimizada para:

- **Desktop**: ≥1024px (grid 3 columnas)
- **Tablet**: 768px - 1023px (grid 2 columnas)
- **Mobile**: <768px (stack vertical)

### Breakpoints de Tailwind

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## 🛡️ Seguridad

### Validaciones Implementadas

1. **Tipo de archivo**: Solo JPEG, JPG, PNG
2. **Tamaño máximo**: 10MB
3. **Validación de contenido**: FileReader antes de upload
4. **Sanitización**: Base64 manejado de forma segura
5. **CORS**: Configurado en interceptores

### Headers de Seguridad

Los interceptores añaden:

- Manejo de rate limiting (429)
- Timeout de peticiones (120s)
- Retry automático para 503

## 🔧 Decisiones Técnicas

### ¿Por qué Signals en lugar de NgRx?

- **Simplicidad**: Aplicación de tamaño medio, no necesita Redux
- **Performance**: Signals son más ligeros y rápidos
- **Nativo**: Built-in en Angular 19
- **Mantenibilidad**: Menos boilerplate

### ¿Por qué Standalone Components?

- **Angular 19**: Recomendación oficial
- **Tree-shaking**: Mejor optimización de bundle
- **Simplicidad**: No módulos innecesarios
- **Futuro**: Migración natural para nuevas versiones

### ¿Por qué Tailwind + Material?

- **Tailwind**: Utility-first, rápido desarrollo responsive
- **Material**: Componentes complejos (dialog, table, chips)
- **Complementarios**: Material para funcionalidad, Tailwind para layout

### ¿Por qué Interceptores Funcionales?

- **Angular 19**: Nueva API recomendada
- **Type-safety**: Mejor tipado que class-based
- **Composición**: Más fácil de combinar

## 🐛 Troubleshooting

### El backend no responde

```
Error: No se pudo conectar con el servidor
```

**Solución**:

1. Verificar que el backend esté corriendo: `http://localhost:8000/health`
2. Revisar la URL en `environment.development.ts`
3. Verificar CORS en el backend

### Error de compilación de Tailwind

```
Error: Cannot find module 'tailwindcss'
```

**Solución**:

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Tests fallan con HttpClient

```
NullInjectorError: No provider for HttpClient
```

**Solución**: Asegúrate de importar `HttpClientTestingModule` en los tests:

```typescript
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
});
```

### Material no se ve bien

**Solución**: Verifica que estés importando el tema en `styles.scss`:

```scss
@import '@angular/material/prebuilt-themes/azure-blue.css';
```

### El overlay no se muestra

**Solución**: Verifica que el toggle "Incluir overlay" esté activado antes de analizar.

## 🚀 Mejoras Futuras

- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Historial de análisis con IndexedDB
- [ ] Comparación side-by-side de radiografías
- [ ] Anotaciones manuales sobre overlay
- [ ] Exportación a PDF
- [ ] Integración con PACS

## 📄 Licencia

Este proyecto es parte del sistema VHS Analyzer para uso educativo y profesional en medicina veterinaria.

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para reportar bugs o solicitar features:

- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

---

**Desarrollado con ❤️ para estudiantes y profesionales de medicina veterinaria**
