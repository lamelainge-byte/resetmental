/**
 * ResetMental - Página de Psicólogos
 * Maneja la funcionalidad de búsqueda, filtros y visualización de psicólogos
 * Última actualización: 2025-01-27 - Dr. Luis Fernández actualizado
 */

const PSICO_API_BASE_URL = window.apiClient?.API_BASE_URL || '';

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
        this.setupEventListeners();
        this.loadPsychologists();

        console.log('👥 ResetMental Psychologists Manager inicializado - v3');
        console.log('Dr. Luis Fernández - Especialidad:', this.psychologists.find(p => p.id === 4)?.specialty, 'Precio:', this.psychologists.find(p => p.id === 4)?.price);
    }

    /**
     * Cargar datos de psicólogos
     */
    async loadPsychologists() {
        const fallbackImages = [
            "ana-gonzalez.jpg",
            "carlos-rodriguez.jpg",
            "maria-fernandez.jpg",
            "luis-fernandez.jpg",
            "sofia-herrera.jpg",
            "luis-torres.jpg",
        ];

        // Verificar que la URL del API esté configurada
        if (!PSICO_API_BASE_URL) {
            console.error("❌ API_BASE_URL no está configurada. Verifica apiClient.js");
            this.psychologists = [];
            this.filteredPsychologists = [];
            this.renderPsychologists();
            return;
        }

        try {
            console.log(`🔍 Cargando psicólogos desde: ${PSICO_API_BASE_URL}/psicologos/`);

            const response = await fetch(`${PSICO_API_BASE_URL}/psicologos/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(`📡 Respuesta del servidor:`, response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error del servidor:", errorText);
                throw new Error(`Error ${response.status}: ${errorText || "No se pudieron cargar los psicólogos."}`);
            }

            const data = await response.json();
            console.log(`✅ Psicólogos cargados:`, data.length);

            if (!Array.isArray(data) || data.length === 0) {
                console.warn("⚠️ No hay psicólogos en la base de datos");
                this.psychologists = [];
            } else {
                this.psychologists = data.map((item, index) => ({
                    id: item.psicologos_id,
                    name: `${item.psicologos_name || ''} ${item.psicologos_lastname || ''}`.trim() || 'Psicólogo',
                    image: fallbackImages[index % fallbackImages.length],
                    specialty: item.especialidad || "Especialista en bienestar",
                    rating: 4.8,
                    reviews: 42 + index * 3,
                    price: Number(item.precio_cita || 0),
                    location: (item.modalidad || "Virtual").toUpperCase(),
                    avatar: (item.psicologos_name || "PS").slice(0, 2).toUpperCase(),
                    description: item.curriculom || "Profesional enfocado en tu bienestar emocional y digital.",
                    experience: item.experiencia_anios ? `${item.experiencia_anios} años` : "Experiencia no indicada",
                    education: item.universidad || "Universidad no registrada",
                    certifications: ["Psicología", "Bienestar digital"],
                    availability: {
                        "Lunes": "9:00 - 17:00",
                        "Martes": "9:00 - 17:00",
                        "Miércoles": "9:00 - 17:00",
                        "Jueves": "9:00 - 17:00",
                        "Viernes": "9:00 - 15:00"
                    },
                    languages: ["Español"],
                    approach: item.curriculom || "Acompañamiento integral con enfoque humano.",
                }));
            }
        } catch (error) {
            console.error("❌ Error al cargar psicólogos:", error);
            console.error("Detalles:", error.message);
            this.psychologists = [];

            // Mostrar mensaje de error en la página
            const grid = document.getElementById('psychologists-grid');
            if (grid) {
                grid.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Error al cargar psicólogos</h3>
                        <p>${error.message}</p>
                        <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
                            Verifica que el backend esté corriendo en http://localhost:8000
                        </p>
                    </div>
                `;
            }
        }

        this.filteredPsychologists = [...this.psychologists];
        this.renderPsychologists();
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
     * Abrir modal de agendamiento de cita
     */
    openBookingModal(psychologistId) {
        const psychologist = this.psychologists.find(p => p.id === psychologistId);
        if (!psychologist) {
            if (window.resetMentalApp) {
                window.resetMentalApp.showNotification('Psicólogo no encontrado', 'error');
            }
            return;
        }

        // Verificar que el usuario esté autenticado y sea cliente
        const session = window.apiClient?.getSession();
        if (!session?.access) {
            if (window.resetMentalApp) {
                window.resetMentalApp.showNotification('Debes iniciar sesión para agendar una cita', 'error');
            }
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        if (!session?.user?.customer_id) {
            if (window.resetMentalApp) {
                window.resetMentalApp.showNotification('Solo los clientes pueden agendar citas', 'error');
            }
            return;
        }

        this.createBookingModal(psychologist);
    }

    /**
     * Crear modal de agendamiento
     */
    createBookingModal(psychologist) {
        // Remover modal existente si hay uno
        const existingModal = document.getElementById('booking-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'booking-modal';
        modal.className = 'psychologist-modal active';
        modal.innerHTML = `
            <div class="modal-content booking-modal-content">
                <div class="modal-header">
                    <h3>Agendar Cita con ${psychologist.name}</h3>
                    <button class="close-btn" onclick="closeBookingModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="booking-form" class="booking-form">
                        <div class="booking-info">
                            <div class="booking-psychologist-info">
                                <div class="booking-psychologist-avatar">
                                    <img src="../images/psicologos/${psychologist.image}" alt="${psychologist.name}">
                                </div>
                                <div class="booking-psychologist-details">
                                    <h4>${psychologist.name}</h4>
                                    <p class="booking-specialty">${psychologist.specialty}</p>
                                    <p class="booking-price">${PriceFormatter.formatCOP(psychologist.price)}/sesión</p>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="booking-date">Fecha de la cita <span class="required">*</span></label>
                            <input 
                                type="date" 
                                id="booking-date" 
                                name="date" 
                                required 
                                min="${this.getMinDate()}"
                                aria-required="true"
                            >
                            <span class="form-help">Selecciona la fecha para tu cita</span>
                        </div>

                        <div class="form-group">
                            <label for="booking-time">Hora de la cita <span class="required">*</span></label>
                            <input 
                                type="time" 
                                id="booking-time" 
                                name="time" 
                                required 
                                min="08:00"
                                max="18:00"
                                aria-required="true"
                            >
                            <span class="form-help">Horario disponible: 8:00 AM - 6:00 PM</span>
                        </div>

                        <div class="form-group">
                            <label for="booking-modality">Modalidad <span class="required">*</span></label>
                            <select id="booking-modality" name="modality" required aria-required="true">
                                <option value="">Selecciona una modalidad</option>
                                <option value="VIRTUAL">Virtual</option>
                                <option value="PRESENCIAL">Presencial</option>
                            </select>
                            <span class="form-help">Elige cómo deseas realizar tu sesión</span>
                        </div>

                        <div class="booking-summary">
                            <div class="summary-item">
                                <span class="summary-label">Precio:</span>
                                <span class="summary-value">${PriceFormatter.formatCOP(psychologist.price)}</span>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" onclick="closeBookingModal()">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Confirmar Cita</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Configurar formulario
        this.setupBookingForm(psychologist);
    }

    /**
     * Obtener fecha mínima (hoy)
     */
    getMinDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Configurar formulario de agendamiento
     */
    setupBookingForm(psychologist) {
        const form = document.getElementById('booking-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!this.validateBookingForm(form)) {
                return;
            }

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            await this.submitBooking(psychologist, data);
        });
    }

    /**
     * Validar formulario de agendamiento
     */
    validateBookingForm(form) {
        const date = form.querySelector('#booking-date').value;
        const time = form.querySelector('#booking-time').value;
        const modality = form.querySelector('#booking-modality').value;

        if (!date) {
            if (window.resetMentalApp) {
                window.resetMentalApp.showNotification('Por favor, selecciona una fecha', 'error');
            }
            form.querySelector('#booking-date').focus();
            return false;
        }

        if (!time) {
            if (window.resetMentalApp) {
                window.resetMentalApp.showNotification('Por favor, selecciona una hora', 'error');
            }
            form.querySelector('#booking-time').focus();
            return false;
        }

        if (!modality) {
            if (window.resetMentalApp) {
                window.resetMentalApp.showNotification('Por favor, selecciona una modalidad', 'error');
            }
            form.querySelector('#booking-modality').focus();
            return false;
        }

        // Validar que la fecha no sea en el pasado
        const selectedDate = new Date(`${date}T${time}`);
        const now = new Date();
        // Permitir citas desde hoy en adelante (con margen de 1 hora)
        now.setHours(now.getHours() + 1);
        if (selectedDate < now) {
            if (window.resetMentalApp) {
                window.resetMentalApp.showNotification('No puedes agendar una cita en el pasado. Selecciona una fecha y hora futura.', 'error');
            }
            form.querySelector('#booking-date').focus();
            return false;
        }

        return true;
    }

    /**
     * Enviar agendamiento de cita
     */
    async submitBooking(psychologist, formData) {
        const session = window.apiClient?.getSession();
        if (!session?.access || !session?.user?.customer_id) {
            if (window.resetMentalApp) {
                window.resetMentalApp.showNotification('Debes iniciar sesión para agendar una cita', 'error');
            }
            return;
        }

        const submitBtn = document.querySelector('#booking-form button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Confirmando...';
        }

        try {
            const payload = {
                customer: session.user.customer_id,
                psicologos: psychologist.id,
                cita_fecha: formData.date,
                cita_hora: formData.time + ':00', // Agregar segundos
                cita_modalidad: formData.modality,
                cita_valor: psychologist.price.toString(),
            };

            console.log('Enviando cita:', payload);

            const fetchFn = window.apiClient.fetchWithAuth || fetch;
            const headers = window.apiClient.authHeaders();

            const response = await fetchFn(
                `${PSICO_API_BASE_URL}/citas/`,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                }
            );

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                const text = await response.text();
                console.error('Error del servidor (no JSON):', text);
                throw new Error(`Error del servidor (${response.status}): ${response.statusText}`);
            }

            if (!response.ok) {
                if (response.status === 401) {
                    window.apiClient?.clearSession();
                    throw new Error('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
                }

                const detail = result?.detail || result?.error || `Error ${response.status}: ${response.statusText}`;
                throw new Error(detail);
            }

            if (window.resetMentalApp) {
                window.resetMentalApp.showNotification('¡Cita agendada exitosamente!', 'success');
            }

            // Cerrar modal después de un breve delay
            setTimeout(() => {
                closeBookingModal();
            }, 1000);

        } catch (error) {
            console.error('Error al agendar cita:', error);
            if (window.resetMentalApp) {
                window.resetMentalApp.showNotification(error.message || 'No se pudo agendar la cita. Intenta de nuevo.', 'error');
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Confirmar Cita';
            }
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
                    Agendar Cita
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
    if (window.psychologistsManager) {
        window.psychologistsManager.openBookingModal(psychologistId);
    }
}

function bookSession(psychologistId) {
    if (window.psychologistsManager) {
        window.psychologistsManager.openBookingModal(psychologistId);
    }
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('psychologist-modal');
    if (modal && e.target === modal) {
        closePsychologistModal();
    }

    const bookingModal = document.getElementById('booking-modal');
    if (bookingModal && e.target === bookingModal) {
        closeBookingModal();
    }
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.psychologistsManager = new PsychologistsManager();
});

