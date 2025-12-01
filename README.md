# Sunstone - Discovery & GTM Platform

Una herramienta web completa para gestionar proyectos de Discovery y Go-To-Market, diseñada siguiendo las metodologías de trabajo de productos como Welalah, Welaw y Qualiaris.

## Características Principales

### 🏗️ Arquitectura del Producto
- **Workspace**: Gestión de clientes y proyectos
- **Proyecto**: Estructura modular por fases
- **Módulos**: Pantallas específicas para cada etapa del trabajo

### 📊 Módulos Implementados

#### Fase Discovery
1. **Intake**: Captura inicial de información con formularios estructurados
2. **JTBD**: Definición de Jobs to Be Done con sugerencias inteligentes
3. **Tensiones**: Matriz Push/Pull vs Inercia/Ansiedad
4. **Audiencias**: Buyer personas y clusters de clientes

#### Fase Estrategia
5. **Propuesta de Valor**: Mapeo de Valor/Diferencial/Features
6. **Narrativa**: Historia de marca guiada
7. **GTM & Funnels**: Estrategia de Go-To-Market
8. **Roadmap**: Priorización Kanban y Timeline
9. **Reportes**: Exportación a PDF, Notion y Slides

### 🎨 Características de UX
- **Diseño Moderno**: Interfaz limpia con paleta de colores profesional
- **Interactividad**: Drag & drop, modales, formularios dinámicos
- **Responsive**: Adaptado para diferentes tamaños de pantalla
- **Navegación Intuitiva**: Sidebar persistente y breadcrumbs

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript vanilla
- **Iconos**: Font Awesome 6
- **Fuentes**: Google Fonts (Inter)
- **Framework CSS**: Tailwind CSS

## Estructura de Archivos

```
/
├── index.html              # Home/Portfolio
├── main.js                 # JavaScript principal
├── project.html            # Project Overview
├── discovery-intake.html   # Discovery - Intake
├── discovery-jtbd.html     # Discovery - JTBD
├── discovery-tensiones.html # Discovery - Matriz de Tensiones
├── discovery-audiencias.html # Discovery - Audiencias
├── strategy-valor.html     # Estrategia - Propuesta de Valor
├── roadmap.html            # Roadmap (Kanban/Timeline)
├── reportes.html           # Reportes
└── README.md               # Este archivo
```

## Cómo Usar

### 1. Iniciar la Aplicación
Abre `index.html` en tu navegador web preferido.

### 2. Crear un Nuevo Proyecto
- Haz clic en "Nuevo proyecto" en la pantalla principal
- Completa el wizard de 3 pasos:
  1. Datos básicos del proyecto
  2. Objetivos de la intervención
  3. Scope y duración estimada

### 3. Navegar por los Módulos
Usa el sidebar izquierdo para acceder a los diferentes módulos:
- **Discovery**: Intake, JTBD, Tensiones, Audiencias
- **Estrategia**: Propuesta de Valor, Narrativa
- **GTM & Funnels**: Mapa de audiencias vs funnel
- **Roadmap**: Kanban y vista Timeline
- **Reportes**: Generación de documentos consolidados

### 4. Funcionalidades Clave por Módulo

#### Discovery - Intake
- Formularios colapsables por secciones
- Sistema de "Notas en vivo" para captura rápida
- Etiquetado de hipótesis vs datos confirmados

#### Discovery - JTBD
- Cards editables de Jobs to Be Done
- Sistema de relevancia (1-5 estrellas)
- Sugerencias basadas en patrones de la industria

#### Discovery - Matriz de Tensiones
- Matriz 2x2 interactiva (Push/Pull vs Inercia/Ansiedad)
- Selector de audiencias
- Agregado dinámico de elementos

#### Discovery - Audiencias
- Buyer personas completas con foto, datos y contexto
- Sistema de tipos (Decisor/Usuario/Influenciador)
- Timeline de madurez (Early adopter → Mainstream)
- Clusters de audiencia por tamaño y presupuesto

#### Estrategia - Propuesta de Valor
- Tres columnas: Valor/Diferencial/Features
- Sistema de conexiones entre elementos
- Sugerencias automáticas de alineación

#### Roadmap
- Vista Kanban con 3 columnas: Ahora/Próximo/Después
- Vista Timeline con barras de progreso
- Sistema de priorización Impacto/Complejidad
- Asignación de responsables y fechas

#### Reportes
- Constructor de reporte con checkboxes
- Vista previa dinámica
- Exportación a PDF, Notion y Google Slides
- Estadísticas de completitud

## Flujos de Trabajo Principales

### Flujo 1: Nuevo Cliente → Primer Entregable
1. Crear proyecto con wizard
2. Completar Intake (60-90 min)
3. Sistema sugiere JTBD basados en pains
4. Completar al menos 1 matriz de tensiones y 1 audiencia
5. Generar Discovery v0.1 desde Reportes

### Flujo 2: Discovery → Estrategia
1. Con JTBD y tensiones completos, pasar a Estrategia
2. Completar Propuesta de Valor
3. Desarrollar Narrativa estratégica
4. Sistema sugiere mensajes para funnel
5. Generar Documento de Estrategia v1

### Flujo 3: Estrategia → GTM & Roadmap
1. Asignar mensajes a etapas del funnel
2. Definir canales y materiales por audiencia
3. Priorizar iniciativas en Roadmap
4. Exportar Plan 90 días + roadmap

## Características Técnicas

### Almacenamiento
- Uso de localStorage para persistencia de datos
- Sistema de guardado automático
- Posibilidad de exportar/importar proyectos

### Interactividad
- Modales para creación/edición
- Sistema de notificaciones toast
- Drag & drop en elementos seleccionados
- Validación de formularios en tiempo real

### Diseño Responsivo
- Breakpoints para móvil, tablet y desktop
- Sidebar colapsable en pantallas pequeñas
- Cards adaptativas y contenido fluido

## Personalización

La aplicación está diseñada para ser fácilmente personalizable:

### Colores
Modifica las clases de Tailwind CSS para cambiar la paleta de colores:
- Primario: `indigo-600`
- Secundario: `gray-600`
- Éxito: `green-600`
- Advertencia: `yellow-600`
- Error: `red-600`

### Contenido
Todos los textos, placeholders y contenido de ejemplo pueden ser modificados directamente en los archivos HTML.

### Funcionalidad
El archivo `main.js` contiene toda la lógica de la aplicación y puede ser extendido con nuevas características.

## Próximas Mejoras Sugeridas

1. **Backend Integration**: Conectar con API para persistencia real
2. **Colaboración**: Sistema de comentarios y asignación de tareas
3. **Templates**: Plantillas predefinidas por industria
4. **Analytics**: Métricas de uso y completitud
5. **Mobile App**: Versión nativa para iOS/Android
6. **Integraciones**: Conectar con herramientas como Notion, Slack, etc.

## Créditos

Diseñado siguiendo las metodologías de:
- **Welalah**: Framework de Discovery
- **Welaw**: Metodología de JTBD y Tensiones
- **Qualiaris**: Sistema de Buyer Personas

Desarrollado con tecnologías web modernas y mejores prácticas de UX/UI.

---

**© 2025 Sunstone Platform - Todos los derechos reservados**