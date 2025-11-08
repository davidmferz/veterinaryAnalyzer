# Prompt para Claude – Frontend Angular 19 Ultra-Profesional, Responsive y Optimizado  
**Basado en la documentación completa del backend y en los casos de uso reales**

---

# 🎯 Rol para Claude
Actúa como un **Senior Frontend Engineer experto en Angular 19, UX médico, accesibilidad, arquitectura limpia, performance web y buenas prácticas OWASP**.  
Tu misión es construir un **frontend completo en Angular 19**, totalmente responsive, accesible, moderno, fácil de usar y que consuma correctamente el backend **VHS Analyzer** documentado.

---

# ✅ Objetivo General
Generar un **proyecto Angular 19 real**, no pseudocódigo, con:

- Diseño **moderno tipo dashboard médico**
- **100% responsive** (desktop, tablet, móvil)
- Angular standalone components  
- Signals para manejo de estado  
- Angular Material + TailwindCSS  
- Arquitectura limpia y desacoplada  
- Buenas prácticas (AA/AAA, OWASP, Clean Architecture)
- Código fuertemente tipado  
- Loading states, errores elegantes, UX clara  
- Consumo perfecto del backend  
- Secciones separadas: Upload → Resultados  
- Sistema de theming (modo claro/oscuro)

---

# ✅ Reglas estrictas del proyecto
- Angular 19 standalone only  
- Tailwind + Angular Material  
- Signals, no NgRx  
- Tipado fuerte con interfaces  
- Servicios desacoplados  
- Testing obligatorio  
- Accesibilidad WCAG 2.1 AA  
- UI intuitiva para estudiantes de veterinaria  
- No inventar endpoints  
- Usar exclusivamente el backend ya documentado  
- Mostrar overlay (base64) con zoom y pan  
- No omitir archivos  
- Proyecto totalmente ejecutable con:

```
npm install
ng serve --open
```

---

# ✅ Endpoints REALES del backend para consumir

### **POST /v1/vhs/analyze**

- multipart/form-data  
- Campos:
  - file (obligatorio)
  - includeOverlay (query param `true|false`)

### **GET /health**

---

# ✅ Requerimientos funcionales completos

## ✅ 1. Pantalla: “Subir radiografía”
Debe incluir:

- Drag & Drop + botón seleccionar
- Validación (tipo, tamaño, imagen mínima)
- Vista previa antes de enviar
- Toggle “Incluir overlay”
- Botón "Analizar"
- Loading con backdrop
- Al recibir respuesta:
  - VHS score
  - Long axis, short axis
  - Clasificación clínica
  - Lista de notas clínicas
  - Overlay si se solicitó

Formato del backend basado en la documentación:

```
{
  "success": true,
  "keypoints": [[x,y], ...],
  "vhs_measurements": {...},
  "clinical_classification": {...},
  "overlay_image": "base64...",
  "processing_time_ms": 245.67
}
```

---

# ✅ 2. Pantalla: “Resultados del análisis”
Debe mostrar:

- Tarjeta grande con VHS Score
- Tarjeta de clasificación (normal, borderline, cardiomegaly)
- Tarjeta de severidad
- Tabla con medidas
- Lista de clinical_notes
- Imagen overlay con:
  - Zoom
  - Pan
  - Reset view
- Tooltip del tiempo de procesamiento

---

# ✅ 3. Servicio HTTP (VhsService)

Implementación requerida:

```ts
analyzeRadiograph(file: File, includeOverlay: boolean): Observable<VhsResponse>
```

Con manejo de:

- timeout
- retry si 503 o 429
- errores del servidor
- errores de red

Basado en los casos de integración del backend.

---

# ✅ 4. Manejo avanzado de errores
Debe mostrar errores claros como:

- “No se seleccionó archivo”
- “El backend rechazó el archivo: formato inválido”
- “Archivo mayor a 10MB”
- “Rate limit excedido (429) – intenta en unos segundos”
- “Servicio temporalmente no disponible (503)”
- “Error inesperado, revisa tu conexión”

---

# ✅ 5. Interceptores obligatorios
- ErrorInterceptor → manejo elegante
- LoggingInterceptor → logs en consola dev
- RetryInterceptor → reintentos automáticos para 503 y 429
- LoadingInterceptor → mostrar spinner global

---

# ✅ 6. Frontend inspirado en los ejemplos reales de uso
Analiza profundamente:

✅ Los cURL  
✅ Las llamadas Python con retry  
✅ Las llamadas JS  
✅ Los modelos exactos del backend  
✅ El manejo de base64 del overlay  
✅ Los casos de uso de integración (Flask, Express, React)

Debes construir un frontend **que sea compatible con TODAS las variantes de uso real**.

---

# ✅ 7. Modelos TypeScript exactos (basados en documentación)

```ts
export interface VhsResponse {
  success: boolean;
  keypoints: number[][];
  vhs_measurements: {
    vhs_score: number;
    long_axis: number;
    short_axis: number;
    long_axis_vertebrae: number;
    short_axis_vertebrae: number;
  };
  clinical_classification: {
    classification: 'normal' | 'borderline' | 'cardiomegaly';
    severity: 'none' | 'mild' | 'moderate' | 'severe';
    confidence: 'low' | 'medium' | 'high';
    recommendation: string;
    clinical_notes: string[];
  };
  metadata: any;
  overlay_image?: string;
  processing_time_ms: number;
  error?: string;
}
```

---

# ✅ 8. Estructura del proyecto Angular a generar

```
src/
 ├─ app/
 │   ├─ core/
 │   │   ├─ interceptors/
 │   │   ├─ services/
 │   │   ├─ guards/
 │   ├─ shared/
 │   │   ├─ components/
 │   │   └─ directives/
 │   ├─ features/
 │   │   ├─ upload/
 │   │   ├─ results/
 │   ├─ app.config.ts
 │   └─ main.ts
 ├─ assets/
 └─ environments/
```

---

# ✅ 9. UX avanzada
- Mobile-first  
- Swipe friendly  
- Cards respirables  
- Tipografía clara tipo médico  
- Botones grandes  
- Colores profesionales  
- Skeleton loading  
- Microinteracciones (hover, focus, active)  
- Transiciones suaves  
- Empty states  

---

# ✅ 10. Testing obligatorio
- Unit tests de componentes  
- Unit test del servicio  
- Test del interceptor retry  
- Test de escenarios de error del backend  

---

# ✅ 11. README que debe generar Claude
Debe incluir:

```
npm install
ng serve --open
npm run build
```

Además:

- Cómo configurar environments  
- Cómo consumir el backend  
- Screenshots generados por Claude  
- Posibles errores y soluciones  
- Bitácora de decisiones arquitectónicas  

---

# ✅ 12. Instrucciones finales para Claude
Debes entregar:

✅ Proyecto Angular completo  
✅ Archivos reales, no pseudocódigo  
✅ Código ejecutable  
✅ Arquitectura limpia  
✅ Responsive total  
✅ Documentación detallada  
✅ Ejemplos de uso  
✅ UI elegante para estudiantes veterinarios  

---

Fin del prompt.
