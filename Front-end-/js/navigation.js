/**
 * ResetMental - Sistema de Navegación
 * 
 * Gestiona toda la funcionalidad de navegación:
 * - Efectos de scroll en la navbar
 * - Menú hamburguesa para móviles
 * - Scroll suave entre secciones
 * - Enlaces activos basados en scroll
 * - Animaciones de entrada de elementos
 */

class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveLinks();
        this.setupAnimations();
        this.setupRoleBasedNavigation();

        console.log('ResetMental Navigation inicializada');
    }

    /**
     * Configurar navegación basada en roles
     */
    setupRoleBasedNavigation() {
        if (!window.apiClient) return;

        const session = window.apiClient.getSession();
        // Solo actualizar si hay una sesión activa
        if (!session || !session.user) return;

        const isPsychologist = window.apiClient.isPsychologist();

        // Buscar todos los enlaces de "Psicólogos" en la navegación
        const psicologosLinks = document.querySelectorAll('.nav-link[href*="psicologos"], .nav-link[href*="usuarios"]');

        psicologosLinks.forEach(link => {
            if (isPsychologist) {
                // Cambiar texto y href para psicólogos
                link.textContent = 'Usuarios';
                const currentHref = link.getAttribute('href');
                if (currentHref.includes('psicologos.html')) {
                    link.setAttribute('href', 'pages/usuarios.html');
                } else if (currentHref === '#psicologos' || currentHref.includes('#psicologos')) {
                    link.setAttribute('href', '#usuarios');
                } else if (!currentHref.includes('usuarios')) {
                    link.setAttribute('href', 'pages/usuarios.html');
                }
            } else {
                // Para clientes o usuarios no logueados, mantener "Psicólogos"
                link.textContent = 'Psicólogos';
                const currentHref = link.getAttribute('href');
                if (currentHref.includes('usuarios.html')) {
                    link.setAttribute('href', 'pages/psicologos.html');
                } else if (currentHref === '#usuarios' || currentHref.includes('#usuarios')) {
                    link.setAttribute('href', '#psicologos');
                }
            }
        });
    }

    /**
     * Efectos de scroll en la navbar
     */
    setupScrollEffects() {
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Agregar clase scrolled cuando se hace scroll
            if (scrollTop > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
        });
    }

    /**
     * Configurar menú móvil hamburguesa
     */
    setupMobileMenu() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Cerrar menú al hacer clic en un enlace
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!this.navbar.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    /**
     * Alternar menú móvil
     */
    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');

        // Prevenir scroll del body cuando el menú está abierto
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    /**
     * Cerrar menú móvil
     */
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Configurar scroll suave
     */
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Solo aplicar scroll suave a enlaces internos
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 80; // Ajustar por altura de navbar

                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    /**
     * Configurar enlaces activos basados en scroll
     */
    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;

                if (window.pageYOffset >= sectionTop &&
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // Actualizar enlaces activos
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    /**
     * Configurar animaciones de entrada
     */
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observar elementos con clase fade-in
        const animatedElements = document.querySelectorAll('.feature-card, .wellness-card, .help-card');
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});