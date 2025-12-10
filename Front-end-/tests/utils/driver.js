/**
 * Configuración del WebDriver de Selenium
 * Soporta Chrome y Firefox
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 10000; // 10 segundos

class DriverManager {
    constructor() {
        this.driver = null;
        this.browser = process.env.BROWSER || 'chrome';
    }

    /**
     * Crear instancia del driver
     */
    async createDriver() {
        const options = this.getBrowserOptions();
        
        this.driver = await new Builder()
            .forBrowser(this.browser)
            .setChromeOptions(options.chrome)
            .setFirefoxOptions(options.firefox)
            .build();

        // Configurar timeouts
        await this.driver.manage().setTimeouts({
            implicit: TIMEOUT,
            pageLoad: TIMEOUT * 2,
            script: TIMEOUT
        });

        // Maximizar ventana
        await this.driver.manage().window().maximize();

        return this.driver;
    }

    /**
     * Obtener opciones del navegador
     */
    getBrowserOptions() {
        const chromeOptions = new chrome.Options();
        chromeOptions.addArguments('--no-sandbox');
        chromeOptions.addArguments('--disable-dev-shm-usage');
        chromeOptions.addArguments('--disable-gpu');
        // chromeOptions.addArguments('--headless'); // Descomentar para modo headless

        const firefoxOptions = new firefox.Options();
        // firefoxOptions.addArguments('--headless'); // Descomentar para modo headless

        return {
            chrome: chromeOptions,
            firefox: firefoxOptions
        };
    }

    /**
     * Navegar a una URL
     */
    async navigateTo(path = '') {
        const url = `${BASE_URL}${path}`;
        await this.driver.get(url);
        await this.driver.wait(until.elementLocated(By.tagName('body')), TIMEOUT);
    }

    /**
     * Esperar a que un elemento sea visible
     */
    async waitForElement(selector, timeout = TIMEOUT) {
        return await this.driver.wait(
            until.elementLocated(By.css(selector)),
            timeout
        );
    }

    /**
     * Esperar a que un elemento sea clickeable
     */
    async waitForClickable(selector, timeout = TIMEOUT) {
        const element = await this.waitForElement(selector, timeout);
        return await this.driver.wait(
            until.elementIsVisible(element),
            timeout
        );
    }

    /**
     * Hacer clic en un elemento
     */
    async clickElement(selector) {
        const element = await this.waitForClickable(selector);
        await element.click();
    }

    /**
     * Escribir en un input
     */
    async typeText(selector, text) {
        const element = await this.waitForElement(selector);
        await element.clear();
        await element.sendKeys(text);
    }

    /**
     * Obtener texto de un elemento
     */
    async getText(selector) {
        const element = await this.waitForElement(selector);
        return await element.getText();
    }

    /**
     * Verificar si un elemento existe
     */
    async elementExists(selector) {
        try {
            await this.driver.findElement(By.css(selector));
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Obtener atributo de un elemento
     */
    async getAttribute(selector, attribute) {
        const element = await this.waitForElement(selector);
        return await element.getAttribute(attribute);
    }

    /**
     * Hacer scroll a un elemento
     */
    async scrollToElement(selector) {
        const element = await this.waitForElement(selector);
        await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
        await this.driver.sleep(500); // Pequeña pausa después del scroll
    }

    /**
     * Ejecutar JavaScript
     */
    async executeScript(script, ...args) {
        return await this.driver.executeScript(script, ...args);
    }

    /**
     * Tomar screenshot
     */
    async takeScreenshot(filename) {
        const screenshot = await this.driver.takeScreenshot();
        const fs = require('fs');
        const path = require('path');
        const screenshotPath = path.join(__dirname, '../screenshots', `${filename}.png`);
        
        // Crear directorio si no existe
        const dir = path.dirname(screenshotPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(screenshotPath, screenshot, 'base64');
        return screenshotPath;
    }

    /**
     * Cerrar el driver
     */
    async quit() {
        if (this.driver) {
            await this.driver.quit();
            this.driver = null;
        }
    }

    /**
     * Obtener el driver actual
     */
    getDriver() {
        return this.driver;
    }
}

module.exports = { DriverManager, BASE_URL, TIMEOUT };

