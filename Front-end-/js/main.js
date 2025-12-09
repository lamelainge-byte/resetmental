/**
 * ResetMental - Funcionalidad Principal
 * 
 * Gestiona las funcionalidades principales de la aplicación:
 * - Formularios de contacto y PQRS
 * - Sistema de notificaciones
 * - Controles de accesibilidad
 * - Carga perezosa de imágenes
 * - Modales y interacciones generales
 */

class ResetMentalApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupAccessibility();
        this.setupNotifications();
        this.setupLazyLoading();

        console.log('ResetMental App inicializada');
    }

    /**
     * Configurar formulario de contacto
     */
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }
    }

    /**
     * Manejar envío del formulario de contacto
     */
    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validar datos
        if (!this.validateContactForm(data)) {
            return;
        }

        // Simular envío
        this.showNotification('Mensaje enviado correctamente. Te responderemos pronto.', 'success');
        form.reset();
    }

    /**
     * Validar formulario de contacto
     */
    validateContactForm(data) {
        const { name, email, message } = data;

        if (!name || name.trim().length < 2) {
            this.showNotification('Por favor, ingresa un nombre válido.', 'error');
            return false;
        }

        if (!email || !this.isValidEmail(email)) {
            this.showNotification('Por favor, ingresa un email válido.', 'error');
            return false;
        }

        if (!message || message.trim().length < 10) {
            this.showNotification('Por favor, escribe un mensaje de al menos 10 caracteres.', 'error');
            return false;
        }

        return true;
    }

    /**
     * Validar email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Configurar accesibilidad
     */
    setupAccessibility() {
        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Contraste alto
        this.setupHighContrast();

        // Tamaño de fuente
        this.setupFontSizeControls();
    }

    /**
     * Configurar modo de alto contraste
     */
    setupHighContrast() {
        const contrastBtn = document.getElementById('contrast-toggle');
        if (contrastBtn) {
            contrastBtn.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
                const isActive = document.body.classList.contains('high-contrast');
                localStorage.setItem('highContrast', isActive);
            });

            // Cargar preferencia guardada
            const savedContrast = localStorage.getItem('highContrast');
            if (savedContrast === 'true') {
                document.body.classList.add('high-contrast');
            }
        }
    }

    /**
     * Configurar controles de tamaño de fuente
     */
    setupFontSizeControls() {
        const increaseBtn = document.getElementById('increase-font');
        const decreaseBtn = document.getElementById('decrease-font');
        const resetBtn = document.getElementById('reset-font');

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                this.adjustFontSize(1.1);
            });
        }

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                this.adjustFontSize(0.9);
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFontSize();
            });
        }
    }

    /**
     * Ajustar tamaño de fuente
     */
    adjustFontSize(factor) {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const newSize = currentSize * factor;

        // Limitar entre 12px y 24px
        if (newSize >= 12 && newSize <= 24) {
            document.documentElement.style.fontSize = newSize + 'px';
            localStorage.setItem('fontSize', newSize);
        }
    }

    /**
     * Resetear tamaño de fuente
     */
    resetFontSize() {
        document.documentElement.style.fontSize = '16px';
        localStorage.removeItem('fontSize');
    }

    /**
     * Configurar sistema de notificaciones
     */
    setupNotifications() {
        // Crear contenedor de notificaciones
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    /**
     * Mostrar notificación
     */
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        container.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-remover
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }

    /**
     * Configurar carga perezosa de imágenes
     */
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    /**
     * Abrir formulario de contacto
     */
    openContactForm() {
        this.createContactModal();
    }

    /**
     * Crear modal de contacto
     */
    createContactModal() {
        const modal = document.createElement('div');
        modal.className = 'wellness-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Contáctanos</h3>
                    <button class="close-btn" onclick="this.closest('.wellness-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="contact-form" class="contact-form">
                        <div class="form-group">
                            <label for="contact-name">Nombre</label>
                            <input type="text" id="contact-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-email">Email</label>
                            <input type="email" id="contact-email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-subject">Asunto</label>
                            <select id="contact-subject" name="subject" required>
                                <option value="">Selecciona un asunto</option>
                                <option value="consulta">Consulta general</option>
                                <option value="soporte">Soporte técnico</option>
                                <option value="psicologo">Información sobre psicólogos</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="contact-message">Mensaje</label>
                            <textarea id="contact-message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Enviar Mensaje</button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupContactForm();
    }

    /**
     * Abrir formulario PQRS
     */
    openPQRForm() {
        this.createPQRModal();
    }

    /**
     * Crear modal de PQRS
     */
    createPQRModal() {
        const modal = document.createElement('div');
        modal.className = 'wellness-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>PQRS - Peticiones, Quejas, Reclamos y Sugerencias</h3>
                    <button class="close-btn" onclick="this.closest('.wellness-modal').remove()" aria-label="Cerrar modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="pqr-form" class="contact-form" novalidate>
                        <div class="form-group">
                            <label for="pqr-type">Tipo de PQRS <span class="required">*</span></label>
                            <select id="pqr-type" name="type" required aria-required="true" aria-describedby="pqr-type-help">
                                <option value="">Selecciona el tipo</option>
                                <option value="peticion">Petición</option>
                                <option value="queja">Queja</option>
                                <option value="reclamo">Reclamo</option>
                                <option value="sugerencia">Sugerencia</option>
                            </select>
                            <span id="pqr-type-help" class="form-help">Selecciona el tipo de PQRS que deseas enviar</span>
                        </div>
                        <div class="form-group">
                            <label for="pqr-subject">Asunto <span class="required">*</span></label>
                            <input 
                                type="text" 
                                id="pqr-subject" 
                                name="subject" 
                                required 
                                aria-required="true"
                                aria-describedby="pqr-subject-help"
                                minlength="5"
                                maxlength="100"
                                placeholder="Ej: Problema con el servicio de atención"
                            >
                            <span id="pqr-subject-help" class="form-help">Mínimo 5 caracteres, máximo 100 caracteres</span>
                        </div>
                        <div class="form-group">
                            <label for="pqr-message">Descripción detallada <span class="required">*</span></label>
                            <textarea 
                                id="pqr-message" 
                                name="message" 
                                rows="6" 
                                required 
                                aria-required="true"
                                aria-describedby="pqr-message-help"
                                minlength="20"
                                maxlength="1000"
                                placeholder="Describe tu petición, queja, reclamo o sugerencia de manera detallada..."
                            ></textarea>
                            <span id="pqr-message-help" class="form-help">Mínimo 20 caracteres, máximo 1000 caracteres</span>
                        </div>
                        <button type="submit" class="btn btn-primary">Enviar PQRS</button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupPQRForm();
    }

    /**
     * Configurar formulario PQRS
     */
    setupPQRForm() {
        const form = document.getElementById('pqr-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Validar formulario
                if (!this.validatePQRForm(form)) {
                    return;
                }

                // Procesar envío
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                // Aquí se podría enviar a un endpoint
                // await this.submitPQR(data);

                this.showNotification('Tu PQRS ha sido enviado correctamente. Te responderemos en un plazo máximo de 10 días hábiles.', 'success');
                form.closest('.wellness-modal').remove();
            });
        }
    }

    /**
     * Validar formulario PQRS
     */
    validatePQRForm(form) {
        const type = form.querySelector('#pqr-type').value;
        const subject = form.querySelector('#pqr-subject').value.trim();
        const message = form.querySelector('#pqr-message').value.trim();

        // Validar tipo de PQRS
        if (!type) {
            this.showNotification('Por favor, selecciona el tipo de PQRS.', 'error');
            form.querySelector('#pqr-type').focus();
            return false;
        }

        // Validar asunto
        if (!subject || subject.length < 5) {
            this.showNotification('El asunto debe tener al menos 5 caracteres.', 'error');
            form.querySelector('#pqr-subject').focus();
            return false;
        }

        if (subject.length > 100) {
            this.showNotification('El asunto no puede exceder 100 caracteres.', 'error');
            form.querySelector('#pqr-subject').focus();
            return false;
        }

        // Validar descripción
        if (!message || message.length < 20) {
            this.showNotification('La descripción debe tener al menos 20 caracteres.', 'error');
            form.querySelector('#pqr-message').focus();
            return false;
        }

        if (message.length > 1000) {
            this.showNotification('La descripción no puede exceder 1000 caracteres.', 'error');
            form.querySelector('#pqr-message').focus();
            return false;
        }

        return true;
    }

    /**
     * Abrir chat de soporte
     */
    openSupportChat() {
        this.showNotification('El chat de soporte estará disponible próximamente.', 'info');
    }
}

// Funciones globales
function openContactForm() {
    if (window.resetMentalApp) {
        window.resetMentalApp.openContactForm();
    }
}

function openPQRForm() {
    if (window.resetMentalApp) {
        window.resetMentalApp.openPQRForm();
    }
}

function openSupportChat() {
    if (window.resetMentalApp) {
        window.resetMentalApp.openSupportChat();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.resetMentalApp = new ResetMentalApp();
});