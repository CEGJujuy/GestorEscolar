# 🎓 GestorEscolar - Plataforma Educativa

Una plataforma educativa completa diseñada específicamente para institutos secundarios, que facilita la gestión académica y administrativa con una interfaz moderna y funcional.

## 📋 Descripción

GestorEscolar es una solución integral que permite a directores, docentes y familias gestionar eficientemente todos los aspectos académicos de un instituto secundario. La plataforma ofrece herramientas para el registro de estudiantes, seguimiento de calificaciones, control de asistencias, comunicación con padres y gestión de recursos educativos.

## ✨ Características Principales

### 🎯 Módulos Funcionales

- **📚 Registro de Alumnos**: Gestión completa de información estudiantil
- **📊 Carga de Notas**: Sistema de calificaciones por materia y trimestre
- **✅ Control de Asistencias**: Registro diario con estadísticas
- **📱 Notificaciones**: Comunicación directa con padres y familias
- **📅 Calendario**: Gestión de actividades y eventos escolares
- **📖 Materiales**: Biblioteca digital de recursos por curso

### 👥 Perfiles de Usuario

#### 🏛️ **Director**
- Acceso completo a todos los módulos
- Gestión de estudiantes y personal docente
- Reportes y estadísticas institucionales
- Configuración del sistema

#### 👨‍🏫 **Docente**
- Gestión de cursos asignados
- Carga de notas y asistencias
- Subida de materiales educativos
- Comunicación con familias

#### 👨‍👩‍👧‍👦 **Familia**
- Consulta de información de hijos
- Acceso a notas y asistencias
- Recepción de notificaciones
- Descarga de materiales

### 📊 Reportes y Documentos

- **📄 Boletines de Calificaciones**: Generación automática en PDF
- **📈 Reportes de Asistencia**: Estadísticas mensuales
- **📋 Informes Académicos**: Análisis de rendimiento
- **📊 Dashboard Interactivo**: Métricas en tiempo real

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de estilos utilitarios
- **Vite** - Herramienta de construcción rápida
- **React Router** - Navegación entre páginas
- **React Hook Form** - Gestión de formularios
- **Yup** - Validación de esquemas

### Backend y Base de Datos
- **Supabase** - Backend como servicio
- **PostgreSQL** - Base de datos relacional
- **Row Level Security (RLS)** - Seguridad a nivel de fila
- **Supabase Auth** - Sistema de autenticación

### Librerías Adicionales
- **Lucide React** - Iconos modernos
- **jsPDF** - Generación de documentos PDF
- **html2canvas** - Captura de elementos HTML
- **date-fns** - Manipulación de fechas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/gestor-escolar.git
cd gestor-escolar
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Configurar Base de Datos

#### Opción A: Usar el botón "Connect to Supabase" en la interfaz
1. Inicia la aplicación: `npm run dev`
2. Haz clic en "Connect to Supabase" en la esquina superior derecha
3. Las tablas se crearán automáticamente

#### Opción B: Configuración manual
1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones SQL desde la carpeta `supabase/migrations`
3. Configura las políticas de Row Level Security

### 5. Iniciar la Aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
gestor-escolar/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── Auth/          # Autenticación
│   │   ├── Dashboard/     # Panel principal
│   │   ├── Students/      # Gestión de estudiantes
│   │   ├── Grades/        # Calificaciones
│   │   ├── Attendance/    # Asistencias
│   │   ├── Notifications/ # Notificaciones
│   │   ├── Calendar/      # Calendario
│   │   ├── Materials/     # Materiales
│   │   └── Layout/        # Componentes de diseño
│   ├── contexts/          # Contextos de React
│   ├── lib/               # Configuraciones
│   ├── types/             # Tipos de TypeScript
│   ├── utils/             # Utilidades
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Punto de entrada
├── supabase/
│   └── migrations/        # Migraciones de base de datos
└── package.json
```

## 🎨 Guía de Diseño

### Paleta de Colores
- **Primario**: Azul (#3b82f6)
- **Secundario**: Gris (#6b7280)
- **Fondo**: Blanco (#ffffff)
- **Texto**: Gris oscuro (#1f2937)
- **Éxito**: Verde (#10b981)
- **Advertencia**: Amarillo (#f59e0b)
- **Error**: Rojo (#ef4444)

### Tipografía
- **Fuente Principal**: Inter
- **Tamaños**: 12px, 14px, 16px, 18px, 24px, 32px
- **Pesos**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 👤 Usuarios de Prueba

### Director
- **Email**: director@instituto.edu
- **Contraseña**: director123

### Docente
- **Email**: docente@instituto.edu
- **Contraseña**: docente123

### Familia
- **Email**: familia@instituto.edu
- **Contraseña**: familia123

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de producción
npm run preview

# Linting
npm run lint

# Formateo de código
npm run format
```

## 📊 Base de Datos

### Tablas Principales

- **users**: Usuarios del sistema
- **students**: Información de estudiantes
- **courses**: Cursos y materias
- **grades**: Calificaciones
- **attendance**: Registros de asistencia
- **notifications**: Notificaciones
- **events**: Eventos del calendario
- **materials**: Materiales educativos

### Relaciones
- Un estudiante puede tener múltiples calificaciones
- Un curso puede tener múltiples estudiantes
- Las notificaciones se envían a usuarios específicos
- Los materiales están asociados a cursos

## 🔐 Seguridad

- **Autenticación**: Supabase Auth con email/contraseña
- **Autorización**: Row Level Security (RLS) en todas las tablas
- **Validación**: Validación tanto en frontend como backend
- **Sanitización**: Limpieza de datos de entrada

## 🌐 Integración con WhatsApp

La plataforma está preparada para integración con WhatsApp Business API:

1. **Configuración**: Agregar credenciales de WhatsApp Business API
2. **Webhooks**: Endpoint para recibir mensajes
3. **Plantillas**: Mensajes predefinidos para notificaciones
4. **Envío Masivo**: Notificaciones a grupos de padres

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Componentes Adaptativos**: Sidebar colapsable, tablas responsivas

## 🚀 Despliegue

### Netlify (Recomendado)
```bash
npm run build
# Subir la carpeta dist/ a Netlify
```

### Vercel
```bash
npm run build
vercel --prod
```

### Servidor Propio
```bash
npm run build
# Servir la carpeta dist/ con nginx o apache
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: soporte@gestorescolar.com
- **Documentación**: [docs.gestorescolar.com](https://docs.gestorescolar.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/gestor-escolar/issues)

## 🔄 Roadmap

### Versión 2.0
- [ ] Aplicación móvil nativa
- [ ] Integración con Google Classroom
- [ ] Sistema de videoconferencias
- [ ] Módulo de biblioteca física
- [ ] Sistema de pagos online

### Versión 2.1
- [ ] Inteligencia artificial para análisis predictivo
- [ ] Chatbot de soporte
- [ ] Integración con sistemas de transporte escolar
- [ ] Módulo de salud estudiantil

---

**Desarrollado con ❤️ para la educación**