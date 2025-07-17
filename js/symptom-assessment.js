// Symptom assessment module for medical questionnaires
class SymptomAssessment {
    constructor() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.currentAssessmentType = 'dehydration'; // or 'heatExhaustion'
        this.assessmentResults = null;
    }
    
    init() {
        this.setupAssessmentType();
        this.startAssessment();
    }
    
    setupAssessmentType() {
        // For now, we'll cycle between dehydration and heat exhaustion
        // In a real app, this could be user-selected
        const assessmentTypes = ['dehydration', 'heatExhaustion'];
        const randomType = assessmentTypes[Math.floor(Math.random() * assessmentTypes.length)];
        this.currentAssessmentType = randomType;
    }
    
    startAssessment() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.showQuestion();
        this.updateProgress();
    }
    
    showQuestion() {
        const questionsContainer = document.getElementById('symptomQuestions');
        if (!questionsContainer) return;
        
        const assessmentData = MedicalData[this.currentAssessmentType];
        const questions = assessmentData.symptoms;
        const currentQuestion = questions[this.currentQuestionIndex];
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        
        if (!currentQuestion) {
            this.completeAssessment();
            return;
        }
        
        const questionText = currentLang === 'es' ? currentQuestion.questionEs : currentQuestion.question;
        
        questionsContainer.innerHTML = `
            <div class="question-card">
                <h3>${questionText}</h3>
                <div class="question-options">
                    ${currentQuestion.options.map((option, index) => {
                        const optionText = currentLang === 'es' ? option.textEs : option.text;
                        const isSelected = this.answers[currentQuestion.id] === option.value;
                        return `
                            <button class="option-button ${isSelected ? 'selected' : ''}" 
                                    onclick="symptomAssessment.selectAnswer('${currentQuestion.id}', ${option.value})">
                                ${optionText}
                            </button>
                        `;
                    }).join('')}
                </div>
                
                <div class="question-navigation">
                    ${this.currentQuestionIndex > 0 ? `
                        <button class="btn-secondary" onclick="symptomAssessment.previousQuestion()">
                            ← ${currentLang === 'es' ? 'Anterior' : 'Previous'}
                        </button>
                    ` : '<div></div>'}
                    
                    ${this.answers[currentQuestion.id] !== undefined ? `
                        <button class="btn-primary" onclick="symptomAssessment.nextQuestion()">
                            ${this.currentQuestionIndex < questions.length - 1 ? 
                                (currentLang === 'es' ? 'Siguiente' : 'Next') + ' →' : 
                                (currentLang === 'es' ? 'Completar Evaluación' : 'Complete Assessment')
                            }
                        </button>
                    ` : `
                        <button class="btn-primary" disabled>
                            ${currentLang === 'es' ? 'Seleccione una opción' : 'Select an option'}
                        </button>
                    `}
                </div>
            </div>
        `;
    }
    
    selectAnswer(questionId, value) {
        this.answers[questionId] = value;
        this.showQuestion(); // Refresh to show selection and enable next button
    }
    
    nextQuestion() {
        const assessmentData = MedicalData[this.currentAssessmentType];
        const questions = assessmentData.symptoms;
        
        if (this.currentQuestionIndex < questions.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
            this.updateProgress();
        } else {
            this.completeAssessment();
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
            this.updateProgress();
        }
    }
    
    updateProgress() {
        const progressBar = document.getElementById('symptomProgress');
        if (!progressBar) return;
        
        const assessmentData = MedicalData[this.currentAssessmentType];
        const totalQuestions = assessmentData.symptoms.length;
        const progress = ((this.currentQuestionIndex + 1) / totalQuestions) * 100;
        
        progressBar.style.width = `${progress}%`;
    }
    
    completeAssessment() {
        // Calculate total score
        const totalScore = Object.values(this.answers).reduce((sum, value) => sum + value, 0);
        
        // Get assessment data
        const assessmentData = MedicalData[this.currentAssessmentType];
        const assessmentLevels = assessmentData.assessment;
        
        // Determine assessment level based on score
        let assessmentLevel = null;
        for (const [key, level] of Object.entries(assessmentLevels)) {
            const [min, max] = level.range;
            if (totalScore >= min && totalScore <= max) {
                assessmentLevel = level;
                break;
            }
        }
        
        // Store results
        this.assessmentResults = {
            type: this.currentAssessmentType,
            score: totalScore,
            assessment: assessmentLevel,
            answers: this.answers,
            timestamp: new Date().toISOString()
        };
        
        // Hide questionnaire and show results
        this.showResults();
        
        // Track analytics
        this.trackAssessment();
    }
    
    showResults() {
        const questionnaire = document.getElementById('symptomQuestionnaire');
        const resultsContainer = document.getElementById('symptomResults');
        
        if (questionnaire) questionnaire.classList.add('hidden');
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            this.displayResults(resultsContainer);
        }
    }
    
    displayResults(container) {
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        const assessment = this.assessmentResults.assessment;
        
        const title = currentLang === 'es' ? assessment.titleEs : assessment.title;
        const description = currentLang === 'es' ? assessment.descriptionEs : assessment.description;
        const recommendations = currentLang === 'es' ? assessment.recommendationsEs : assessment.recommendations;
        
        const urgencyClass = assessment.urgency === 'high' ? 'emergency-action' : '';
        const urgencyIcon = assessment.urgency === 'high' ? '🚨' : 
                           assessment.urgency === 'medium' ? '⚠️' : '✅';
        
        container.innerHTML = `
            <div class="analysis-results">
                <div class="result-header">
                    <h3>${urgencyIcon} ${title}</h3>
                    <div class="score-badge">
                        <span>${currentLang === 'es' ? 'Puntuación' : 'Score'}: ${this.assessmentResults.score}/15</span>
                    </div>
                </div>
                
                <div class="result-content">
                    <p><strong>${currentLang === 'es' ? 'Evaluación' : 'Assessment'}:</strong> ${description}</p>
                    
                    <div class="recommendations ${urgencyClass}">
                        <h4>${currentLang === 'es' ? 'Recomendaciones' : 'Recommendations'}:</h4>
                        <ul>
                            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${assessment.urgency === 'high' ? `
                        <div class="emergency-warning">
                            <div class="warning-icon">⚠️</div>
                            <p><strong>${currentLang === 'es' ? 'ADVERTENCIA' : 'WARNING'}:</strong> ${currentLang === 'es' ? 'Esta condición requiere atención médica inmediata.' : 'This condition requires immediate medical attention.'}</p>
                        </div>
                    ` : ''}
                    
                    <div class="assessment-summary">
                        <h4>${currentLang === 'es' ? 'Resumen de Respuestas' : 'Response Summary'}</h4>
                        <div class="answer-summary">
                            ${this.generateAnswerSummary()}
                        </div>
                    </div>
                    
                    <div class="result-actions" style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="symptomAssessment.showDetailedResults()">
                            ${currentLang === 'es' ? 'Ver Detalles Completos' : 'View Full Details'}
                        </button>
                        <button class="btn-secondary" onclick="symptomAssessment.saveResults()">
                            ${currentLang === 'es' ? 'Guardar Resultados' : 'Save Results'}
                        </button>
                        <button class="btn-secondary" onclick="symptomAssessment.restartAssessment()">
                            ${currentLang === 'es' ? 'Nueva Evaluación' : 'New Assessment'}
                        </button>
                        ${assessment.urgency === 'high' ? `
                            <button class="btn-emergency" onclick="showEmergency()">
                                ${currentLang === 'es' ? 'Recursos de Emergencia' : 'Emergency Resources'}
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    generateAnswerSummary() {
        const assessmentData = MedicalData[this.currentAssessmentType];
        const questions = assessmentData.symptoms;
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        
        return questions.map(question => {
            const answer = this.answers[question.id];
            const selectedOption = question.options.find(opt => opt.value === answer);
            const questionText = currentLang === 'es' ? question.questionEs : question.question;
            const answerText = selectedOption ? 
                (currentLang === 'es' ? selectedOption.textEs : selectedOption.text) : 
                'No answer';
            
            const severityClass = answer >= 3 ? 'high-severity' : 
                                 answer >= 2 ? 'medium-severity' : 'low-severity';
            
            return `
                <div class="answer-item ${severityClass}">
                    <div class="question-text">${questionText}</div>
                    <div class="answer-text">${answerText}</div>
                </div>
            `;
        }).join('');
    }
    
    showDetailedResults() {
        if (!this.assessmentResults) return;
        
        const modal = document.getElementById('resultsModal');
        const modalResults = document.getElementById('modalResults');
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        
        if (modal && modalResults) {
            const assessment = this.assessmentResults.assessment;
            const title = currentLang === 'es' ? assessment.titleEs : assessment.title;
            const description = currentLang === 'es' ? assessment.descriptionEs : assessment.description;
            const recommendations = currentLang === 'es' ? assessment.recommendationsEs : assessment.recommendations;
            
            modalResults.innerHTML = `
                <div class="detailed-results">
                    <h4>${currentLang === 'es' ? 'Evaluación Detallada de Síntomas' : 'Detailed Symptom Assessment'}</h4>
                    
                    <div class="analysis-section">
                        <h5>${currentLang === 'es' ? 'Resultado de la Evaluación' : 'Assessment Result'}</h5>
                        <p><strong>${currentLang === 'es' ? 'Condición' : 'Condition'}:</strong> ${title}</p>
                        <p><strong>${currentLang === 'es' ? 'Puntuación Total' : 'Total Score'}:</strong> ${this.assessmentResults.score}/15</p>
                        <p>${description}</p>
                    </div>
                    
                    <div class="analysis-section">
                        <h5>${currentLang === 'es' ? 'Respuestas Detalladas' : 'Detailed Responses'}</h5>
                        ${this.generateDetailedAnswerSummary()}
                    </div>
                    
                    <div class="analysis-section">
                        <h5>${currentLang === 'es' ? 'Plan de Acción Recomendado' : 'Recommended Action Plan'}</h5>
                        <ol>
                            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ol>
                    </div>
                    
                    <div class="analysis-section">
                        <h5>${currentLang === 'es' ? 'Cuándo Buscar Ayuda Médica' : 'When to Seek Medical Help'}</h5>
                        <p>${this.getSeekHelpAdvice()}</p>
                    </div>
                    
                    <div class="timestamp">
                        <p><small>${currentLang === 'es' ? 'Evaluación completada el' : 'Assessment completed on'}: ${new Date(this.assessmentResults.timestamp).toLocaleString()}</small></p>
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
        }
    }
    
    generateDetailedAnswerSummary() {
        const assessmentData = MedicalData[this.currentAssessmentType];
        const questions = assessmentData.symptoms;
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        
        return questions.map(question => {
            const answer = this.answers[question.id];
            const selectedOption = question.options.find(opt => opt.value === answer);
            const questionText = currentLang === 'es' ? question.questionEs : question.question;
            const answerText = selectedOption ? 
                (currentLang === 'es' ? selectedOption.textEs : selectedOption.text) : 
                'No answer';
            
            const severityText = answer >= 3 ? (currentLang === 'es' ? 'Alto' : 'High') :
                                answer >= 2 ? (currentLang === 'es' ? 'Medio' : 'Medium') :
                                answer >= 1 ? (currentLang === 'es' ? 'Bajo' : 'Low') :
                                (currentLang === 'es' ? 'Normal' : 'Normal');
            
            const severityClass = answer >= 3 ? 'high-severity' : 
                                 answer >= 2 ? 'medium-severity' : 'low-severity';
            
            return `
                <div class="detailed-answer-item">
                    <div class="question-header">
                        <strong>${questionText}</strong>
                        <span class="severity-badge ${severityClass}">${severityText}</span>
                    </div>
                    <div class="answer-detail">${answerText} (${currentLang === 'es' ? 'Puntos' : 'Points'}: ${answer})</div>
                </div>
            `;
        }).join('');
    }
    
    getSeekHelpAdvice() {
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        const urgency = this.assessmentResults.assessment.urgency;
        
        if (urgency === 'high') {
            return currentLang === 'es' ? 
                'Busque atención médica inmediata. Esta condición puede ser potencialmente mortal si no se trata.' :
                'Seek immediate medical attention. This condition can be life-threatening if untreated.';
        } else if (urgency === 'medium') {
            return currentLang === 'es' ? 
                'Considere buscar atención médica si los síntomas empeoran o no mejoran en las próximas horas.' :
                'Consider seeking medical attention if symptoms worsen or do not improve within the next few hours.';
        } else {
            return currentLang === 'es' ? 
                'Monitoree sus síntomas. Busque atención médica si empeoran o si desarrolla síntomas adicionales.' :
                'Monitor your symptoms. Seek medical attention if they worsen or if you develop additional symptoms.';
        }
    }
    
    saveResults() {
        if (!this.assessmentResults) return;
        
        const results = {
            timestamp: this.assessmentResults.timestamp,
            type: 'symptom_assessment',
            assessmentType: this.currentAssessmentType,
            score: this.assessmentResults.score,
            assessment: this.assessmentResults.assessment.title,
            urgency: this.assessmentResults.assessment.urgency,
            answers: this.assessmentResults.answers
        };
        
        // Save to localStorage
        const savedResults = JSON.parse(localStorage.getItem('medicalResults') || '[]');
        savedResults.push(results);
        localStorage.setItem('medicalResults', JSON.stringify(savedResults));
        
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        showToast(
            currentLang === 'es' ? 'Resultados guardados exitosamente' : 'Results saved successfully',
            'success'
        );
    }
    
    restartAssessment() {
        const questionnaire = document.getElementById('symptomQuestionnaire');
        const resultsContainer = document.getElementById('symptomResults');
        
        if (questionnaire) questionnaire.classList.remove('hidden');
        if (resultsContainer) resultsContainer.classList.add('hidden');
        
        this.setupAssessmentType();
        this.startAssessment();
        
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        showToast(
            currentLang === 'es' ? 'Nueva evaluación iniciada' : 'New assessment started',
            'success'
        );
    }
    
    trackAssessment() {
        // Basic analytics tracking
        const analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
        const today = new Date().toDateString();
        
        if (!analytics[today]) {
            analytics[today] = {};
        }
        
        if (!analytics[today]['symptom_assessment']) {
            analytics[today]['symptom_assessment'] = {};
        }
        
        const key = `${this.currentAssessmentType}_${this.assessmentResults.assessment.urgency}`;
        if (!analytics[today]['symptom_assessment'][key]) {
            analytics[today]['symptom_assessment'][key] = 0;
        }
        
        analytics[today]['symptom_assessment'][key]++;
        localStorage.setItem('analytics', JSON.stringify(analytics));
    }
    
    // Demo functionality
    runDemo() {
        // Set up demo answers for moderate dehydration
        this.currentAssessmentType = 'dehydration';
        this.answers = {
            'thirst': 2,
            'urination': 2,
            'mouth': 2,
            'skin': 1,
            'energy': 2
        };
        
        // Calculate demo results
        const totalScore = Object.values(this.answers).reduce((sum, value) => sum + value, 0);
        const assessmentData = MedicalData[this.currentAssessmentType];
        
        this.assessmentResults = {
            type: this.currentAssessmentType,
            score: totalScore,
            assessment: assessmentData.assessment.moderate,
            answers: this.answers,
            timestamp: new Date().toISOString()
        };
        
        // Show demo results
        const questionnaire = document.getElementById('symptomQuestionnaire');
        const resultsContainer = document.getElementById('symptomResults');
        
        if (questionnaire) questionnaire.classList.add('hidden');
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            this.displayResults(resultsContainer);
        }
        
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        showToast(
            currentLang === 'es' ? 'Demo de evaluación de síntomas completado' : 'Symptom assessment demo completed',
            'success'
        );
    }
}

// Initialize symptom assessment
let symptomAssessment;

document.addEventListener('DOMContentLoaded', () => {
    symptomAssessment = new SymptomAssessment();
});

// Export for global access
window.symptomAssessment = symptomAssessment;