/**
 * Ejecutar pruebas directamente con Node
 * Alternativa cuando Mocha tiene problemas de configuración
 */

const { spawn } = require('child_process');
const path = require('path');

const testFile = process.argv[2] || 'quick-test.js';
const testPath = path.join(__dirname, 'selenium', testFile);

console.log('🚀 Ejecutando prueba:', testFile);
console.log('');

// Verificar que el servidor esté corriendo
const http = require('http');
const checkServer = () => {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:3000', (res) => {
            resolve(true);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(2000, () => {
            req.destroy();
            resolve(false);
        });
    });
};

(async () => {
    const serverRunning = await checkServer();
    if (!serverRunning) {
        console.log('❌ Error: El servidor de desarrollo no está corriendo en http://localhost:3000');
        console.log('   Por favor, ejecuta: npm run dev');
        process.exit(1);
    }
    
    console.log('✓ Servidor de desarrollo detectado');
    console.log('');
    
    // Ejecutar con node directamente
    const child = spawn('node', [
        '-e',
        `
        const { DriverManager } = require('./tests/utils/driver');
        const { expect } = require('chai');
        const { By } = require('selenium-webdriver');
        
        const { describe, it, before, after } = require('mocha');
        
        describe('Prueba Rápida', function() {
            this.timeout(30000);
            let driverManager;
            let driver;
            
            before(async function() {
                driverManager = new DriverManager();
                driver = await driverManager.createDriver();
            });
            
            after(async function() {
                await driverManager.quit();
            });
            
            it('Debe cargar la página principal', async function() {
                await driverManager.navigateTo('/');
                const title = await driver.getTitle();
                expect(title).to.include('ResetMental');
                console.log('✓ Página principal cargada');
            });
        });
        `
    ], {
        cwd: __dirname + '/..',
        stdio: 'inherit'
    });
    
    child.on('close', (code) => {
        process.exit(code);
    });
})();

