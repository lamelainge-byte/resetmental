/**
 * ResetMental - Página de Psicólogos
 * Maneja la funcionalidad de búsqueda, filtros y visualización de psicólogos
 */

/**
 * Utilidades para formateo de precios en pesos colombianos
 */
const PriceFormatter = {
    /**
     * Formatea un número como precio en pesos colombianos
     * @param {number} amount - Cantidad a formatear
     * @returns {string} Precio formateado (ej: "$50.000")
     */
    formatCOP(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
};

class PsychologistsManager {
    constructor() {
        this.psychologists = [];
        this.filteredPsychologists = [];
        this.currentPage = 1;
        this.psychologistsPerPage = 6;

        this.init();
    }

    init() {
        this.loadPsychologists();
        this.setupEventListeners();
        this.renderPsychologists();

        console.log('👥 ResetMental Psychologists Manager inicializado');
    }

    /**
     * Cargar datos de psicólogos
     */
    loadPsychologists() {
        // Datos simulados de psicólogos
        this.psychologists = [
            {
                id: 1,
                name: "Dra. María González",
                image: "ana-gonzalez.jpg",
                specialty: "Bienestar Digital",
                rating: 4.9,
                reviews: 127,
                price: 45000,
                location: "Virtual",
                avatar: "MG",
                description: "Especialista en bienestar digital con más de 8 años de experiencia ayudando a personas a encontrar equilibrio en su relación con la tecnología.",
                experience: "8 años",
                education: "Psicología Clínica - Universidad Nacional",
                certifications: ["Terapia Cognitiva", "Mindfulness", "Bienestar Digital"],
                availability: {
                    "Lunes": "9:00 - 17:00",
                    "Martes": "9:00 - 17:00",
                    "Miércoles": "9:00 - 17:00",
                    "Jueves": "9:00 - 17:00",
                    "Viernes": "9:00 - 15:00"
                },
                languages: ["Español", "Inglés"],
                approach: "Terapia cognitivo-conductual enfocada en el bienestar digital y la gestión del estrés tecnológico."
            },
            {
                id: 2,
                name: "Dr. Carlos Rodríguez",
                image: "carlos-rodriguez.jpg",
                specialty: "Ansiedad y Estrés",
                rating: 4.8,
                reviews: 95,
                price: 120000,
                location: "Híbrida",
                avatar: "CR",
                description: "Psicólogo especializado en trastornos de ansiedad y estrés, con enfoque en técnicas de relajación y mindfulness.",
                experience: "10 años",
                education: "Psicología - Universidad de los Andes",
                certifications: ["EMDR", "Terapia de Aceptación y Compromiso", "Mindfulness"],
                availability: {
                    "Lunes": "8:00 - 18:00",
                    "Martes": "8:00 - 18:00",
                    "Miércoles": "8:00 - 18:00",
                    "Jueves": "8:00 - 18:00",
                    "Sábado": "9:00 - 13:00"
                },
                languages: ["Español"],
                approach: "Terapia integrativa combinando técnicas cognitivo-conductuales con mindfulness y relajación."
            },
            {
                id: 3,
                name: "Dra. Ana Martínez",
                image: "maria-fernandez.jpg",
                specialty: "Terapia Cognitiva",
                rating: 4.9,
                reviews: 156,
                price: 140000,
                location: "Presencial",
                avatar: "AM",
                description: "Especialista en terapia cognitivo-conductual con amplia experiencia en depresión y trastornos del estado de ánimo.",
                experience: "12 años",
                education: "Psicología Clínica - Universidad Javeriana",
                certifications: ["TCC", "Terapia Dialéctica", "Neuropsicología"],
                availability: {
                    "Lunes": "7:00 - 19:00",
                    "Martes": "7:00 - 19:00",
                    "Miércoles": "7:00 - 19:00",
                    "Jueves": "7:00 - 19:00",
                    "Viernes": "7:00 - 16:00"
                },
                languages: ["Español", "Francés"],
                approach: "Terapia cognitivo-conductual estructurada con énfasis en la reestructuración cognitiva y técnicas de afrontamiento."
            },
            {
                id: 4,
                name: "Dr. Luis Fernández",
                image: "luis-fernandez.jpg",
                specialty: "Mindfulness",
                rating: 4.7,
                reviews: 89,
                price: 35000,
                location: "Virtual",
                avatar: "LF",
                description: "Instructor certificado de mindfulness y meditación, especializado en reducción del estrés y bienestar emocional.",
                experience: "6 años",
                education: "Psicología - Universidad del Rosario",
                certifications: ["MBSR", "Mindfulness", "Meditación"],
                availability: {
                    "Lunes": "10:00 - 20:00",
                    "Martes": "10:00 - 20:00",
                    "Miércoles": "10:00 - 20:00",
                    "Jueves": "10:00 - 20:00",
                    "Domingo": "9:00 - 15:00"
                },
                languages: ["Español", "Inglés"],
                approach: "Programa de reducción del estrés basado en mindfulness (MBSR) y técnicas de meditación."
            },
            {
                id: 5,
                name: "Dra. Patricia Silva",
                image: "sofia-herrera.jpg",
                specialty: "Terapia Familiar",
                rating: 4.8,
                reviews: 112,
                price: 220000,
                location: "Híbrida",
                avatar: "PS",
                description: "Terapeuta familiar sistémica con experiencia en resolución de conflictos y mejora de la comunicación familiar.",
                experience: "15 años",
                education: "Psicología - Universidad Nacional",
                certifications: ["Terapia Sistémica", "Terapia Familiar", "Mediación"],
                availability: {
                    "Lunes": "9:00 - 18:00",
                    "Martes": "9:00 - 18:00",
                    "Miércoles": "9:00 - 18:00",
                    "Jueves": "9:00 - 18:00",
                    "Sábado": "8:00 - 14:00"
                },
                languages: ["Español"],
                approach: "Terapia sistémica familiar enfocada en patrones de comunicación y dinámicas relacionales."
            },
            {
                id: 6,
                name: "Dr. Roberto Vega",
                image: "luis-torres.jpg",
                specialty: "Trauma y EMDR",
                rating: 4.9,
                reviews: 78,
                price: 240000,
                location: "Presencial",
                avatar: "RV",
                description: "Especialista en trauma y EMDR, con amplia experiencia en el tratamiento de trastornos postraumáticos.",
                experience: "11 años",
                education: "Psicología Clínica - Universidad de los Andes",
                certifications: ["EMDR", "Trauma", "Terapia de Exposición"],
                availability: {
                    "Lunes": "8:00 - 17:00",
                    "Martes": "8:00 - 17:00",
                    "Miércoles": "8:00 - 17:00",
                    "Jueves": "8:00 - 17:00",
                    "Viernes": "8:00 - 15:00"
                },
                languages: ["Español", "Inglés"],
                approach: "EMDR y terapia de exposición prolongada para el tratamiento de trauma y trastornos relacionados."
            }
        ];

        this.filteredPsychologists = [...this.psychologists];
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        const specialtyFilter = document.getElementById('specialty-filter');
        const locationFilter = document.getElementById('location-filter');
        const priceFilter = document.getElementById('price-filter');
        const loadMoreBtn = document.getElementById('load-more-btn');

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterPsychologists();
            });
        }

        if (specialtyFilter) {
            specialtyFilter.addEventListener('change', () => {
                this.filterPsychologists();
            });
        }

        if (locationFilter) {
            locationFilter.addEventListener('change', () => {
                this.filterPsychologists();
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', () => {
                this.filterPsychologists();
            });
        }

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePsychologists();
            });
        }
    }

    /**
     * Filtrar psicólogos
     */
    filterPsychologists() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const specialty = document.getElementById('specialty-filter').value;
        const location = document.getElementById('location-filter').value;
        const price = document.getElementById('price-filter').value;

        this.filteredPsychologists = this.psychologists.filter(psychologist => {
            const matchesSearch = !searchTerm ||
                psychologist.name.toLowerCase().includes(searchTerm) ||
                psychologist.specialty.toLowerCase().includes(searchTerm) ||
                psychologist.description.toLowerCase().includes(searchTerm);

            const matchesSpecialty = !specialty ||
                psychologist.specialty.toLowerCase().includes(specialty);

            const matchesLocation = !location ||
                psychologist.location.toLowerCase().includes(location);

            const matchesPrice = !price || this.matchesPriceRange(psychologist.price, price);

            return matchesSearch && matchesSpecialty && matchesLocation && matchesPrice;
        });

        this.currentPage = 1;
        this.renderPsychologists();
    }

    /**
     * Verificar si el precio coincide con el rango
     */
    matchesPriceRange(price, range) {
        switch (range) {
            case '0-50000':
                return price >= 0 && price <= 50000;
            case '100000-150000':
                return price >= 100000 && price <= 150000;
            case '200000-250000':
                return price >= 200000 && price <= 250000;
            default:
                return true;
        }
    }

    /**
     * Renderizar psicólogos
     */
    renderPsychologists() {
        const grid = document.getElementById('psychologists-grid');
        if (!grid) return;

        const startIndex = 0;
        const endIndex = this.currentPage * this.psychologistsPerPage;
        const psychologistsToShow = this.filteredPsychologists.slice(startIndex, endIndex);

        if (psychologistsToShow.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron psicólogos</h3>
                    <p>Intenta ajustar tus filtros de búsqueda</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = psychologistsToShow.map(psychologist => this.createPsychologistCard(psychologist)).join('');

        // Actualizar botón "Cargar más"
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            if (endIndex >= this.filteredPsychologists.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
            }
        }
    }

    /**
     * Crear tarjeta de psicólogo
     */
    createPsychologistCard(psychologist) {
        const stars = '★'.repeat(Math.floor(psychologist.rating)) + '☆'.repeat(5 - Math.floor(psychologist.rating));

        return `
            <div class="psychologist-card" onclick="openPsychologistModal(${psychologist.id})">
                <div class="psychologist-header">
                    <img class="psychologist-avatar" 
                        src="../images/psicologos/${psychologist.image}"
                        alt="${psychologist.name}">

                    <div class="psychologist-info">
                        <h3>${psychologist.name}</h3>
                        <div class="specialty">${psychologist.specialty}</div>
                    </div>
                </div>
                
                <div class="psychologist-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-text">${psychologist.rating} (${psychologist.reviews} reseñas)</span>
                </div>
                
                <div class="psychologist-details">
                    <p>${psychologist.description}</p>
                </div>
                
                <div class="psychologist-tags">
                    <span class="psychologist-tag">${psychologist.experience} de experiencia</span>
                    <span class="psychologist-tag">${psychologist.location}</span>
                    ${psychologist.certifications.slice(0, 2).map(cert =>
            `<span class="psychologist-tag">${cert}</span>`
        ).join('')}
                </div>
                
                <div class="psychologist-footer">
                    <div class="psychologist-price">${PriceFormatter.formatCOP(psychologist.price)}/sesión</div>
                    <div class="psychologist-actions">
                        <button class="btn-psychologist btn-profile" onclick="event.stopPropagation(); openPsychologistModal(${psychologist.id})">
                            Ver Perfil
                        </button>
                        <button class="btn-psychologist btn-contact" onclick="event.stopPropagation(); contactPsychologist(${psychologist.id})">
                            Contactar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Cargar más psicólogos
     */
    loadMorePsychologists() {
        this.currentPage++;
        this.renderPsychologists();
    }

    /**
     * Abrir modal de psicólogo
     */
    openPsychologistModal(psychologistId) {
        const psychologist = this.psychologists.find(p => p.id === psychologistId);
        if (!psychologist) return;

        const modal = document.getElementById('psychologist-modal');
        const modalName = document.getElementById('modal-psychologist-name');
        const modalContent = document.getElementById('modal-psychologist-content');

        if (modalName) {
            modalName.textContent = psychologist.name;
        }

        if (modalContent) {
            modalContent.innerHTML = this.createPsychologistModalContent(psychologist);
        }

        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Crear contenido del modal de psicólogo
     */
    createPsychologistModalContent(psychologist) {
        const stars = '★'.repeat(Math.floor(psychologist.rating)) + '☆'.repeat(5 - Math.floor(psychologist.rating));
        const availabilityHTML = Object.entries(psychologist.availability).map(([day, time]) =>
            `<div class="availability-item">
                <div class="day">${day}</div>
                <div class="time">${time}</div>
            </div>`
        ).join('');

        return `
            <div class="psychologist-detail-header">
                <div class="psychologist-detail-avatar">
                    <img src="../images/psicologos/${psychologist.image}" alt="${psychologist.name}">
                </div>


                <div class="psychologist-detail-info">
                    <h2>${psychologist.name}</h2>
                    <div class="specialty">${psychologist.specialty}</div>
                    <div class="rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-text">${psychologist.rating} (${psychologist.reviews} reseñas)</span>
                    </div>
                </div>
            </div>
            
            <div class="psychologist-detail-content">
                <div class="psychologist-section">
                    <h4>Sobre mí</h4>
                    <p>${psychologist.description}</p>
                </div>
                
                <div class="psychologist-section">
                    <h4>Enfoque Terapéutico</h4>
                    <p>${psychologist.approach}</p>
                </div>
                
                <div class="psychologist-section">
                    <h4>Experiencia y Educación</h4>
                    <ul>
                        <li><strong>Experiencia:</strong> ${psychologist.experience}</li>
                        <li><strong>Educación:</strong> ${psychologist.education}</li>
                        <li><strong>Certificaciones:</strong> ${psychologist.certifications.join(', ')}</li>
                        <li><strong>Idiomas:</strong> ${psychologist.languages.join(', ')}</li>
                    </ul>
                </div>
                
                <div class="psychologist-section">
                    <h4>Disponibilidad</h4>
                    <div class="psychologist-availability">
                        <div class="availability-grid">
                            ${availabilityHTML}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="psychologist-actions-detail">
                <button class="btn-book" onclick="bookSession(${psychologist.id})">
                    Agendar Sesión - ${PriceFormatter.formatCOP(psychologist.price)}
                </button>
                <button class="btn btn-outline" onclick="contactPsychologist(${psychologist.id})">
                    Contactar
                </button>
            </div>
        `;
    }
}

// Funciones globales
function openPsychologistModal(psychologistId) {
    if (window.psychologistsManager) {
        window.psychologistsManager.openPsychologistModal(psychologistId);
    }
}

function closePsychologistModal() {
    const modal = document.getElementById('psychologist-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function contactPsychologist(psychologistId) {
    if (window.resetMentalApp) {
        window.resetMentalApp.showNotification('Función de contacto próximamente disponible', 'info');
    }
}

function bookSession(psychologistId) {
    if (window.resetMentalApp) {
        window.resetMentalApp.showNotification('Sistema de agendamiento próximamente disponible', 'info');
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('psychologist-modal');
    if (modal && e.target === modal) {
        closePsychologistModal();
    }
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.psychologistsManager = new PsychologistsManager();
});

