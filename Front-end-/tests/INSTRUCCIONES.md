# Instrucciones para Ejecutar Pruebas Selenium

## Estado Actual

Se han creado todas las pruebas de Selenium para el frontend de ResetMental. Sin embargo, hay un problema conocido con la configuración de Mocha en algunos entornos.

## Solución Temporal

### Opción 1: Usar el script bash (Recomendado)

```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x tests/run-tests.sh

# Ejecutar todas las pruebas
./tests/run-tests.sh all

# Ejecutar pruebas específicas
./tests/run-tests.sh navigation
./tests/run-tests.sh forms
./tests/run-tests.sh functionality
./tests/run-tests.sh accessibility
./tests/run-tests.sh homepage
./tests/run-tests.sh quick
```

### Opción 2: Ejecutar directamente con Node

Si el script bash no funciona, puedes ejecutar las pruebas directamente:

```bash
# Asegúrate de estar en el directorio raíz del proyecto
cd /home/jaydethsp/Documentos/frontendsan/resetmental-main/Front-end-

# Ejecutar una prueba específica
node node_modules/.bin/mocha tests/selenium/navigation.test.js --timeout 30000

# O usando npx
npx mocha tests/selenium/navigation.test.js --timeout 30000
```

### Opción 3: Usar Jest en lugar de Mocha (Alternativa)

Si Mocha sigue dando problemas, puedes migrar a Jest:

```bash
npm uninstall mocha chai
npm install --save-dev jest @jest/globals
```

Luego convertir los archivos de prueba a formato Jest.

## Verificar que el Servidor Esté Corriendo

**IMPORTANTE**: Antes de ejecutar las pruebas, asegúrate de que el servidor de desarrollo esté corriendo:

```bash
npm run dev
```

El servidor debe estar en `http://localhost:3000`

## Estructura de Pruebas Creadas

✅ **tests/selenium/navigation.test.js** - Pruebas de navegación (menú, enlaces, scroll, menú móvil)
✅ **tests/selenium/forms.test.js** - Pruebas de formularios (login, registro, validaciones)
✅ **tests/selenium/functionality.test.js** - Pruebas de funcionalidades (bienestar, PQRS, modales)
✅ **tests/selenium/accessibility.test.js** - Pruebas de accesibilidad (ARIA, navegación por teclado, responsive)
✅ **tests/selenium/homepage.test.js** - Pruebas de la página principal (elementos visuales, contenido)
✅ **tests/selenium/quick-test.js** - Prueba rápida de verificación

## Configuración del Driver

El driver está configurado en `tests/utils/driver.js` y soporta:
- Chrome (por defecto)
- Firefox (usando `BROWSER=firefox`)

Para cambiar el navegador:
```bash
BROWSER=firefox ./tests/run-tests.sh all
```

## Troubleshooting

### Error: "Connection refused"
- Asegúrate de que el servidor esté corriendo: `npm run dev`

### Error: "ChromeDriver not found"
- Selenium WebDriver descargará automáticamente el ChromeDriver compatible
- Asegúrate de tener Chrome instalado

### Error: "Cannot find module"
- Ejecuta: `npm install`
- Verifica que todas las dependencias estén instaladas

### Las pruebas son muy lentas
- Aumenta el timeout en los archivos de prueba: `this.timeout(60000)`
- O ejecuta pruebas individuales en lugar de todas a la vez

## Próximos Pasos

1. **Resolver el problema de Mocha**: El error parece estar relacionado con la configuración de módulos ES6/CommonJS
2. **Agregar más pruebas**: A medida que se agreguen nuevas funcionalidades
3. **Integración CI/CD**: Configurar las pruebas para ejecutarse automáticamente

## Contacto

Si encuentras problemas ejecutando las pruebas, revisa:
- La versión de Node.js (debe ser >= 14.0.0)
- Que todas las dependencias estén instaladas
- Que el servidor de desarrollo esté corriendo

