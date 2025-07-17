// Main application controller for Desert Telehealth
class DesertTelehealthApp {
    constructor() {
        this.currentSection = 'welcomeSection';
        this.isInitialized = false;
    }
    
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Show loading
            Utils.showLoading('Initializing Desert Telehealth...');
            
            // Initialize core components
            await this.initializeComponents();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup PWA features
            this.setupPWA();
            
            // Load user preferences
            this.loadUserPreferences();
            
            // Setup analytics
            this.initializeAnalytics();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Hide loading
            Utils.hideLoading();
            
            // Show welcome message
            const currentLang = translationManager?.getCurrentLanguage() || 'en';
            Utils.showToast(
                currentLang === 'es' ? 
                    'Desert Telehealth listo para usar sin conexión' : 
                    'Desert Telehealth ready for offline use',
                'success'
            );
            
            console.log('Desert Telehealth App initialized successfully');
            
        } catch (error) {
            Utils.hideLoading();
            Utils.handleError(error, 'App Initialization');
        }
    }
    
    async initializeComponents() {
        // Initialize translation system
        if (typeof translationManager === 'undefined') {
            await new Promise(resolve => {
                const checkTranslations = () => {
                    if (typeof translationManager !== 'undefined') {
                        resolve();
                    } else {
                        setTimeout(checkTranslations, 100);
                    }
                };
                checkTranslations();
            });
        }
        
        // Initialize medical data
        if (typeof MedicalData === 'undefined') {
            throw new Error('Medical data not loaded');
        }
        
        // Initialize modules
        if (typeof imageAnalyzer !== 'undefined') {
            imageAnalyzer.init();
        }
        
        if (typeof symptomAssessment !== 'undefined') {
            symptomAssessment.init();
        }
        
        if (typeof medicalChatbot !== 'undefined') {
            medicalChatbot.init();
        }
    }
    
    setupEventListeners() {
        // Emergency button
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.showEmergency());
        }
        
        // Modal close events
        const modal = document.getElementById('resultsModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    Utils.closeModal();
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Utils.closeModal();
                this.hideEmergency();
            }
        });
        
        // Handle browser back button
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.showSection(e.state.section, false);
            }
        });
        
        // Handle visibility change for analytics
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackSessionEnd();
            } else {
                this.trackSessionStart();
            }
        });
        
        // Handle beforeunload for cleanup
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }
    
    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
        
        // Handle install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button or notification
            const currentLang = translationManager?.getCurrentLanguage() || 'en';
            Utils.showToast(
                currentLang === 'es' ? 
                    'Puede instalar esta aplicación para uso sin conexión' : 
                    'You can install this app for offline use',
                'info',
                5000
            );
        });
        
        // Handle app installation
        window.addEventListener('appinstalled', () => {
            const currentLang = translationManager?.getCurrentLanguage() || 'en';
            Utils.showToast(
                currentLang === 'es' ? 
                    'Aplicación instalada exitosamente' : 
                    'App installed successfully',
                'success'
            );
            Utils.trackEvent('pwa', 'installed');
        });
    }
    
    loadUserPreferences() {
        // Load saved language preference
        const savedLang = localStorage.getItem('language');
        if (savedLang && translationManager) {
            translationManager.currentLanguage = savedLang;
            translationManager.updateLanguageDisplay();
            translationManager.translatePage();
        }
        
        // Load other preferences
        const preferences = Utils.loadFromStorage('userPreferences', {});
        
        // Apply theme if saved
        if (preferences.theme) {
            document.body.setAttribute('data-theme', preferences.theme);
        }
        
        // Apply accessibility preferences
        if (preferences.highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        if (preferences.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
    }
    
    initializeAnalytics() {
        // Track app initialization
        Utils.trackEvent('app', 'initialized');
        
        // Track device info
        Utils.trackEvent('device', Utils.isMobile() ? 'mobile' : 'desktop');
        
        // Track session start
        this.trackSessionStart();
    }
    
    showSection(sectionId, addToHistory = true) {
        try {
            // Hide current section
            const currentSection = document.querySelector('.section.active');
            if (currentSection) {
                currentSection.classList.remove('active');
            }
            
            // Show new section
            const newSection = document.getElementById(sectionId);
            if (newSection) {
                newSection.classList.add('active');
                this.currentSection = sectionId;
                
                // Add to browser history
                if (addToHistory) {
                    history.pushState({ section: sectionId }, '', `#${sectionId}`);
                }
                
                // Track section view
                Utils.trackEvent('navigation', 'section_view', sectionId);
                
                // Initialize section-specific functionality
                this.initializeSection(sectionId);
                
                // Announce to screen readers
                const sectionTitle = newSection.querySelector('h2')?.textContent || sectionId;
                Utils.announceToScreenReader(`Navigated to ${sectionTitle}`);
                
            } else {
                throw new Error(`Section ${sectionId} not found`);
            }
            
        } catch (error) {
            Utils.handleError(error, 'Section Navigation');
        }
    }
    
    initializeSection(sectionId) {
        switch (sectionId) {
            case 'imageAnalysis':
                if (typeof imageAnalyzer !== 'undefined') {
                    imageAnalyzer.init();
                }
                break;
                
            case 'symptomAssessment':
                if (typeof symptomAssessment !== 'undefined') {
                    symptomAssessment.init();
                }
                break;
                
            case 'chatbot':
                if (typeof medicalChatbot !== 'undefined') {
                    medicalChatbot.init();
                }
                break;
        }
    }
    
    showEmergency() {
        const emergencySection = document.getElementById('emergencySection');
        if (emergencySection) {
            emergencySection.classList.add('active');
            emergencySection.style.position = 'fixed';
            emergencySection.style.top = '0';
            emergencySection.style.left = '0';
            emergencySection.style.width = '100%';
            emergencySection.style.height = '100%';
            emergencySection.style.zIndex = '1000';
            emergencySection.style.overflow = 'auto';
            
            // Track emergency access
            Utils.trackEvent('emergency', 'accessed');
            
            // Announce to screen readers
            Utils.announceToScreenReader('Emergency resources displayed');
        }
    }
    
    hideEmergency() {
        const emergencySection = document.getElementById('emergencySection');
        if (emergencySection) {
            emergencySection.classList.remove('active');
            emergencySection.style.position = '';
            emergencySection.style.top = '';
            emergencySection.style.left = '';
            emergencySection.style.width = '';
            emergencySection.style.height = '';
            emergencySection.style.zIndex = '';
            emergencySection.style.overflow = '';
        }
    }
    
    // Demo functionality
    runImageDemo() {
        this.showSection('imageAnalysis');
        setTimeout(() => {
            if (typeof imageAnalyzer !== 'undefined') {
                imageAnalyzer.runDemo();
            }
        }, 500);
        Utils.trackEvent('demo', 'image_analysis');
    }
    
    runSymptomDemo() {
        this.showSection('symptomAssessment');
        setTimeout(() => {
            if (typeof symptomAssessment !== 'undefined') {
                symptomAssessment.runDemo();
            }
        }, 500);
        Utils.trackEvent('demo', 'symptom_assessment');
    }
    
    runChatDemo() {
        this.showSection('chatbot');
        setTimeout(() => {
            if (typeof medicalChatbot !== 'undefined') {
                medicalChatbot.runDemo();
            }
        }, 500);
        Utils.trackEvent('demo', 'medical_chat');
    }
    
    // Results management
    printResults() {
        const modalBody = document.querySelector('#resultsModal .modal-body');
        if (modalBody) {
            // Create a temporary container for printing
            const printContainer = document.createElement('div');
            printContainer.id = 'printResults';
            printContainer.innerHTML = modalBody.innerHTML;
            document.body.appendChild(printContainer);
            
            Utils.printElement('printResults');
            
            // Clean up
            document.body.removeChild(printContainer);
            
            Utils.trackEvent('results', 'printed');
        }
    }
    
    downloadResults() {
        const modalBody = document.querySelector('#resultsModal .modal-body');
        if (modalBody) {
            const content = modalBody.textContent || modalBody.innerText;
            const timestamp = new Date().toISOString().split('T')[0];
            Utils.downloadText(content, `desert-telehealth-results-${timestamp}.txt`);
            
            Utils.trackEvent('results', 'downloaded');
        }
    }
    
    // Analytics tracking
    trackSessionStart() {
        const sessionData = {
            startTime: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: translationManager?.getCurrentLanguage() || 'en',
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        Utils.saveToStorage('currentSession', sessionData);
        Utils.trackEvent('session', 'started');
    }
    
    trackSessionEnd() {
        const sessionData = Utils.loadFromStorage('currentSession');
        if (sessionData) {
            const endTime = new Date();
            const startTime = new Date(sessionData.startTime);
            const duration = Math.floor((endTime - startTime) / 1000); // in seconds
            
            Utils.trackEvent('session', 'ended', `duration_${duration}`);
        }
    }
    
    // Cleanup
    cleanup() {
        this.trackSessionEnd();
        
        // Save any pending data
        if (typeof medicalChatbot !== 'undefined') {
            medicalChatbot.saveConversationHistory();
        }
        
        // Clear temporary data
        sessionStorage.clear();
    }
    
    // Error recovery
    handleCriticalError(error) {
        console.error('Critical error:', error);
        
        // Show error message to user
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        const errorMessage = currentLang === 'es' ? 
            'Ha ocurrido un error crítico. La aplicación se reiniciará.' :
            'A critical error occurred. The application will restart.';
        
        Utils.showToast(errorMessage, 'error', 5000);
        
        // Attempt to recover after a delay
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
    
    // Public API methods
    getCurrentSection() {
        return this.currentSection;
    }
    
    isReady() {
        return this.isInitialized;
    }
    
    getVersion() {
        return '1.0.0';
    }
}

// Global functions for HTML onclick handlers
window.showSection = (sectionId) => {
    if (window.app) {
        window.app.showSection(sectionId);
    }
};

window.showEmergency = () => {
    if (window.app) {
        window.app.showEmergency();
    }
};

window.hideEmergency = () => {
    if (window.app) {
        window.app.hideEmergency();
    }
};

window.runImageDemo = () => {
    if (window.app) {
        window.app.runImageDemo();
    }
};

window.runSymptomDemo = () => {
    if (window.app) {
        window.app.runSymptomDemo();
    }
};

window.runChatDemo = () => {
    if (window.app) {
        window.app.runChatDemo();
    }
};

window.printResults = () => {
    if (window.app) {
        window.app.printResults();
    }
};

window.downloadResults = () => {
    if (window.app) {
        window.app.downloadResults();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        window.app = new DesertTelehealthApp();
        await window.app.init();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        
        // Show fallback error message
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 20px;">
                <div>
                    <h1>Desert Telehealth</h1>
                    <p>Failed to initialize the application. Please refresh the page.</p>
                    <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 20px;">Refresh</button>
                </div>
            </div>
        `;
    }
});

// Handle uncaught errors
window.addEventListener('error', (event) => {
    if (window.app) {
        window.app.handleCriticalError(event.error);
    }
});

window.addEventListener('unhandledrejection', (event) => {
    if (window.app) {
        window.app.handleCriticalError(event.reason);
    }
});

// Export app class
window.DesertTelehealthApp = DesertTelehealthApp;