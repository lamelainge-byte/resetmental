/**
 * ResetMental - Sistema de Bienestar Digital
 * 
 * Gestiona las herramientas interactivas de bienestar mental:
 * - Ejercicios de respiración guiada
 * - Consejos para uso digital saludable
 * - Rutinas de autocuidado
 * - Prácticas de mindfulness
 * - Modales interactivos para bienestar
 */

class WellnessManager {
    constructor() {
        this.breathingActive = false;
        this.breathingInterval = null;
        this.currentPhase = 'inhale'; // inhale, hold, exhale
        this.phaseDuration = {
            inhale: 4000,
            hold: 2000,
            exhale: 6000
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        console.log('ResetMental Wellness Manager inicializado');
    }

    setupEventListeners() {
        // Los event listeners se configuran cuando se crean los modales
    }

    /**
     * Ejercicio de respiración
     */
    startBreathingExercise() {
        this.createBreathingModal();
    }

    createBreathingModal() {
        const modal = document.createElement('div');
        modal.className = 'wellness-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Ejercicio de Respiración</h3>
                    <button class="close-btn" onclick="this.closest('.wellness-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="breathing-container">
                        <div class="breathing-circle" id="breathing-circle">
                            <div class="breathing-text" id="breathing-text">Inhala</div>
                        </div>
                        <div class="breathing-instructions">
                            <p>Respira profundamente siguiendo el círculo</p>
                            <p>Inhala cuando crezca, mantén cuando esté lleno, exhala cuando se reduzca</p>
                        </div>
                        <div class="breathing-controls">
                            <button class="btn btn-primary" id="start-breathing">Comenzar</button>
                            <button class="btn btn-outline" id="stop-breathing" style="display: none;">Detener</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupBreathingControls();
    }

    setupBreathingControls() {
        const startBtn = document.getElementById('start-breathing');
        const stopBtn = document.getElementById('stop-breathing');
        const circle = document.getElementById('breathing-circle');
        const text = document.getElementById('breathing-text');

        startBtn.addEventListener('click', () => {
            this.breathingActive = true;
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-flex';
            this.startBreathingCycle(circle, text);
        });

        stopBtn.addEventListener('click', () => {
            this.stopBreathingExercise();
            startBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'none';
        });
    }

    startBreathingCycle(circle, text) {
        if (!this.breathingActive) return;

        // Fase de inhalación
        this.currentPhase = 'inhale';
        text.textContent = 'Inhala';
        circle.style.transform = 'scale(1.2)';
        circle.style.backgroundColor = '#4ECDC4';

        setTimeout(() => {
            if (!this.breathingActive) return;

            // Fase de retención
            this.currentPhase = 'hold';
            text.textContent = 'Mantén';
            circle.style.backgroundColor = '#6B9080';

            setTimeout(() => {
                if (!this.breathingActive) return;

                // Fase de exhalación
                this.currentPhase = 'exhale';
                text.textContent = 'Exhala';
                circle.style.transform = 'scale(1)';
                circle.style.backgroundColor = '#9D84B7';

                setTimeout(() => {
                    if (this.breathingActive) {
                        this.startBreathingCycle(circle, text);
                    }
                }, this.phaseDuration.exhale);
            }, this.phaseDuration.hold);
        }, this.phaseDuration.inhale);
    }

    stopBreathingExercise() {
        this.breathingActive = false;
        const circle = document.getElementById('breathing-circle');
        const text = document.getElementById('breathing-text');

        if (circle) {
            circle.style.transform = 'scale(1)';
            circle.style.backgroundColor = '#4ECDC4';
        }
        if (text) {
            text.textContent = 'Inhala';
        }
    }

    /**
     * Consejos digitales
     */
    showDigitalTips() {
        const tips = [
            {
                title: "Límites de Tiempo",
                content: "Establece horarios específicos para el uso de dispositivos. Usa aplicaciones de control parental o temporizadores para respetar estos límites.",
                icon: "fas fa-clock"
            },
            {
                title: "Espacios Libres de Tecnología",
                content: "Designa áreas en tu hogar donde no se permitan dispositivos, como el dormitorio o la mesa de comedor.",
                icon: "fas fa-home"
            },
            {
                title: "Notificaciones Inteligentes",
                content: "Desactiva notificaciones no esenciales y agrupa las importantes en horarios específicos del día.",
                icon: "fas fa-bell-slash"
            },
            {
                title: "Modo Nocturno",
                content: "Activa el modo nocturno en todos tus dispositivos para reducir la luz azul que puede afectar el sueño.",
                icon: "fas fa-moon"
            },
            {
                title: "Pausas Activas",
                content: "Cada 30 minutos de uso, toma una pausa de 5 minutos para estirarte, caminar o mirar por la ventana.",
                icon: "fas fa-walking"
            },
            {
                title: "Contenido Consciente",
                content: "Sé selectivo con el contenido que consumes. Prioriza información que te aporte valor y bienestar.",
                icon: "fas fa-filter"
            }
        ];

        this.createTipsModal("Consejos para un Uso Digital Saludable", tips);
    }

    /**
     * Consejos de autocuidado
     */
    showSelfCareTips() {
        const tips = [
            {
                title: "Rutina Matutina",
                content: "Comienza el día con 10 minutos de meditación, estiramientos suaves o simplemente disfrutando una taza de té en silencio.",
                icon: "fas fa-sun"
            },
            {
                title: "Hidratación Consciente",
                content: "Mantén una botella de agua cerca y bebe regularmente. La hidratación adecuada mejora el estado de ánimo y la concentración.",
                icon: "fas fa-tint"
            },
            {
                title: "Movimiento Diario",
                content: "Incorpora al menos 20 minutos de actividad física que disfrutes: caminar, bailar, yoga o cualquier ejercicio que te haga sentir bien.",
                icon: "fas fa-heart"
            },
            {
                title: "Gratitud",
                content: "Escribe tres cosas por las que te sientes agradecido cada día. Esta práctica simple puede mejorar significativamente tu bienestar.",
                icon: "fas fa-heart"
            },
            {
                title: "Conexión Social",
                content: "Mantén contacto regular con amigos y familiares. Una conversación de 15 minutos puede hacer una gran diferencia en tu día.",
                icon: "fas fa-users"
            },
            {
                title: "Descanso de Calidad",
                content: "Establece una rutina de sueño consistente y crea un ambiente relajante en tu dormitorio para un descanso reparador.",
                icon: "fas fa-bed"
            }
        ];

        this.createTipsModal("Rutinas de Autocuidado", tips);
    }


    /**
     * Crear modal de consejos
     */
    createTipsModal(title, tips) {
        const modal = document.createElement('div');
        modal.className = 'wellness-modal';

        const tipsHTML = tips.map(tip => `
            <div class="tip-card">
                <div class="tip-icon">
                    <i class="${tip.icon}"></i>
                </div>
                <div class="tip-content">
                    <h4>${tip.title}</h4>
                    <p>${tip.content}</p>
                </div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-btn" onclick="this.closest('.wellness-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="tips-container">
                        ${tipsHTML}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Crear modal de prácticas
     */
    createPracticesModal(title, practices) {
        const modal = document.createElement('div');
        modal.className = 'wellness-modal';

        const practicesHTML = practices.map(practice => `
            <div class="practice-card">
                <div class="practice-header">
                    <div class="practice-icon">
                        <i class="${practice.icon}"></i>
                    </div>
                    <div class="practice-info">
                        <h4>${practice.title}</h4>
                        <span class="practice-duration">${practice.duration}</span>
                    </div>
                </div>
                <div class="practice-content">
                    <p>${practice.content}</p>
                </div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-btn" onclick="this.closest('.wellness-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="practices-container">
                        ${practicesHTML}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }
}

// Funciones globales para los botones
function startBreathingExercise() {
    if (window.wellnessManager) {
        window.wellnessManager.startBreathingExercise();
    }
}

function showDigitalTips() {
    if (window.wellnessManager) {
        window.wellnessManager.showDigitalTips();
    }
}

function showSelfCareTips() {
    if (window.wellnessManager) {
        window.wellnessManager.showSelfCareTips();
    }
}


// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.wellnessManager = new WellnessManager();
});