// Translation system for bilingual support
class TranslationManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                'app.title': 'Desert Telehealth',
                'emergency.button': 'Emergency',
                'welcome.title': 'Welcome to Desert Telehealth',
                'welcome.description': 'This offline medical assistant helps assess common desert-related health conditions. Choose an option below to get started.',
                'features.image.title': 'Image Analysis',
                'features.image.description': 'Upload or capture images for medical assessment',
                'features.symptoms.title': 'Symptom Assessment',
                'features.symptoms.description': 'Answer questions about your symptoms',
                'features.chat.title': 'Medical Assistant',
                'features.chat.description': 'Chat with our AI medical assistant',
                'features.demo.title': 'Demo Mode',
                'features.demo.description': 'Try the app with sample data',
                'status.offline': 'Offline Mode Active',
                'common.back': 'Back',
                'common.close': 'Close',
                'common.loading': 'Loading...',
                'common.analyzing': 'Analyzing image...',
                'image.title': 'Medical Image Analysis',
                'image.upload.instruction': 'Drop image here or click to upload',
                'image.analyze': 'Analyze Image',
                'image.retake': 'Retake',
                'symptoms.title': 'Symptom Assessment',
                'chat.title': 'Medical Assistant',
                'chat.welcome': 'Hello! I\'m your medical assistant. How can I help you today?',
                'chat.placeholder': 'Type your message...',
                'chat.quick.dehydration': 'Signs of dehydration',
                'chat.quick.heat': 'Heat exhaustion symptoms',
                'chat.quick.emergency': 'Emergency situations',
                'demo.title': 'Demo Mode',
                'demo.description': 'Try the app features with pre-loaded sample data. This demonstrates how the app works in real scenarios.',
                'demo.image': 'Demo Image Analysis',
                'demo.symptoms': 'Demo Symptom Assessment',
                'demo.chat': 'Demo Medical Chat',
                'emergency.title': 'Emergency Resources',
                'emergency.warning': 'If this is a life-threatening emergency, seek immediate medical attention or call emergency services.',
                'emergency.severe.title': 'Severe Dehydration',
                'emergency.severe.symptom1': 'Extreme thirst',
                'emergency.severe.symptom2': 'Little or no urination',
                'emergency.severe.symptom3': 'Sunken eyes',
                'emergency.severe.symptom4': 'Confusion or irritability',
                'emergency.severe.action': 'Seek immediate medical attention',
                'emergency.heat.title': 'Heat Stroke',
                'emergency.heat.symptom1': 'High body temperature (104°F+)',
                'emergency.heat.symptom2': 'Hot, dry skin or profuse sweating',
                'emergency.heat.symptom3': 'Rapid, strong pulse',
                'emergency.heat.symptom4': 'Confusion or unconsciousness',
                'emergency.heat.action': 'Call emergency services immediately',
                'emergency.contacts.title': 'Emergency Contacts',
                'emergency.contacts.general': 'General Emergency:',
                'emergency.contacts.poison': 'Poison Control:',
                'results.title': 'Assessment Results',
                'results.print': 'Print Results',
                'results.download': 'Download'
            },
            es: {
                'app.title': 'Telesalud del Desierto',
                'emergency.button': 'Emergencia',
                'welcome.title': 'Bienvenido a Telesalud del Desierto',
                'welcome.description': 'Este asistente médico sin conexión ayuda a evaluar condiciones de salud comunes relacionadas con el desierto. Elija una opción a continuación para comenzar.',
                'features.image.title': 'Análisis de Imagen',
                'features.image.description': 'Suba o capture imágenes para evaluación médica',
                'features.symptoms.title': 'Evaluación de Síntomas',
                'features.symptoms.description': 'Responda preguntas sobre sus síntomas',
                'features.chat.title': 'Asistente Médico',
                'features.chat.description': 'Chatee con nuestro asistente médico IA',
                'features.demo.title': 'Modo Demo',
                'features.demo.description': 'Pruebe la aplicación con datos de muestra',
                'status.offline': 'Modo Sin Conexión Activo',
                'common.back': 'Atrás',
                'common.close': 'Cerrar',
                'common.loading': 'Cargando...',
                'common.analyzing': 'Analizando imagen...',
                'image.title': 'Análisis de Imagen Médica',
                'image.upload.instruction': 'Suelte la imagen aquí o haga clic para subir',
                'image.analyze': 'Analizar Imagen',
                'image.retake': 'Tomar Otra',
                'symptoms.title': 'Evaluación de Síntomas',
                'chat.title': 'Asistente Médico',
                'chat.welcome': '¡Hola! Soy su asistente médico. ¿Cómo puedo ayudarle hoy?',
                'chat.placeholder': 'Escriba su mensaje...',
                'chat.quick.dehydration': 'Signos de deshidratación',
                'chat.quick.heat': 'Síntomas de agotamiento por calor',
                'chat.quick.emergency': 'Situaciones de emergencia',
                'demo.title': 'Modo Demo',
                'demo.description': 'Pruebe las funciones de la aplicación con datos de muestra precargados. Esto demuestra cómo funciona la aplicación en escenarios reales.',
                'demo.image': 'Demo Análisis de Imagen',
                'demo.symptoms': 'Demo Evaluación de Síntomas',
                'demo.chat': 'Demo Chat Médico',
                'emergency.title': 'Recursos de Emergencia',
                'emergency.warning': 'Si esta es una emergencia que amenaza la vida, busque atención médica inmediata o llame a los servicios de emergencia.',
                'emergency.severe.title': 'Deshidratación Severa',
                'emergency.severe.symptom1': 'Sed extrema',
                'emergency.severe.symptom2': 'Poca o ninguna orina',
                'emergency.severe.symptom3': 'Ojos hundidos',
                'emergency.severe.symptom4': 'Confusión o irritabilidad',
                'emergency.severe.action': 'Busque atención médica inmediata',
                'emergency.heat.title': 'Golpe de Calor',
                'emergency.heat.symptom1': 'Temperatura corporal alta (104°F+)',
                'emergency.heat.symptom2': 'Piel caliente y seca o sudoración profusa',
                'emergency.heat.symptom3': 'Pulso rápido y fuerte',
                'emergency.heat.symptom4': 'Confusión o inconsciencia',
                'emergency.heat.action': 'Llame a los servicios de emergencia inmediatamente',
                'emergency.contacts.title': 'Contactos de Emergencia',
                'emergency.contacts.general': 'Emergencia General:',
                'emergency.contacts.poison': 'Control de Venenos:',
                'results.title': 'Resultados de Evaluación',
                'results.print': 'Imprimir Resultados',
                'results.download': 'Descargar'
            }
        };
        
        this.init();
    }
    
    init() {
        this.updateLanguageDisplay();
        this.translatePage();
    }
    
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'es' : 'en';
        localStorage.setItem('language', this.currentLanguage);
        this.updateLanguageDisplay();
        this.translatePage();
        
        // Show toast notification
        const message = this.currentLanguage === 'en' ? 'Language changed to English' : 'Idioma cambiado a Español';
        showToast(message, 'success');
    }
    
    updateLanguageDisplay() {
        const langButton = document.getElementById('currentLang');
        if (langButton) {
            langButton.textContent = this.currentLanguage.toUpperCase();
        }
    }
    
    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Handle placeholder translations
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = this.getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });
    }
    
    getTranslation(key) {
        return this.translations[this.currentLanguage]?.[key] || this.translations.en[key] || key;
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize translation manager
let translationManager;

document.addEventListener('DOMContentLoaded', () => {
    translationManager = new TranslationManager();
    
    // Add language toggle event listener
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            translationManager.toggleLanguage();
        });
    }
});

// Export for use in other modules
window.translationManager = translationManager;