# 🏫 SIGU - Sistema Integral de Gestión Universitaria

## 📋 Descripción
Sistema web para la gestión de procesos universitarios como inscripciones, materias y programas académicos.

**Frontend:** Angular 20
**Backend:** .NET 8 Web API
**Base de datos:** SQLite

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior) instalado
- Angular CLI: `npm install -g @angular/cli`
- Git instalado

### Pasos para ejecutar:

1. **Descargar el proyecto**
   ```bash
   git clone https://github.com/swildcast/sigu_frontend.git
   cd sigu_frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar el backend**
   - Asegúrate de que el backend .NET esté corriendo en `https://localhost:7084/api`
   - Si es necesario, actualiza la URL en `src/environments/environment.ts`

4. **Ejecutar la aplicación**
   ```bash
   npm start
   ```
   La aplicación estará disponible en `http://localhost:4200`

## 📖 Uso de la Aplicación

### Navegación
- **Inscripciones**: Gestión de inscripciones de estudiantes
- **Materias**: Administración de materias académicas
- **Programas**: Gestión de programas de estudio

### Funcionalidades Principales
- **CRUD completo** para Materias y Programas
- **Interfaz responsiva** con Bootstrap
- **Validación de formularios**
- **Integración con API REST**

## 🛠️ Desarrollo

### Estructura del Proyecto
```
src/
├── app/
│   ├── components/          # Componentes de la aplicación
│   │   ├── inscription-list/
│   │   ├── materia-list/
│   │   └── programa-list/
│   ├── services/            # Servicios para API
│   │   ├── inscription.service.ts
│   │   ├── materia.ts
│   │   └── programa.ts
│   ├── core/                # Configuración central
│   ├── modules/             # Módulos de la aplicación
│   ├── app.routes.ts        # Configuración de rutas
│   └── app.config.ts        # Configuración de la app
├── environments/            # Configuraciones por entorno
└── styles.scss              # Estilos globales
```

### Comandos Disponibles
```bash
# Desarrollo
npm start                    # Inicia servidor de desarrollo
npm run build               # Construye para producción
npm run watch               # Construye y vigila cambios
npm test                    # Ejecuta tests

# Generación de código
ng generate component        # Crea nuevo componente
ng generate service          # Crea nuevo servicio
ng generate module           # Crea nuevo módulo
```

### Configuración de API
La configuración de la API se encuentra en `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7084/api'
};
```

## 🧪 Testing
```bash
npm test
```
Los tests están configurados con Karma y Jasmine.

## 📦 Despliegue
```bash
npm run build
```
Los archivos de producción se generan en la carpeta `dist/`.

## 🤝 Contribución
1. Haz fork del proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/IncreibleFuncionalidad`)
3. Confirma tus cambios (`git commit -m 'Agrega alguna IncreibleFuncionalidad'`)
4. Sube a la rama (`git push origin feature/IncreibleFuncionalidad`)
5. Abre un Pull Request

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto
- **Autor**: [Tu Nombre]
- **Email**: tu.email@ejemplo.com
- **GitHub**: [https://github.com/swildcast](https://github.com/swildcast)
