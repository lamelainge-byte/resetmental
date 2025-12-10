/**
 * Prueba rápida para verificar la configuración de Selenium
 */

const { DriverManager } = require('../utils/driver');
const { expect } = require('chai');

describe('Prueba Rápida - Verificación de Configuración', function() {
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
        console.log('✓ Página principal cargada correctamente');
    });

    it('Debe mostrar la barra de navegación', async function() {
        await driverManager.navigateTo('/');
        
        const navbar = await driverManager.elementExists('.navbar');
        expect(navbar).to.be.true;
        console.log('✓ Barra de navegación encontrada');
    });
});

