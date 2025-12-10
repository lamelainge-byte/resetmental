/**
 * Pruebas de Funcionalidades
 * Verifica las funcionalidades interactivas del sitio
 */

const { DriverManager } = require('../utils/driver');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');

describe('Pruebas de Funcionalidades - ResetMental', function() {
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

    describe('Página Principal', function() {
        beforeEach(async function() {
            await driverManager.navigateTo('/');
            await driver.sleep(1000);
        });

        it('Debe mostrar la sección hero con imagen', async function() {
            const hero = await driverManager.elementExists('.hero');
            expect(hero).to.be.true;
            
            const heroImage = await driverManager.elementExists('.hero-image');
            expect(heroImage).to.be.true;
        });

        it('Debe mostrar la sección de características', async function() {
            await driverManager.scrollToElement('#nosotros');
            await driver.sleep(1000);
            
            const features = await driver.findElements(By.css('.feature-card'));
            expect(features.length).to.be.at.least(3);
        });

        it('Debe mostrar las herramientas de bienestar', async function() {
            await driverManager.scrollToElement('#bienestar');
            await driver.sleep(1000);
            
            const wellnessCards = await driver.findElements(By.css('.wellness-card'));
            expect(wellnessCards.length).to.be.at.least(3);
        });

        it('Debe mostrar la sección de comunidad', async function() {
            await driverManager.scrollToElement('#comunidad');
            await driver.sleep(1000);
            
            const community = await driverManager.elementExists('#comunidad');
            expect(community).to.be.true;
            
            const stats = await driver.findElements(By.css('.stat'));
            expect(stats.length).to.be.at.least(3);
        });
    });

    describe('Herramientas de Bienestar', function() {
        beforeEach(async function() {
            await driverManager.navigateTo('/');
            await driverManager.scrollToElement('#bienestar');
            await driver.sleep(1000);
        });

        it('Debe abrir modal de ejercicio de respiración', async function() {
            // Buscar el primer botón "Comenzar" dentro de una wellness-card
            const wellnessCards = await driver.findElements(By.css('.wellness-card'));
            const breathingButton = await wellnessCards[0].findElement(By.xpath(".//button[contains(text(), 'Comenzar')]"));
            await breathingButton.click();
            await driver.sleep(1000);
            
            const modal = await driverManager.elementExists('.wellness-modal');
            expect(modal).to.be.true;
            
            const modalTitle = await driverManager.getText('.modal-header h3');
            expect(modalTitle).to.include('Respiración');
        });

        it('Debe abrir modal de consejos digitales', async function() {
            const digitalTipsButton = await driver.findElement(By.xpath("//button[contains(text(), 'Ver Consejos')]"));
            await digitalTipsButton.click();
            await driver.sleep(1000);
            
            const modal = await driverManager.elementExists('.wellness-modal');
            expect(modal).to.be.true;
            
            const modalTitle = await driverManager.getText('.modal-header h3');
            expect(modalTitle).to.include('Digital');
        });

        it('Debe abrir modal de autocuidado', async function() {
            const selfCareButton = await driver.findElement(By.xpath("//button[contains(text(), 'Explorar')]"));
            await selfCareButton.click();
            await driver.sleep(1000);
            
            const modal = await driverManager.elementExists('.wellness-modal');
            expect(modal).to.be.true;
            
            const modalTitle = await driverManager.getText('.modal-header h3');
            expect(modalTitle).to.include('Autocuidado');
        });

        it('Debe cerrar el modal al hacer clic en el botón de cerrar', async function() {
            // Buscar el primer botón "Comenzar" dentro de una wellness-card
            const wellnessCards = await driver.findElements(By.css('.wellness-card'));
            const breathingButton = await wellnessCards[0].findElement(By.xpath(".//button[contains(text(), 'Comenzar')]"));
            await breathingButton.click();
            await driver.sleep(1000);
            
            const closeButton = await driver.findElement(By.css('.close-btn'));
            await closeButton.click();
            await driver.sleep(500);
            
            const modal = await driverManager.elementExists('.wellness-modal');
            expect(modal).to.be.false;
        });
    });

    describe('Sistema PQRS', function() {
        beforeEach(async function() {
            await driverManager.navigateTo('/');
            await driverManager.scrollToElement('#ayuda');
            await driver.sleep(1000);
        });

        it('Debe mostrar la sección de ayuda con PQRS', async function() {
            const helpSection = await driverManager.elementExists('#ayuda');
            expect(helpSection).to.be.true;
            
            const pqrsButton = await driver.findElement(By.xpath("//button[contains(text(), 'Enviar PQRS')]"));
            expect(pqrsButton).to.exist;
        });

        it('Debe abrir modal de PQRS al hacer clic', async function() {
            const pqrsButton = await driver.findElement(By.xpath("//button[contains(text(), 'Enviar PQRS')]"));
            await pqrsButton.click();
            await driver.sleep(1000);
            
            const modal = await driverManager.elementExists('.wellness-modal');
            expect(modal).to.be.true;
            
            const form = await driverManager.elementExists('#pqr-form');
            expect(form).to.be.true;
        });

        it('Debe tener todos los campos del formulario PQRS', async function() {
            const pqrsButton = await driver.findElement(By.xpath("//button[contains(text(), 'Enviar PQRS')]"));
            await pqrsButton.click();
            await driver.sleep(1000);
            
            const fields = [
                '#pqr-type',
                '#pqr-subject',
                '#pqr-message'
            ];

            for (const field of fields) {
                const exists = await driverManager.elementExists(field);
                expect(exists, `Campo ${field} no encontrado`).to.be.true;
            }
        });

        it('Debe permitir llenar el formulario PQRS', async function() {
            const pqrsButton = await driver.findElement(By.xpath("//button[contains(text(), 'Enviar PQRS')]"));
            await pqrsButton.click();
            await driver.sleep(1000);
            
            // Seleccionar tipo
            const typeSelect = await driver.findElement(By.css('#pqr-type'));
            await typeSelect.click();
            await driver.sleep(300);
            await driver.findElement(By.css('#pqr-type option[value="peticion"]')).click();
            
            // Llenar asunto
            await driverManager.typeText('#pqr-subject', 'Consulta sobre servicios');
            
            // Llenar mensaje
            await driverManager.typeText('#pqr-message', 'Me gustaría obtener más información sobre los servicios disponibles en la plataforma.');
            
            await driver.sleep(500);
            
            // Verificar valores
            const subject = await driverManager.getAttribute('#pqr-subject', 'value');
            expect(subject).to.equal('Consulta sobre servicios');
        });
    });

    describe('Scroll y Animaciones', function() {
        it('Debe hacer scroll suave entre secciones', async function() {
            await driverManager.navigateTo('/');
            
            const initialScroll = await driver.executeScript('return window.pageYOffset;');
            
            await driverManager.clickElement('a[href="#bienestar"]');
            await driver.sleep(1500);
            
            const finalScroll = await driver.executeScript('return window.pageYOffset;');
            expect(finalScroll).to.be.greaterThan(initialScroll);
        });

        it('Debe agregar clase scrolled a la navbar al hacer scroll', async function() {
            await driverManager.navigateTo('/');
            
            await driver.executeScript('window.scrollTo(0, 100);');
            await driver.sleep(500);
            
            const navbar = await driver.findElement(By.css('.navbar'));
            const classes = await navbar.getAttribute('class');
            expect(classes).to.include('scrolled');
        });
    });
});

