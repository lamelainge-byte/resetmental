const API_BASE_URL = "http://localhost:8000";

const STORAGE_KEYS = {
    ACCESS: "rm_access_token",
    REFRESH: "rm_refresh_token",
    USER: "rm_user",
};

function getSession() {
    const access = localStorage.getItem(STORAGE_KEYS.ACCESS);
    const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH);
    const userRaw = localStorage.getItem(STORAGE_KEYS.USER);

    return {
        access,
        refresh,
        user: userRaw ? JSON.parse(userRaw) : null,
    };
}

function saveSession({ access, refresh, user }) {
    if (access) localStorage.setItem(STORAGE_KEYS.ACCESS, access);
    if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function clearSession() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

function authHeaders(extra = {}) {
    const { access } = getSession();
    const headers = {
        "Content-Type": "application/json",
        ...extra,
    };

    if (access) {
        headers["Authorization"] = `Bearer ${access}`;
    }

    return headers;
}

/**
 * Refrescar token cuando expire
 */
async function refreshToken() {
    const { refresh } = getSession();
    if (!refresh) {
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh }),
        });

        if (response.ok) {
            const data = await response.json();
            const session = getSession();
            saveSession({
                access: data.access,
                refresh: refresh, // Mantener el refresh token
                user: session.user,
            });
            return data.access;
        }
    } catch (error) {
        console.error('Error al refrescar token:', error);
    }

    return null;
}

/**
 * Hacer petición con reintento automático si el token expira
 */
async function fetchWithAuth(url, options = {}) {
    let response = await fetch(url, options);

    // Si el token expiró (401), intentar refrescar
    if (response.status === 401) {
        const newAccess = await refreshToken();
        if (newAccess) {
            // Reintentar con el nuevo token
            const newHeaders = {
                ...options.headers,
                Authorization: `Bearer ${newAccess}`,
            };
            response = await fetch(url, {
                ...options,
                headers: newHeaders,
            });
        } else {
            // Si no se pudo refrescar, limpiar sesión
            clearSession();
            throw new Error('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
        }
    }

    return response;
}

/**
 * Obtener el rol del usuario desde la sesión
 */
function getUserRole() {
    const session = getSession();
    if (!session?.user) return null;

    // El rol puede estar en user.rol.rol o directamente en user.rol
    const rol = session.user.rol;
    if (rol && typeof rol === 'object' && rol.rol) {
        return rol.rol; // "CLIENTE" o "PSICOLOGO"
    }
    return null;
}

/**
 * Verificar si el usuario es psicólogo
 */
function isPsychologist() {
    return getUserRole() === 'PSICOLOGO';
}

/**
 * Verificar si el usuario es cliente
 */
function isClient() {
    return getUserRole() === 'CLIENTE';
}

window.apiClient = {
    API_BASE_URL,
    getSession,
    saveSession,
    clearSession,
    authHeaders,
    refreshToken,
    fetchWithAuth,
    getUserRole,
    isPsychologist,
    isClient,
};


