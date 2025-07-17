// Medical chatbot with decision tree logic
class MedicalChatbot {
    constructor() {
        this.conversationHistory = [];
        this.currentContext = null;
        this.isTyping = false;
    }
    
    init() {
        this.setupChatInterface();
        this.loadConversationHistory();
    }
    
    setupChatInterface() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        
        if (chatInput && sendBtn) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
    }
    
    loadConversationHistory() {
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        this.conversationHistory = history;
        
        // Display recent messages (last 10)
        const recentMessages = history.slice(-10);
        recentMessages.forEach(message => {
            this.displayMessage(message.text, message.isUser, false);
        });
    }
    
    saveConversationHistory() {
        // Keep only last 50 messages to prevent storage bloat
        const trimmedHistory = this.conversationHistory.slice(-50);
        localStorage.setItem('chatHistory', JSON.stringify(trimmedHistory));
    }
    
    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Display user message
        this.displayMessage(message, true);
        
        // Add to conversation history
        this.conversationHistory.push({
            text: message,
            isUser: true,
            timestamp: new Date().toISOString()
        });
        
        // Clear input
        chatInput.value = '';
        
        // Process message and generate response
        this.processMessage(message);
    }
    
    sendQuickMessage(type) {
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        let message = '';
        
        switch (type) {
            case 'dehydration':
                message = currentLang === 'es' ? 'Signos de deshidratación' : 'Signs of dehydration';
                break;
            case 'heat':
                message = currentLang === 'es' ? 'Síntomas de agotamiento por calor' : 'Heat exhaustion symptoms';
                break;
            case 'emergency':
                message = currentLang === 'es' ? 'Situaciones de emergencia' : 'Emergency situations';
                break;
        }
        
        if (message) {
            this.displayMessage(message, true);
            this.conversationHistory.push({
                text: message,
                isUser: true,
                timestamp: new Date().toISOString()
            });
            this.processMessage(message);
        }
    }
    
    displayMessage(text, isUser, animate = true) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        if (animate) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(10px)';
        }
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        if (animate) {
            // Animate message appearance
            setTimeout(() => {
                messageDiv.style.transition = 'all 0.3s ease';
                messageDiv.style.opacity = '1';
                messageDiv.style.transform = 'translateY(0)';
            }, 50);
        }
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    async processMessage(message) {
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // Generate response
        const response = this.generateResponse(message);
        
        // Hide typing indicator and show response
        this.hideTypingIndicator();
        this.displayMessage(response, false);
        
        // Add to conversation history
        this.conversationHistory.push({
            text: response,
            isUser: false,
            timestamp: new Date().toISOString()
        });
        
        // Save conversation
        this.saveConversationHistory();
        
        // Track analytics
        this.trackInteraction(message, response);
    }
    
    generateResponse(message) {
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        const lowerMessage = message.toLowerCase();
        const responses = MedicalData.chatbotResponses;
        
        // Check for greeting patterns
        if (this.matchesPatterns(lowerMessage, responses.greetings.patterns)) {
            return this.getRandomResponse(responses.greetings.responses[currentLang]);
        }
        
        // Check for dehydration patterns
        if (this.matchesPatterns(lowerMessage, responses.dehydration.patterns)) {
            this.currentContext = 'dehydration';
            return this.getRandomResponse(responses.dehydration.responses[currentLang]);
        }
        
        // Check for heat exhaustion patterns
        if (this.matchesPatterns(lowerMessage, responses.heatExhaustion.patterns)) {
            this.currentContext = 'heat_exhaustion';
            return this.getRandomResponse(responses.heatExhaustion.responses[currentLang]);
        }
        
        // Check for emergency patterns
        if (this.matchesPatterns(lowerMessage, responses.emergency.patterns)) {
            this.currentContext = 'emergency';
            return this.getRandomResponse(responses.emergency.responses[currentLang]);
        }
        
        // Check for prevention patterns
        if (this.matchesPatterns(lowerMessage, responses.prevention.patterns)) {
            return this.getRandomResponse(responses.prevention.responses[currentLang]);
        }
        
        // Context-aware responses
        if (this.currentContext) {
            return this.generateContextualResponse(lowerMessage, this.currentContext);
        }
        
        // Default response
        return this.getRandomResponse(responses.default.responses[currentLang]);
    }
    
    matchesPatterns(message, patterns) {
        return patterns.some(pattern => message.includes(pattern.toLowerCase()));
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    generateContextualResponse(message, context) {
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        
        // Symptom-specific responses based on context
        if (context === 'dehydration') {
            if (message.includes('thirst') || message.includes('sed')) {
                return currentLang === 'es' ? 
                    'La sed extrema es un signo importante de deshidratación. ¿También ha notado disminución en la orina o boca seca?' :
                    'Extreme thirst is an important sign of dehydration. Have you also noticed decreased urination or dry mouth?';
            }
            
            if (message.includes('urine') || message.includes('orina')) {
                return currentLang === 'es' ? 
                    'La disminución de la orina es un signo serio de deshidratación. ¿Cuándo fue la última vez que orinó?' :
                    'Decreased urination is a serious sign of dehydration. When was the last time you urinated?';
            }
            
            if (message.includes('dizzy') || message.includes('mareado')) {
                return currentLang === 'es' ? 
                    'Los mareos pueden indicar deshidratación moderada a severa. Siéntese en un lugar fresco y beba agua lentamente.' :
                    'Dizziness can indicate moderate to severe dehydration. Sit in a cool place and drink water slowly.';
            }
        }
        
        if (context === 'heat_exhaustion') {
            if (message.includes('sweat') || message.includes('sudor')) {
                return currentLang === 'es' ? 
                    'La sudoración excesiva o la falta de sudoración son signos importantes. ¿Está sudando mucho o ha dejado de sudar?' :
                    'Excessive sweating or lack of sweating are important signs. Are you sweating heavily or have you stopped sweating?';
            }
            
            if (message.includes('nausea') || message.includes('náusea')) {
                return currentLang === 'es' ? 
                    'Las náuseas son comunes con el agotamiento por calor. Muévase a un lugar fresco y beba líquidos lentamente.' :
                    'Nausea is common with heat exhaustion. Move to a cool place and drink fluids slowly.';
            }
            
            if (message.includes('temperature') || message.includes('temperatura')) {
                return currentLang === 'es' ? 
                    'Si su temperatura corporal está por encima de 104°F (40°C), esto podría ser golpe de calor. Busque ayuda médica inmediata.' :
                    'If your body temperature is above 104°F (40°C), this could be heat stroke. Seek immediate medical help.';
            }
        }
        
        // Default contextual response
        return currentLang === 'es' ? 
            'Basándome en nuestro contexto anterior, ¿puede proporcionar más detalles sobre sus síntomas específicos?' :
            'Based on our previous context, can you provide more details about your specific symptoms?';
    }
    
    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        this.isTyping = true;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }
    
    trackInteraction(userMessage, botResponse) {
        // Basic analytics tracking
        const analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
        const today = new Date().toDateString();
        
        if (!analytics[today]) {
            analytics[today] = {};
        }
        
        if (!analytics[today]['chat_interactions']) {
            analytics[today]['chat_interactions'] = 0;
        }
        
        analytics[today]['chat_interactions']++;
        localStorage.setItem('analytics', JSON.stringify(analytics));
    }
    
    clearConversation() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            // Keep only the welcome message
            const welcomeMessage = chatMessages.querySelector('.bot-message');
            chatMessages.innerHTML = '';
            if (welcomeMessage) {
                chatMessages.appendChild(welcomeMessage);
            }
        }
        
        this.conversationHistory = [];
        this.currentContext = null;
        localStorage.removeItem('chatHistory');
        
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        showToast(
            currentLang === 'es' ? 'Conversación limpiada' : 'Conversation cleared',
            'success'
        );
    }
    
    exportConversation() {
        if (this.conversationHistory.length === 0) {
            const currentLang = translationManager?.getCurrentLanguage() || 'en';
            showToast(
                currentLang === 'es' ? 'No hay conversación para exportar' : 'No conversation to export',
                'warning'
            );
            return;
        }
        
        const conversation = this.conversationHistory.map(msg => {
            const sender = msg.isUser ? 'User' : 'Medical Assistant';
            const timestamp = new Date(msg.timestamp).toLocaleString();
            return `[${timestamp}] ${sender}: ${msg.text}`;
        }).join('\n\n');
        
        const blob = new Blob([conversation], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medical-chat-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        showToast(
            currentLang === 'es' ? 'Conversación exportada' : 'Conversation exported',
            'success'
        );
    }
    
    // Demo functionality
    runDemo() {
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        
        // Clear existing conversation for demo
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="message bot-message">
                    <div class="message-content">
                        <p data-translate="chat.welcome">${currentLang === 'es' ? '¡Hola! Soy su asistente médico. ¿Cómo puedo ayudarle hoy?' : 'Hello! I\'m your medical assistant. How can I help you today?'}</p>
                    </div>
                </div>
            `;
        }
        
        // Simulate a demo conversation
        const demoMessages = currentLang === 'es' ? [
            { text: 'Tengo mucha sed y me siento débil', isUser: true },
            { text: 'La sed extrema y debilidad pueden ser signos de deshidratación. ¿También ha notado disminución en la orina o boca seca?', isUser: false },
            { text: 'Sí, no he orinado en varias horas', isUser: true },
            { text: 'Esto sugiere deshidratación moderada a severa. Recomiendo: beber agua lentamente, descansar en sombra, y buscar atención médica si los síntomas empeoran.', isUser: false }
        ] : [
            { text: 'I\'m very thirsty and feeling weak', isUser: true },
            { text: 'Extreme thirst and weakness can be signs of dehydration. Have you also noticed decreased urination or dry mouth?', isUser: false },
            { text: 'Yes, I haven\'t urinated in several hours', isUser: true },
            { text: 'This suggests moderate to severe dehydration. I recommend: drink water slowly, rest in shade, and seek medical attention if symptoms worsen.', isUser: false }
        ];
        
        // Display demo messages with delays
        let delay = 1000;
        demoMessages.forEach((message, index) => {
            setTimeout(() => {
                this.displayMessage(message.text, message.isUser);
                
                if (index === demoMessages.length - 1) {
                    showToast(
                        currentLang === 'es' ? 'Demo de chat médico completado' : 'Medical chat demo completed',
                        'success'
                    );
                }
            }, delay);
            delay += message.isUser ? 1500 : 2500; // Different delays for user vs bot messages
        });
    }
}

// Initialize chatbot
let medicalChatbot;

document.addEventListener('DOMContentLoaded', () => {
    medicalChatbot = new MedicalChatbot();
    medicalChatbot.init();
});

// Export for global access
window.medicalChatbot = medicalChatbot;
window.sendQuickMessage = (type) => medicalChatbot.sendQuickMessage(type);