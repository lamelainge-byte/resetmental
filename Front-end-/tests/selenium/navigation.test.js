/**
 * Pruebas de Navegación
 * Verifica la funcionalidad de navegación del sitio
 */

const { DriverManager } = require('../utils/driver');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');

describe('Pruebas de Navegación - ResetMental', function() {
    this.timeout(30000); // 30 segundos timeout para cada test
    
    let driverManager;
    let driver;

    before(async function() {
        driverManager = new DriverManager();
        driver = await driverManager.createDriver();
    });

    after(async function() {
        await driverManager.quit();
    });

    describe('Navegación Principal', function() {
        it('Debe cargar la página principal correctamente', async function() {
            await driverManager.navigateTo('/');
            
            const title = await driver.getTitle();
            expect(title).to.include('ResetMental');
            
            const heroTitle = await driverManager.getText('.hero-title');
            expect(heroTitle).to.include('bienestar digital');
        });

        it('Debe mostrar la barra de navegación', async function() {
            await driverManager.navigateTo('/');
            
            const navbar = await driverManager.elementExists('.navbar');
            expect(navbar).to.be.true;
            
            const logo = await driverManager.elementExists('.nav-logo');
            expect(logo).to.be.true;
        });

        it('Debe tener todos los enlaces de navegación', async function() {
            await driverManager.navigateTo('/');
            
            const navLinks = await driver.findElements(By.css('.nav-link'));
            expect(navLinks.length).to.be.at.least(5);
        });

        it('Debe navegar a la sección Nosotros al hacer clic', async function() {
            await driverManager.navigateTo('/');
            
            await driverManager.clickElement('a[href="#nosotros"]');
            await driver.sleep(1000); // Esperar animación de scroll
            
            const nosotrosSection = await driverManager.elementExists('#nosotros');
            expect(nosotrosSection).to.be.true;
        });

        it('Debe navegar a la sección Bienestar al hacer clic', async function() {
            await driverManager.navigateTo('/');
            
            await driverManager.clickElement('a[href="#bienestar"]');
            await driver.sleep(1000);
            
            const bienestarSection = await driverManager.elementExists('#bienestar');
            expect(bienestarSection).to.be.true;
        });

        it('Debe navegar a la página de psicólogos', async function() {
            await driverManager.navigateTo('/');
            
            await driverManager.clickElement('a[href="pages/psicologos.html"]');
            await driver.sleep(2000);
            
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('psicologos.html');
        });

        it('Debe navegar a la página de login', async function() {
            await driverManager.navigateTo('/');
            
            await driverManager.clickElement('a[href="pages/login.html"]');
            await driver.sleep(2000);
            
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('login.html');
            
            const loginTitle = await driverManager.getText('.auth-title');
            expect(loginTitle).to.include('Bienvenido');
        });

        it('Debe navegar a la página de registro', async function() {
            await driverManager.navigateTo('/');
            
            await driverManager.clickElement('a[href="pages/register.html"]');
            await driver.sleep(2000);
            
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('register.html');
            
            const registerTitle = await driverManager.getText('.auth-title');
            expect(registerTitle).to.include('Únete');
        });
    });

    describe('Navegación Móvil', function() {
        it('Debe mostrar el menú hamburguesa en pantallas pequeñas', async function() {
            await driverManager.navigateTo('/');
            
            // Cambiar tamaño de ventana a móvil
            await driver.manage().window().setRect({ width: 375, height: 667 });
            await driver.sleep(500);
            
            const hamburger = await driverManager.elementExists('#hamburger');
            expect(hamburger).to.be.true;
        });

        it('Debe abrir el menú móvil al hacer clic en hamburguesa', async function() {
            await driverManager.navigateTo('/');
            
            await driver.manage().window().setRect({ width: 375, height: 667 });
            await driver.sleep(1500);
            
            // Hacer clic usando JavaScript para evitar problemas de interactividad
            await driver.executeScript(`
                document.getElementById('hamburger').click();
            `);
            await driver.sleep(2000);
            
            // Verificar que el menú tiene la clase active
            const navMenu = await driver.findElement(By.css('#nav-menu'));
            const classes = await navMenu.getAttribute('class');
            expect(classes).to.include('active');
        });

        it('Debe cerrar el menú móvil al hacer clic fuera', async function() {
            await driverManager.navigateTo('/');
            
            await driver.manage().window().setRect({ width: 375, height: 667 });
            await driver.sleep(1500);
            
            // Abrir menú usando JavaScript
            await driver.executeScript(`
                document.getElementById('hamburger').click();
            `);
            await driver.sleep(2000);
            
            // Verificar que está abierto
            let navMenu = await driver.findElement(By.css('#nav-menu'));
            let classes = await navMenu.getAttribute('class');
            expect(classes).to.include('active');
            
            // Cerrar haciendo clic fuera (en el hero usando JavaScript)
            await driver.executeScript(`
                document.querySelector('.hero').click();
            `);
            await driver.sleep(1500);
            
            // Verificar que está cerrado
            navMenu = await driver.findElement(By.css('#nav-menu'));
            classes = await navMenu.getAttribute('class');
            expect(classes).to.not.include('active');
        });
    });

    describe('Footer', function() {
        it('Debe mostrar el footer con información', async function() {
            await driverManager.navigateTo('/');
            await driverManager.scrollToElement('.footer');
            
            const footer = await driverManager.elementExists('.footer');
            expect(footer).to.be.true;
            
            const footerLogo = await driverManager.getText('.footer-logo');
            expect(footerLogo).to.include('ResetMental');
        });

        it('Debe tener enlaces en el footer', async function() {
            await driverManager.navigateTo('/');
            await driverManager.scrollToElement('.footer');
            
            const footerLinks = await driver.findElements(By.css('.footer a'));
            expect(footerLinks.length).to.be.at.least(5);
        });
    });
});

