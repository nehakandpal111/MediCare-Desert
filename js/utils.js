// Utility functions for the Desert Telehealth app
class Utils {
    // Toast notification system
    static showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }
    
    static getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
    
    // Loading overlay management
    static showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = overlay?.querySelector('p');
        
        if (overlay) {
            if (loadingText) loadingText.textContent = message;
            overlay.classList.remove('hidden');
        }
    }
    
    static hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
    
    // Modal management
    static showModal(title, content, actions = []) {
        const modal = document.getElementById('resultsModal');
        const modalTitle = modal?.querySelector('.modal-header h3');
        const modalBody = modal?.querySelector('.modal-body');
        const modalFooter = modal?.querySelector('.modal-footer');
        
        if (modal && modalTitle && modalBody && modalFooter) {
            modalTitle.textContent = title;
            modalBody.innerHTML = content;
            
            // Clear existing actions and add new ones
            modalFooter.innerHTML = '';
            actions.forEach(action => {
                const button = document.createElement('button');
                button.className = action.class || 'btn-secondary';
                button.textContent = action.text;
                button.onclick = action.onclick;
                modalFooter.appendChild(button);
            });
            
            modal.classList.remove('hidden');
        }
    }
    
    static closeModal() {
        const modal = document.getElementById('resultsModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    // Local storage helpers
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }
    
    static loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    }
    
    // File download helpers
    static downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    }
    
    static downloadText(text, filename) {
        const blob = new Blob([text], { type: 'text/plain' });
        this.downloadBlob(blob, filename);
    }
    
    static downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Print functionality
    static printElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Desert Telehealth - Medical Results</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .print-header { text-align: center; margin-bottom: 30px; }
                    .print-content { max-width: 800px; margin: 0 auto; }
                    .emergency-warning { background: #fee2e2; border: 1px solid #ef4444; padding: 15px; margin: 15px 0; }
                    .recommendations { background: #f8fafc; padding: 15px; margin: 15px 0; }
                    ul { padding-left: 20px; }
                    li { margin-bottom: 5px; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h1>Desert Telehealth</h1>
                    <h2>Medical Assessment Results</h2>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                </div>
                <div class="print-content">
                    ${element.innerHTML}
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
    
    // Image processing helpers
    static resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                // Set canvas size and draw image
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
    
    // Network status detection
    static checkOnlineStatus() {
        return navigator.onLine;
    }
    
    static setupOfflineDetection() {
        const updateOnlineStatus = () => {
            const isOnline = this.checkOnlineStatus();
            const indicator = document.querySelector('.offline-indicator');
            
            if (indicator) {
                if (isOnline) {
                    indicator.style.display = 'none';
                } else {
                    indicator.style.display = 'flex';
                    const statusText = indicator.querySelector('span');
                    if (statusText) {
                        const currentLang = translationManager?.getCurrentLanguage() || 'en';
                        statusText.textContent = currentLang === 'es' ? 
                            'Modo Sin Conexión Activo' : 'Offline Mode Active';
                    }
                }
            }
        };
        
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus(); // Initial check
    }
    
    // Performance monitoring
    static measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        console.log(`${name} took ${end - start} milliseconds`);
        
        // Store performance data
        const perfData = this.loadFromStorage('performanceData', {});
        if (!perfData[name]) perfData[name] = [];
        perfData[name].push(end - start);
        
        // Keep only last 10 measurements
        if (perfData[name].length > 10) {
            perfData[name] = perfData[name].slice(-10);
        }
        
        this.saveToStorage('performanceData', perfData);
        
        return result;
    }
    
    // Error handling and reporting
    static handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        
        // Log error for debugging
        const errorLog = this.loadFromStorage('errorLog', []);
        errorLog.push({
            timestamp: new Date().toISOString(),
            context,
            message: error.message,
            stack: error.stack
        });
        
        // Keep only last 50 errors
        if (errorLog.length > 50) {
            errorLog.splice(0, errorLog.length - 50);
        }
        
        this.saveToStorage('errorLog', errorLog);
        
        // Show user-friendly error message
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        this.showToast(
            currentLang === 'es' ? 
                'Ha ocurrido un error. Por favor, inténtelo de nuevo.' : 
                'An error occurred. Please try again.',
            'error'
        );
    }
    
    // Analytics helpers
    static trackEvent(category, action, label = null) {
        const analytics = this.loadFromStorage('analytics', {});
        const today = new Date().toDateString();
        
        if (!analytics[today]) {
            analytics[today] = {};
        }
        
        if (!analytics[today][category]) {
            analytics[today][category] = {};
        }
        
        const key = label ? `${action}_${label}` : action;
        analytics[today][category][key] = (analytics[today][category][key] || 0) + 1;
        
        this.saveToStorage('analytics', analytics);
    }
    
    static getAnalytics() {
        return this.loadFromStorage('analytics', {});
    }
    
    // Accessibility helpers
    static announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        document.body.appendChild(announcement);
        announcement.textContent = message;
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Device detection
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    static isTablet() {
        return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    }
    
    // Validation helpers
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static validatePhoneNumber(phone) {
        const re = /^\+?[\d\s\-\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    
    // Date/time helpers
    static formatDate(date, locale = 'en-US') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }
    
    static getTimeAgo(date) {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
}

// Global utility functions for backward compatibility
window.showToast = (message, type, duration) => Utils.showToast(message, type, duration);
window.showLoading = (message) => Utils.showLoading(message);
window.hideLoading = () => Utils.hideLoading();
window.closeModal = () => Utils.closeModal();

// Initialize offline detection
document.addEventListener('DOMContentLoaded', () => {
    Utils.setupOfflineDetection();
});

// Export Utils class
window.Utils = Utils;