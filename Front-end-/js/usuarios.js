/**
 * ResetMental - Vista de Usuarios para Psicólogos
 * Maneja la visualización de citas pendientes para psicólogos
 */

const USUARIOS_API_BASE_URL = window.apiClient?.API_BASE_URL || '';

class UsuariosManager {
    constructor() {
        this.citas = [];
        this.filteredCitas = [];
        this.init();
    }

    init() {
        // Verificar que el usuario sea psicólogo
        if (!window.apiClient?.isPsychologist()) {
            console.warn('Esta vista es solo para psicólogos');
            // Redirigir a la página principal si no es psicólogo
            window.location.href = '../index.html';
            return;
        }

        this.loadCitas();
        console.log('ResetMental Usuarios Manager inicializado');
    }

    /**
     * Cargar citas pendientes del psicólogo
     */
    async loadCitas() {
        const session = window.apiClient?.getSession();
        if (!session?.user?.psicologos_id) {
            console.error('No se encontró el ID del psicólogo en la sesión');
            console.error('Sesión completa:', session);
            this.showError('No se pudo identificar tu perfil de psicólogo. Por favor, inicia sesión nuevamente.');
            return;
        }

        const psicologoId = session.user.psicologos_id;
        console.log('👤 ID del psicólogo desde sesión:', psicologoId, typeof psicologoId);

        if (!USUARIOS_API_BASE_URL) {
            console.error("❌ API_BASE_URL no está configurada. Verifica apiClient.js");
            this.showError('Configura la URL del backend para cargar las citas');
            return;
        }

        try {
            console.log(`🔍 Cargando citas para psicólogo ID: ${psicologoId}`);

            // Usar fetchWithAuth si está disponible, sino usar fetch normal
            const fetchFn = window.apiClient.fetchWithAuth || fetch;
            const headers = window.apiClient.authHeaders();

            const response = await fetchFn(
                `${USUARIOS_API_BASE_URL}/citas/`,
                {
                    method: 'GET',
                    headers: headers,
                }
            );

            if (!response.ok) {
                // Si es error de autenticación, sugerir re-login
                if (response.status === 401) {
                    window.apiClient?.clearSession();
                    throw new Error('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
                }

                let errorText;
                try {
                    const errorData = await response.json();
                    errorText = errorData.detail || errorData.error || JSON.stringify(errorData);
                } catch {
                    errorText = await response.text();
                }

                console.error("❌ Error del servidor:", errorText);
                throw new Error(`Error ${response.status}: ${errorText || "No se pudieron cargar las citas."}`);
            }

            const data = await response.json();
            console.log(`✅ Citas cargadas:`, data.length);
            console.log(`📋 Primera cita de ejemplo:`, data[0]);

            // Asegurar que psicologoId sea número para comparación
            const psicologoIdNum = Number(psicologoId);

            // Filtrar solo las citas pendientes del psicólogo actual
            // El serializer de Django devuelve el ID del ForeignKey como número
            this.citas = data
                .filter(cita => {
                    // Manejar tanto si viene como número o string
                    const citaPsicologoId = Number(cita.psicologos);
                    const esDelPsicologo = citaPsicologoId === psicologoIdNum;
                    const esPendiente = cita.cita_estado === 'PENDIENTE';

                    return esDelPsicologo && esPendiente;
                })
                .map(cita => ({
                    id: cita.cita_id,
                    fecha: cita.cita_fecha,
                    hora: cita.cita_hora,
                    modalidad: cita.cita_modalidad,
                    estado: cita.cita_estado,
                    valor: cita.cita_valor,
                    customer: cita.customer,
                }));

            console.log(`✅ Citas pendientes del psicólogo:`, this.citas.length);
            this.filteredCitas = [...this.citas];
            this.renderCitas();
        } catch (error) {
            console.error("❌ Error al cargar citas:", error);
            this.showError(error.message || 'No se pudieron cargar las citas');
        }
    }

    /**
     * Renderizar citas
     */
    renderCitas() {
        const container = document.getElementById('citas-container');
        if (!container) return;

        if (this.filteredCitas.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-calendar-check"></i>
                    <h3>No hay citas pendientes</h3>
                    <p>No tienes citas pendientes en este momento</p>
                </div>
            `;
            return;
        }

        // Ordenar citas por fecha y hora (más próximas primero)
        const sortedCitas = [...this.filteredCitas].sort((a, b) => {
            // El backend devuelve fecha como YYYY-MM-DD y hora como HH:MM:SS o HH:MM
            // Construir fecha completa para comparación
            const fechaHoraA = `${a.fecha}T${a.hora}`;
            const fechaHoraB = `${b.fecha}T${b.hora}`;

            const dateA = new Date(fechaHoraA);
            const dateB = new Date(fechaHoraB);

            // Si alguna fecha es inválida, ponerla al final
            if (isNaN(dateA.getTime())) return 1;
            if (isNaN(dateB.getTime())) return -1;

            return dateA - dateB;
        });

        container.innerHTML = sortedCitas.map(cita => this.createCitaCard(cita)).join('');
    }

    /**
     * Crear tarjeta de cita
     */
    createCitaCard(cita) {
        // El backend devuelve fecha en formato YYYY-MM-DD
        // Crear fecha correctamente (agregar zona horaria si es necesario)
        let fecha;
        if (cita.fecha.includes('T')) {
            fecha = new Date(cita.fecha);
        } else {
            // Si solo viene la fecha sin hora, agregar hora local
            fecha = new Date(cita.fecha + 'T00:00:00');
        }

        // Verificar que la fecha sea válida
        if (isNaN(fecha.getTime())) {
            console.warn('Fecha inválida:', cita.fecha);
            fecha = new Date(); // Fallback a fecha actual
        }

        const fechaFormateada = fecha.toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // El backend devuelve hora en formato HH:MM:SS o HH:MM
        const horaFormateada = cita.hora.substring(0, 5); // Formato HH:MM

        const modalidadIcon = cita.modalidad === 'VIRTUAL'
            ? '<i class="fas fa-video"></i>'
            : '<i class="fas fa-user"></i>';

        const modalidadTexto = cita.modalidad === 'VIRTUAL' ? 'Virtual' : 'Presencial';

        return `
            <div class="cita-card">
                <div class="cita-header">
                    <div class="cita-fecha">
                        <i class="fas fa-calendar-alt"></i>
                        <div>
                            <div class="cita-dia">${fechaFormateada}</div>
                            <div class="cita-hora">
                                <i class="fas fa-clock"></i>
                                ${horaFormateada}
                            </div>
                        </div>
                    </div>
                    <div class="cita-modalidad ${cita.modalidad.toLowerCase()}">
                        ${modalidadIcon}
                        <span>${modalidadTexto}</span>
                    </div>
                </div>
                <div class="cita-body">
                    <div class="cita-info">
                        <div class="cita-label">Cliente ID:</div>
                        <div class="cita-value">${cita.customer}</div>
                    </div>
                    <div class="cita-info">
                        <div class="cita-label">Estado:</div>
                        <div class="cita-estado estado-${cita.estado.toLowerCase()}">${cita.estado}</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Mostrar error
     */
    showError(message) {
        const container = document.getElementById('citas-container');
        if (container) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error al cargar citas</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.usuariosManager = new UsuariosManager();
});

