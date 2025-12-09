/**
 * ResetMental - Sistema de Autenticación
 * 
 * Maneja el sistema completo de autenticación incluyendo:
 * - Login y registro de usuarios
 * - Validaciones de formularios en tiempo real
 * - Gestión de contraseñas y fortaleza
 * - Notificaciones y estados de carga
 */

class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoginForm();
    this.setupRegisterForm();
    this.setupPasswordStrength();

    console.log('ResetMental Auth Manager inicializado');
  }

  /**
   * Configurar formulario de login
   */
  setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin(loginForm);
      });

      // Validación en tiempo real
      const emailInput = loginForm.querySelector('#email');
      const passwordInput = loginForm.querySelector('#password');

      if (emailInput) {
        emailInput.addEventListener('blur', () => {
          this.validateEmail(emailInput);
        });
      }

      if (passwordInput) {
        passwordInput.addEventListener('blur', () => {
          this.validatePassword(passwordInput);
        });
      }
    }
  }

  /**
   * Configurar formulario de registro
   */
  setupRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister(registerForm);
      });

      // Validaciones en tiempo real
      this.setupRealTimeValidation(registerForm);

      // Configurar campo de motivo de registro
      this.setupRegistrationReasonField();

      // Configurar validación de número de documento
      this.setupDocumentNumberValidation();

      // Configurar validación de teléfono
      this.setupPhoneValidation();
    }
  }

  /**
   * Configurar validación de número de documento (solo números)
   */
  setupDocumentNumberValidation() {
    const documentNumberInput = document.getElementById('documentNumber');

    if (documentNumberInput) {
      // Prevenir entrada de caracteres no numéricos
      documentNumberInput.addEventListener('input', (e) => {
        const value = e.target.value;
        // Remover cualquier carácter que no sea número
        const numericValue = value.replace(/\D/g, '');

        if (value !== numericValue) {
          e.target.value = numericValue;
          // Mostrar mensaje de error temporal
          this.showFieldError('documentNumber', 'Solo se permiten números');
          setTimeout(() => {
            this.clearFieldError(documentNumberInput);
          }, 2000);
        }
      });

      // Prevenir pegado de texto no numérico
      documentNumberInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const numericValue = pastedText.replace(/\D/g, '');
        documentNumberInput.value = numericValue;

        if (pastedText !== numericValue) {
          this.showFieldError('documentNumber', 'Solo se permiten números');
          setTimeout(() => {
            this.clearFieldError(documentNumberInput);
          }, 2000);
        }
      });

      // Prevenir teclas no numéricas (excepto teclas de control)
      documentNumberInput.addEventListener('keypress', (e) => {
        const char = String.fromCharCode(e.which);
        if (!/[0-9]/.test(char) && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.showFieldError('documentNumber', 'Solo se permiten números');
          setTimeout(() => {
            this.clearFieldError(documentNumberInput);
          }, 2000);
        }
      });
    }
  }

  /**
   * Configurar validación de teléfono (solo números)
   */
  setupPhoneValidation() {
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
      // Prevenir entrada de caracteres no numéricos
      phoneInput.addEventListener('input', (e) => {
        const value = e.target.value;
        // Remover cualquier carácter que no sea número
        const numericValue = value.replace(/\D/g, '');

        if (value !== numericValue) {
          e.target.value = numericValue;
          // Mostrar mensaje de error temporal
          this.showFieldError('phone', 'Solo se permiten números');
          setTimeout(() => {
            this.clearFieldError(phoneInput);
          }, 2000);
        }
      });

      // Prevenir pegado de texto no numérico
      phoneInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const numericValue = pastedText.replace(/\D/g, '');
        phoneInput.value = numericValue;

        if (pastedText !== numericValue) {
          this.showFieldError('phone', 'Solo se permiten números');
          setTimeout(() => {
            this.clearFieldError(phoneInput);
          }, 2000);
        }
      });

      // Prevenir teclas no numéricas (excepto teclas de control)
      phoneInput.addEventListener('keypress', (e) => {
        const char = String.fromCharCode(e.which);
        if (!/[0-9]/.test(char) && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.showFieldError('phone', 'Solo se permiten números');
          setTimeout(() => {
            this.clearFieldError(phoneInput);
          }, 2000);
        }
      });
    }
  }

  /**
   * Configurar campo de motivo de registro (solo para usuarios generales)
   */
  setupRegistrationReasonField() {
    const userTypeSelect = document.getElementById('userType');
    const registrationReasonGroup = document.getElementById('registrationReasonGroup');
    const registrationReasonField = document.getElementById('registrationReason');

    if (userTypeSelect && registrationReasonGroup && registrationReasonField) {
      userTypeSelect.addEventListener('change', () => {
        const selectedValue = userTypeSelect.value;

        if (selectedValue === 'usuario') {
          // Mostrar campo con animación
          registrationReasonGroup.style.display = 'flex';
          registrationReasonField.setAttribute('required', 'required');

          // Animación suave
          setTimeout(() => {
            registrationReasonGroup.style.opacity = '1';
            registrationReasonGroup.style.transform = 'translateY(0)';
          }, 10);
        } else {
          // Ocultar campo
          registrationReasonGroup.style.opacity = '0';
          registrationReasonGroup.style.transform = 'translateY(-10px)';
          registrationReasonField.removeAttribute('required');
          registrationReasonField.value = '';
          this.clearFieldError(registrationReasonField);

          setTimeout(() => {
            registrationReasonGroup.style.display = 'none';
          }, 300);
        }
      });
    }
  }

  /**
   * Configurar validaciones en tiempo real
   */
  setupRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      // No limpiar errores en tiempo real para el número de documento y teléfono
      // ya que tienen su propia lógica de validación
      if (input.id !== 'documentNumber' && input.id !== 'phone') {
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      }
    });

    // Validación especial para número de documento en blur
    const documentNumberInput = form.querySelector('#documentNumber');
    if (documentNumberInput) {
      documentNumberInput.addEventListener('blur', () => {
        this.validateDocumentNumber(documentNumberInput);
      });
    }

    // Validación especial para teléfono en blur
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
      phoneInput.addEventListener('blur', () => {
        if (phoneInput.value) {
          this.validateField(phoneInput);
        }
      });
    }

    // Validación especial para confirmar contraseña
    const passwordInput = form.querySelector('#password');
    const confirmPasswordInput = form.querySelector('#confirmPassword');

    if (passwordInput && confirmPasswordInput) {
      confirmPasswordInput.addEventListener('input', () => {
        this.validatePasswordMatch(passwordInput, confirmPasswordInput);
      });
    }

    // Validación para el campo de motivo de registro
    const registrationReasonField = form.querySelector('#registrationReason');
    if (registrationReasonField) {
      registrationReasonField.addEventListener('blur', () => {
        this.validateRegistrationReason(registrationReasonField);
      });
    }
  }

  /**
   * Manejar login
   */
  handleLogin(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validar datos
    if (!this.validateLoginData(data)) {
      return;
    }

    // Simular login
    this.showLoading(form);

    setTimeout(() => {
      this.hideLoading(form);
      this.showNotification('¡Bienvenido de vuelta!', 'success');

      // Redirigir al dashboard o página principal
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1500);
    }, 2000);
  }

  /**
   * Manejar registro
   */
  handleRegister(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validar datos
    if (!this.validateRegisterData(data)) {
      return;
    }

    // Simular registro
    this.showLoading(form);

    setTimeout(() => {
      this.hideLoading(form);
      this.showNotification('¡Cuenta creada exitosamente!', 'success');

      // Redirigir al login
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    }, 2000);
  }

  /**
   * Validar datos de login
   */
  validateLoginData(data) {
    const { email, password } = data;

    if (!this.validateEmail({ value: email })) {
      return false;
    }

    if (!this.validatePassword({ value: password })) {
      return false;
    }

    return true;
  }

  /**
   * Validar datos de registro
   */
  validateRegisterData(data) {
    const { firstName, lastName, email, password, confirmPassword, userType, documentType, documentNumber, registrationReason } = data;

    if (!firstName || firstName.trim().length < 2) {
      this.showFieldError('firstName', 'El nombre debe tener al menos 2 caracteres');
      return false;
    }

    if (!lastName || lastName.trim().length < 2) {
      this.showFieldError('lastName', 'El apellido debe tener al menos 2 caracteres');
      return false;
    }

    if (!this.validateEmail({ value: email })) {
      return false;
    }

    if (!documentType) {
      this.showFieldError('documentType', 'Selecciona un tipo de documento');
      return false;
    }

    const documentNumberInput = document.getElementById('documentNumber');
    if (documentNumberInput && !this.validateDocumentNumber(documentNumberInput)) {
      return false;
    }

    if (!this.validatePassword({ value: password })) {
      return false;
    }

    if (password !== confirmPassword) {
      this.showFieldError('confirmPassword', 'Las contraseñas no coinciden');
      return false;
    }

    if (!userType) {
      this.showFieldError('userType', 'Selecciona un tipo de usuario');
      return false;
    }

    // Validar motivo de registro solo para usuarios generales
    if (userType === 'usuario') {
      if (!registrationReason || registrationReason.trim().length < 10) {
        this.showFieldError('registrationReason', 'Por favor, explica brevemente por qué quieres registrarte (mínimo 10 caracteres)');
        return false;
      }
    }

    return true;
  }

  /**
   * Validar campo individual
   */
  validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;

    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        if (value.length < 2) {
          this.showFieldError(fieldName, 'Debe tener al menos 2 caracteres');
          return false;
        }
        break;

      case 'email':
        return this.validateEmail(input);

      case 'password':
        return this.validatePassword(input);

      case 'phone':
        if (value) {
          // Validar que solo contenga números
          if (!/^\d+$/.test(value)) {
            this.showFieldError(fieldName, 'El teléfono solo puede contener números');
            return false;
          }
          // Validar formato de teléfono
          if (!this.isValidPhone(value)) {
            this.showFieldError(fieldName, 'Formato de teléfono inválido');
            return false;
          }
        }
        break;

      case 'documentType':
        if (!value) {
          this.showFieldError(fieldName, 'Selecciona un tipo de documento');
          return false;
        }
        break;

      case 'documentNumber':
        return this.validateDocumentNumber(input);

      case 'registrationReason':
        return this.validateRegistrationReason(input);
    }

    this.clearFieldError(input);
    return true;
  }

  /**
   * Validar número de documento
   */
  validateDocumentNumber(input) {
    const value = input.value.trim();

    if (!value) {
      this.showFieldError('documentNumber', 'El número de documento es requerido');
      return false;
    }

    // Validar que solo contenga números
    if (!/^\d+$/.test(value)) {
      this.showFieldError('documentNumber', 'El número de documento solo puede contener números');
      return false;
    }

    // Validar longitud mínima (por ejemplo, al menos 5 dígitos)
    if (value.length < 5) {
      this.showFieldError('documentNumber', 'El número de documento debe tener al menos 5 dígitos');
      return false;
    }

    // Validar longitud máxima (por ejemplo, máximo 20 dígitos)
    if (value.length > 20) {
      this.showFieldError('documentNumber', 'El número de documento no puede tener más de 20 dígitos');
      return false;
    }

    this.clearFieldError(input);
    return true;
  }

  /**
   * Validar motivo de registro
   */
  validateRegistrationReason(input) {
    const value = input.value.trim();
    const userType = document.getElementById('userType')?.value;

    // Solo validar si el tipo de usuario es "usuario"
    if (userType !== 'usuario') {
      this.clearFieldError(input);
      return true;
    }

    if (!value) {
      this.showFieldError('registrationReason', 'Por favor, explica por qué quieres registrarte');
      return false;
    }

    if (value.length < 10) {
      this.showFieldError('registrationReason', 'El motivo debe tener al menos 10 caracteres');
      return false;
    }

    this.clearFieldError(input);
    return true;
  }

  /**
   * Validar email
   */
  validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      this.showFieldError('email', 'El correo electrónico es requerido');
      return false;
    }

    if (!emailRegex.test(email)) {
      this.showFieldError('email', 'Formato de correo electrónico inválido');
      return false;
    }

    this.clearFieldError(input);
    return true;
  }

  /**
   * Validar contraseña
   */
  validatePassword(input) {
    const password = input.value;

    if (!password) {
      this.showFieldError('password', 'La contraseña es requerida');
      return false;
    }

    if (password.length < 8) {
      this.showFieldError('password', 'La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      this.showFieldError('password', 'La contraseña debe contener al menos una mayúscula, una minúscula y un número');
      return false;
    }

    this.clearFieldError(input);
    return true;
  }

  /**
       * Validar coincidencia de contraseñas
       */
  validatePasswordMatch(passwordInput, confirmInput) {
    if (confirmInput.value && passwordInput.value !== confirmInput.value) {
      this.showFieldError('confirmPassword', 'Las contraseñas no coinciden');
      return false;
    }

    this.clearFieldError(confirmInput);
    return true;
  }

  /**
   * Validar teléfono
   */
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Mostrar error en campo
   */
  showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;

    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.add('error');

    // Remover mensaje de error existente
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Agregar nuevo mensaje de error con animación
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.opacity = '0';
    errorMessage.style.transform = 'translateY(-10px)';
    formGroup.appendChild(errorMessage);

    // Animar entrada del mensaje
    setTimeout(() => {
      errorMessage.style.transition = 'all 0.3s ease';
      errorMessage.style.opacity = '1';
      errorMessage.style.transform = 'translateY(0)';
    }, 10);

    // Efecto de vibración en el campo
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      field.style.animation = '';
    }, 500);
  }

  /**
   * Limpiar error de campo
   */
  clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.remove('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  /**
   * Configurar indicador de fortaleza de contraseña
   */
  setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput && strengthBar && strengthText) {
      passwordInput.addEventListener('input', () => {
        const strength = this.calculatePasswordStrength(passwordInput.value);
        this.updatePasswordStrength(strength, strengthBar, strengthText);
      });
    }
  }

  /**
       * Calcular fortaleza de contraseña
       */
  calculatePasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 2) return { level: 'weak', text: 'Débil' };
    if (score < 4) return { level: 'fair', text: 'Regular' };
    if (score < 6) return { level: 'good', text: 'Buena' };
    return { level: 'strong', text: 'Fuerte' };
  }

  /**
   * Actualizar indicador de fortaleza
   */
  updatePasswordStrength(strength, bar, text) {
    bar.className = `strength-fill ${strength.level}`;
    text.textContent = strength.text;
  }


  /**
   * Mostrar estado de carga
   */
  showLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = 'Procesando...';
    }
  }

  /**
   * Ocultar estado de carga
   */
  hideLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      const originalText = form.id === 'login-form' ? 'Iniciar Sesión' : 'Crear Cuenta';
      submitBtn.innerHTML = originalText;
    }
  }

  /**
   * Mostrar notificación
   */
  showNotification(message, type = 'info') {
    if (window.resetMentalApp) {
      window.resetMentalApp.showNotification(message, type);
    }
  }
}

// Funciones globales
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggle = input.parentElement.querySelector('.password-toggle i');

  if (input.type === 'password') {
    input.type = 'text';
    toggle.classList.remove('fa-eye');
    toggle.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    toggle.classList.remove('fa-eye-slash');
    toggle.classList.add('fa-eye');
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new AuthManager();
});