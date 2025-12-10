/**
 * Pruebas de Formularios
 * Verifica los formularios de login y registro
 */

const { DriverManager } = require('../utils/driver');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');

describe('Pruebas de Formularios - ResetMental', function() {
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

    describe('Formulario de Login', function() {
        beforeEach(async function() {
            await driverManager.navigateTo('/pages/login.html');
            await driver.sleep(1000);
        });

        it('Debe mostrar el formulario de login', async function() {
            const form = await driverManager.elementExists('#login-form');
            expect(form).to.be.true;
            
            const title = await driverManager.getText('.auth-title');
            expect(title).to.include('Bienvenido');
        });

        it('Debe tener campos de email y contraseña', async function() {
            const emailField = await driverManager.elementExists('#email');
            expect(emailField).to.be.true;
            
            const passwordField = await driverManager.elementExists('#password');
            expect(passwordField).to.be.true;
        });

        it('Debe validar campos requeridos', async function() {
            const submitButton = await driver.findElement(By.css('#login-form button[type="submit"]'));
            await submitButton.click();
            await driver.sleep(500);
            
            // Verificar que los campos tienen el atributo required
            const emailRequired = await driverManager.getAttribute('#email', 'required');
            expect(emailRequired).to.not.be.null;
            
            const passwordRequired = await driverManager.getAttribute('#password', 'required');
            expect(passwordRequired).to.not.be.null;
        });

        it('Debe permitir escribir en el campo de email', async function() {
            await driverManager.typeText('#email', 'test@example.com');
            
            const emailValue = await driverManager.getAttribute('#email', 'value');
            expect(emailValue).to.equal('test@example.com');
        });

        it('Debe permitir escribir en el campo de contraseña', async function() {
            await driverManager.typeText('#password', 'testpassword123');
            
            const passwordValue = await driverManager.getAttribute('#password', 'value');
            expect(passwordValue).to.equal('testpassword123');
        });

        it('Debe tener botón para mostrar/ocultar contraseña', async function() {
            const toggleButton = await driverManager.elementExists('.password-toggle');
            expect(toggleButton).to.be.true;
        });

        it('Debe tener checkbox de "Recordarme"', async function() {
            const rememberCheckbox = await driverManager.elementExists('input[name="remember"]');
            expect(rememberCheckbox).to.be.true;
        });

        it('Debe tener enlace de "Olvidé mi contraseña"', async function() {
            const forgotPassword = await driverManager.elementExists('.forgot-password');
            expect(forgotPassword).to.be.true;
        });

        it('Debe tener enlace a registro', async function() {
            const registerLink = await driverManager.elementExists('a[href="register.html"]');
            expect(registerLink).to.be.true;
        });
    });

    describe('Formulario de Registro', function() {
        beforeEach(async function() {
            await driverManager.navigateTo('/pages/register.html');
            await driver.sleep(1000);
        });

        it('Debe mostrar el formulario de registro', async function() {
            const form = await driverManager.elementExists('#register-form');
            expect(form).to.be.true;
            
            const title = await driverManager.getText('.auth-title');
            expect(title).to.include('Únete');
        });

        it('Debe tener todos los campos requeridos', async function() {
            const fields = [
                '#firstName',
                '#lastName',
                '#email',
                '#documentType',
                '#documentNumber',
                '#password',
                '#confirmPassword',
                '#userType'
            ];

            for (const field of fields) {
                const exists = await driverManager.elementExists(field);
                expect(exists, `Campo ${field} no encontrado`).to.be.true;
            }
        });

        it('Debe permitir llenar el formulario completo', async function() {
            await driverManager.typeText('#firstName', 'Juan');
            await driverManager.typeText('#lastName', 'Pérez');
            await driverManager.typeText('#email', 'juan.perez@example.com');
            await driverManager.typeText('#phone', '3001234567');
            await driverManager.typeText('#documentNumber', '1234567890');
            await driverManager.typeText('#password', 'Password123!');
            await driverManager.typeText('#confirmPassword', 'Password123!');
            
            // Seleccionar tipo de documento usando JavaScript
            await driver.executeScript(`
                document.querySelector('#documentType').value = 'cedula';
                document.querySelector('#documentType').dispatchEvent(new Event('change'));
            `);
            await driver.sleep(300);
            
            // Seleccionar tipo de usuario usando JavaScript
            await driver.executeScript(`
                document.querySelector('#userType').value = 'usuario';
                document.querySelector('#userType').dispatchEvent(new Event('change'));
            `);
            await driver.sleep(300);
            
            await driver.sleep(500);
            
            // Verificar que los valores se guardaron
            const firstName = await driverManager.getAttribute('#firstName', 'value');
            expect(firstName).to.equal('Juan');
            
            const email = await driverManager.getAttribute('#email', 'value');
            expect(email).to.equal('juan.perez@example.com');
        });

        it('Debe mostrar campo de motivo cuando se selecciona usuario (cliente)', async function() {
            await driverManager.scrollToElement('#userType');
            await driver.sleep(300);
            
            // Seleccionar usuario (cliente) usando JavaScript - esto debería mostrar el campo
            await driver.executeScript(`
                document.querySelector('#userType').value = 'usuario';
                document.querySelector('#userType').dispatchEvent(new Event('change'));
            `);
            await driver.sleep(1500); // Esperar animación
            
            const reasonGroup = await driver.findElement(By.css('#registrationReasonGroup'));
            const display = await reasonGroup.getCssValue('display');
            expect(display).to.not.equal('none');
        });

        it('Debe validar que los campos requeridos estén presentes', async function() {
            const requiredFields = [
                { selector: '#firstName', name: 'Nombre' },
                { selector: '#lastName', name: 'Apellido' },
                { selector: '#email', name: 'Email' },
                { selector: '#documentType', name: 'Tipo de documento' },
                { selector: '#documentNumber', name: 'Número de documento' },
                { selector: '#password', name: 'Contraseña' },
                { selector: '#confirmPassword', name: 'Confirmar contraseña' },
                { selector: '#userType', name: 'Tipo de usuario' }
            ];

            for (const field of requiredFields) {
                const required = await driverManager.getAttribute(field.selector, 'required');
                expect(required, `${field.name} debe ser requerido`).to.not.be.null;
            }
        });

        it('Debe tener indicador de fortaleza de contraseña', async function() {
            await driverManager.typeText('#password', 'test');
            await driver.sleep(500);
            
            const strengthIndicator = await driverManager.elementExists('#password-strength');
            expect(strengthIndicator).to.be.true;
        });

        it('Debe tener enlace a login', async function() {
            const loginLink = await driverManager.elementExists('a[href="login.html"]');
            expect(loginLink).to.be.true;
        });
    });
});

