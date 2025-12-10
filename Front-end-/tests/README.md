# Pruebas Selenium - ResetMental Frontend

Este directorio contiene las pruebas automatizadas de Selenium para el frontend de ResetMental.

## Requisitos Previos

1. **Node.js** (versión 14 o superior)
2. **Navegador Chrome** o **Firefox** instalado
3. **Servidor de desarrollo corriendo** en `http://localhost:3000`

## Instalación

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
npm install
```

## Estructura de Pruebas

```
tests/
├── selenium/
│   ├── navigation.test.js      # Pruebas de navegación
│   ├── forms.test.js           # Pruebas de formularios (login/registro)
│   ├── functionality.test.js    # Pruebas de funcionalidades (bienestar, PQRS)
│   ├── accessibility.test.js   # Pruebas de accesibilidad
│   └── homepage.test.js        # Pruebas de la página principal
├── utils/
│   └── driver.js               # Configuración del WebDriver
└── screenshots/                # Screenshots de errores (se crea automáticamente)
```

## Ejecutar Pruebas

### Ejecutar todas las pruebas

```bash
npm test
```

### Ejecutar pruebas específicas

```bash
# Solo navegación
npm run test:navigation

# Solo formularios
npm run test:forms

# Solo funcionalidades
npm run test:functionality

# Solo accesibilidad
npm run test:accessibility

# Solo página principal
npm run test:homepage
```

### Ejecutar con Mocha directamente

```bash
# Todas las pruebas
npx mocha tests/selenium/**/*.test.js

# Una suite específica
npx mocha tests/selenium/navigation.test.js
```

## Configuración

### Cambiar navegador

Por defecto se usa Chrome. Para usar Firefox:

```bash
BROWSER=firefox npm test
```

### Modo Headless

Para ejecutar en modo headless (sin ventana del navegador), edita `tests/utils/driver.js` y descomenta las líneas:

```javascript
chromeOptions.addArguments('--headless');
// o
firefoxOptions.addArguments('--headless');
```

## Tipos de Pruebas

### 1. Navegación (`navigation.test.js`)
- Carga de página principal
- Enlaces de navegación
- Scroll entre secciones
- Menú móvil (hamburguesa)
- Footer

### 2. Formularios (`forms.test.js`)
- Formulario de login
- Formulario de registro
- Validación de campos
- Interacciones con inputs

### 3. Funcionalidades (`functionality.test.js`)
- Herramientas de bienestar
- Modales interactivos
- Sistema PQRS
- Scroll y animaciones

### 4. Accesibilidad (`accessibility.test.js`)
- Elementos semánticos HTML
- Atributos ARIA
- Navegación por teclado
- Contraste y legibilidad
- Diseño responsive

### 5. Página Principal (`homepage.test.js`)
- Elementos visuales
- Contenido de secciones
- Interacciones
- Footer

## Solución de Problemas

### Error: "Cannot find module 'selenium-webdriver'"
```bash
npm install --save-dev selenium-webdriver
```

### Error: "ChromeDriver not found"
Asegúrate de tener Chrome instalado. Selenium WebDriver descargará automáticamente el ChromeDriver compatible.

### Error: "Connection refused" o "ECONNREFUSED"
Asegúrate de que el servidor de desarrollo esté corriendo:
```bash
npm run dev
```

### Las pruebas fallan por timeout
Aumenta el timeout en `.mocharc.json` o en cada archivo de prueba:
```javascript
this.timeout(60000); // 60 segundos
```

## Screenshots

Si una prueba falla, se pueden tomar screenshots automáticamente. Los screenshots se guardan en `tests/screenshots/`.

Para habilitar screenshots en caso de error, edita los archivos de prueba y agrega:

```javascript
afterEach(async function() {
    if (this.currentTest.state === 'failed') {
        await driverManager.takeScreenshot(`error-${Date.now()}`);
    }
});
```

## Mejores Prácticas

1. **Siempre ejecuta el servidor de desarrollo** antes de correr las pruebas
2. **Revisa los logs** si una prueba falla para entender el problema
3. **Mantén las pruebas independientes** - cada prueba debe poder ejecutarse sola
4. **Usa timeouts apropiados** - algunas interacciones pueden tardar más
5. **Limpia el estado** entre pruebas cuando sea necesario

## Contribuir

Al agregar nuevas funcionalidades al frontend, asegúrate de:
1. Agregar pruebas correspondientes
2. Mantener las pruebas existentes actualizadas
3. Documentar cualquier cambio en la estructura del DOM

