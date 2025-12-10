/**
 * Pruebas de Accesibilidad
 * Verifica aspectos de accesibilidad del sitio
 */

const { DriverManager } = require('../utils/driver');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');

describe('Pruebas de Accesibilidad - ResetMental', function() {
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

    describe('Elementos Semánticos', function() {
        it('Debe tener estructura HTML semántica', async function() {
            await driverManager.navigateTo('/');
            
            const main = await driverManager.elementExists('main');
            expect(main).to.be.true;
            
            const nav = await driverManager.elementExists('nav');
            expect(nav).to.be.true;
            
            const footer = await driverManager.elementExists('footer');
            expect(footer).to.be.true;
        });

        it('Debe tener títulos jerárquicos (h1, h2, h3)', async function() {
            await driverManager.navigateTo('/');
            
            const h1 = await driver.findElements(By.css('h1'));
            expect(h1.length).to.be.at.least(1);
            
            const h2 = await driver.findElements(By.css('h2'));
            expect(h2.length).to.be.at.least(1);
        });
    });

    describe('Atributos ARIA y Accesibilidad', function() {
        it('Debe tener atributos alt en imágenes', async function() {
            await driverManager.navigateTo('/');
            
            const images = await driver.findElements(By.css('img'));
            for (const img of images) {
                const alt = await img.getAttribute('alt');
                expect(alt, 'Todas las imágenes deben tener atributo alt').to.not.be.null;
            }
        });

        it('Debe tener labels en formularios', async function() {
            await driverManager.navigateTo('/pages/login.html');
            
            const emailLabel = await driverManager.elementExists('label[for="email"]');
            expect(emailLabel).to.be.true;
            
            const passwordLabel = await driverManager.elementExists('label[for="password"]');
            expect(passwordLabel).to.be.true;
        });

        it('Debe tener atributos aria-label en botones importantes', async function() {
            await driverManager.navigateTo('/');
            
            // Verificar que los botones sociales tienen aria-label
            const socialLinks = await driver.findElements(By.css('.social-link'));
            for (const link of socialLinks) {
                const ariaLabel = await link.getAttribute('aria-label');
                expect(ariaLabel, 'Los enlaces sociales deben tener aria-label').to.not.be.null;
            }
        });
    });

    describe('Navegación por Teclado', function() {
        it('Debe poder navegar con Tab', async function() {
            await driverManager.navigateTo('/');
            
            const body = await driver.findElement(By.tagName('body'));
            await body.sendKeys(require('selenium-webdriver').Key.TAB);
            await driver.sleep(300);
            
            const activeElement = await driver.switchTo().activeElement();
            const tagName = await activeElement.getTagName();
            expect(['a', 'button', 'input']).to.include(tagName);
        });

        it('Debe tener focus visible en elementos interactivos', async function() {
            await driverManager.navigateTo('/');
            
            const firstLink = await driver.findElement(By.css('.nav-link'));
            await firstLink.sendKeys(require('selenium-webdriver').Key.TAB);
            await driver.sleep(300);
            
            const focusedElement = await driver.switchTo().activeElement();
            const outline = await focusedElement.getCssValue('outline');
            expect(outline).to.not.equal('none');
        });
    });

    describe('Contraste y Legibilidad', function() {
        it('Debe tener texto legible', async function() {
            await driverManager.navigateTo('/');
            
            const heroTitle = await driver.findElement(By.css('.hero-title'));
            const color = await heroTitle.getCssValue('color');
            expect(color).to.not.be.null;
            
            const fontSize = await heroTitle.getCssValue('font-size');
            expect(fontSize).to.not.be.null;
        });
    });

    describe('Responsive Design', function() {
        it('Debe adaptarse a diferentes tamaños de pantalla', async function() {
            await driverManager.navigateTo('/');
            
            // Probar diferentes tamaños
            const sizes = [
                { width: 375, height: 667 },  // Mobile
                { width: 768, height: 1024 }, // Tablet
                { width: 1920, height: 1080 } // Desktop
            ];

            for (const size of sizes) {
                await driver.manage().window().setRect(size);
                await driver.sleep(500);
                
                const navbar = await driverManager.elementExists('.navbar');
                expect(navbar, `Navbar debe existir en tamaño ${size.width}x${size.height}`).to.be.true;
            }
        });

        it('Debe mostrar menú móvil en pantallas pequeñas', async function() {
            await driverManager.navigateTo('/');
            
            await driver.manage().window().setRect({ width: 375, height: 667 });
            await driver.sleep(500);
            
            const hamburger = await driverManager.elementExists('#hamburger');
            expect(hamburger).to.be.true;
        });
    });
});

