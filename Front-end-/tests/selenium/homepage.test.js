/**
 * Pruebas de la Página Principal
 * Verifica todos los elementos y funcionalidades de la homepage
 */

const { DriverManager } = require('../utils/driver');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');

describe('Pruebas de Página Principal - ResetMental', function() {
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

    describe('Elementos Visuales', function() {
        beforeEach(async function() {
            await driverManager.navigateTo('/');
            await driver.sleep(1000);
        });

        it('Debe mostrar el logo de ResetMental', async function() {
            const logo = await driverManager.elementExists('.nav-logo');
            expect(logo).to.be.true;
            
            const logoText = await driverManager.getText('.logo-link');
            expect(logoText).to.include('ResetMental');
        });

        it('Debe mostrar la imagen hero', async function() {
            const heroImage = await driverManager.elementExists('.hero-image');
            expect(heroImage).to.be.true;
            
            const src = await driverManager.getAttribute('.hero-image', 'src');
            expect(src).to.not.be.empty;
        });

        it('Debe mostrar iconos de Font Awesome', async function() {
            const icons = await driver.findElements(By.css('.fas, .fab'));
            expect(icons.length).to.be.greaterThan(0);
        });
    });

    describe('Contenido de Secciones', function() {
        beforeEach(async function() {
            await driverManager.navigateTo('/');
            await driver.sleep(1000);
        });

        it('Debe mostrar el título principal del hero', async function() {
            const heroTitle = await driverManager.getText('.hero-title');
            expect(heroTitle).to.include('bienestar');
        });

        it('Debe mostrar la descripción del hero', async function() {
            const heroDescription = await driverManager.elementExists('.hero-description');
            expect(heroDescription).to.be.true;
            
            const text = await driverManager.getText('.hero-description');
            expect(text.length).to.be.greaterThan(20);
        });

        it('Debe mostrar botones de acción en el hero', async function() {
            const heroActions = await driver.findElements(By.css('.hero-actions .btn'));
            expect(heroActions.length).to.be.at.least(2);
        });

        it('Debe mostrar las características principales', async function() {
            await driverManager.scrollToElement('#nosotros');
            await driver.sleep(1000);
            
            const features = await driver.findElements(By.css('.feature-card'));
            expect(features.length).to.be.at.least(3);
            
            // Verificar que cada feature tiene icono y texto
            for (const feature of features) {
                const icon = await feature.findElements(By.css('.feature-icon'));
                expect(icon.length).to.be.greaterThan(0);
                
                const title = await feature.findElements(By.css('h3'));
                expect(title.length).to.be.greaterThan(0);
            }
        });

        it('Debe mostrar las herramientas de bienestar', async function() {
            await driverManager.scrollToElement('#bienestar');
            await driver.sleep(1000);
            
            const wellnessCards = await driver.findElements(By.css('.wellness-card'));
            expect(wellnessCards.length).to.be.at.least(3);
        });

        it('Debe mostrar estadísticas de la comunidad', async function() {
            await driverManager.scrollToElement('#comunidad');
            await driver.sleep(1000);
            
            const stats = await driver.findElements(By.css('.stat'));
            expect(stats.length).to.be.at.least(3);
            
            for (const stat of stats) {
                const number = await stat.findElements(By.css('.stat-number'));
                const label = await stat.findElements(By.css('.stat-label'));
                
                expect(number.length).to.be.greaterThan(0);
                expect(label.length).to.be.greaterThan(0);
            }
        });
    });

    describe('Interacciones', function() {
        beforeEach(async function() {
            await driverManager.navigateTo('/');
            await driver.sleep(1000);
        });

        it('Debe navegar al hacer clic en "Explora tu Bienestar"', async function() {
            const exploreButton = await driver.findElement(By.xpath("//a[contains(text(), 'Explora tu Bienestar')]"));
            await exploreButton.click();
            await driver.sleep(1500);
            
            const bienestarSection = await driverManager.elementExists('#bienestar');
            expect(bienestarSection).to.be.true;
        });

        it('Debe navegar al hacer clic en "Encuentra Apoyo"', async function() {
            const supportButton = await driver.findElement(By.xpath("//a[contains(text(), 'Encuentra Apoyo')]"));
            await supportButton.click();
            await driver.sleep(2000);
            
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('psicologos');
        });

        it('Debe navegar al hacer clic en "Únete Ahora"', async function() {
            await driverManager.scrollToElement('#comunidad');
            await driver.sleep(1000);
            
            const joinButton = await driver.findElement(By.xpath("//a[contains(text(), 'Únete Ahora')]"));
            await joinButton.click();
            await driver.sleep(2000);
            
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('register');
        });
    });

    describe('Footer', function() {
        beforeEach(async function() {
            await driverManager.navigateTo('/');
            await driverManager.scrollToElement('.footer');
            await driver.sleep(1000);
        });

        it('Debe mostrar información del equipo', async function() {
            const teamInfo = await driverManager.elementExists('.team-info');
            expect(teamInfo).to.be.true;
            
            const text = await driverManager.getText('.team-info');
            expect(text).to.include('Equipo');
        });

        it('Debe mostrar copyright', async function() {
            const copyright = await driverManager.elementExists('.copyright');
            expect(copyright).to.be.true;
            
            const text = await driverManager.getText('.copyright');
            expect(text).to.include('2025');
        });

        it('Debe tener enlaces a redes sociales', async function() {
            const socialLinks = await driver.findElements(By.css('.social-link'));
            expect(socialLinks.length).to.be.at.least(3);
        });
    });
});

