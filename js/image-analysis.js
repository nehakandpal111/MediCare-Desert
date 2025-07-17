// Image analysis module for offline medical image processing
class ImageAnalyzer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.analysisResults = null;
    }
    
    // Initialize image analysis functionality
    init() {
        this.setupImageUpload();
        this.setupDropZone();
    }
    
    setupImageUpload() {
        const imageInput = document.getElementById('imageInput');
        const dropZone = document.getElementById('imageDropZone');
        
        if (imageInput && dropZone) {
            dropZone.addEventListener('click', () => imageInput.click());
            imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }
        
        const analyzeBtn = document.getElementById('analyzeBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeImage());
        }
        
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => this.resetImageUpload());
        }
    }
    
    setupDropZone() {
        const dropZone = document.getElementById('imageDropZone');
        if (!dropZone) return;
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.processImageFile(files[0]);
            }
        });
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.processImageFile(file);
        }
    }
    
    processImageFile(file) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showToast('Image file too large. Please select a smaller image.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
        
        // Store file for analysis
        this.currentImageFile = file;
    }
    
    displayImagePreview(imageSrc) {
        const dropZone = document.getElementById('imageDropZone');
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (dropZone && preview && previewImg) {
            dropZone.classList.add('hidden');
            preview.classList.remove('hidden');
            previewImg.src = imageSrc;
        }
    }
    
    resetImageUpload() {
        const dropZone = document.getElementById('imageDropZone');
        const preview = document.getElementById('imagePreview');
        const results = document.getElementById('imageResults');
        const imageInput = document.getElementById('imageInput');
        
        if (dropZone) dropZone.classList.remove('hidden');
        if (preview) preview.classList.add('hidden');
        if (results) results.classList.add('hidden');
        if (imageInput) imageInput.value = '';
        
        this.currentImageFile = null;
        this.analysisResults = null;
    }
    
    async analyzeImage() {
        if (!this.currentImageFile) {
            showToast('Please select an image first.', 'error');
            return;
        }
        
        const loadingSpinner = document.getElementById('imageLoading');
        const resultsContainer = document.getElementById('imageResults');
        const analysisResults = document.getElementById('imageAnalysisResults');
        
        // Show loading state
        if (resultsContainer) resultsContainer.classList.remove('hidden');
        if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        if (analysisResults) analysisResults.classList.add('hidden');
        
        try {
            // Simulate analysis delay for realistic UX
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Perform offline image analysis
            const analysis = await this.performOfflineAnalysis();
            
            // Hide loading and show results
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            if (analysisResults) {
                analysisResults.classList.remove('hidden');
                this.displayAnalysisResults(analysis, analysisResults);
            }
            
            // Store results for later use
            this.analysisResults = analysis;
            
            // Track analytics
            this.trackAnalysis('image_analysis', analysis.condition);
            
        } catch (error) {
            console.error('Image analysis error:', error);
            showToast('Error analyzing image. Please try again.', 'error');
            
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
        }
    }
    
    async performOfflineAnalysis() {
        // Load image into canvas for analysis
        const img = new Image();
        const imageUrl = URL.createObjectURL(this.currentImageFile);
        
        return new Promise((resolve) => {
            img.onload = () => {
                // Set canvas size
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                
                // Draw image to canvas
                this.ctx.drawImage(img, 0, 0);
                
                // Get image data for analysis
                const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
                
                // Perform basic image analysis
                const analysis = this.analyzeImageData(imageData);
                
                // Clean up
                URL.revokeObjectURL(imageUrl);
                
                resolve(analysis);
            };
            
            img.src = imageUrl;
        });
    }
    
    analyzeImageData(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // Basic color analysis
        let totalR = 0, totalG = 0, totalB = 0;
        let pixelCount = 0;
        
        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
            totalR += data[i];
            totalG += data[i + 1];
            totalB += data[i + 2];
            pixelCount++;
        }
        
        const avgR = totalR / pixelCount;
        const avgG = totalG / pixelCount;
        const avgB = totalB / pixelCount;
        
        // Determine dominant characteristics
        const brightness = (avgR + avgG + avgB) / 3;
        const redness = avgR / (avgG + avgB + 1);
        const contrast = this.calculateContrast(data);
        
        // Match against known patterns
        return this.matchMedicalPatterns(brightness, redness, contrast, width, height);
    }
    
    calculateContrast(data) {
        let min = 255, max = 0;
        
        // Sample brightness values
        for (let i = 0; i < data.length; i += 40) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            min = Math.min(min, brightness);
            max = Math.max(max, brightness);
        }
        
        return max - min;
    }
    
    matchMedicalPatterns(brightness, redness, contrast, width, height) {
        const patterns = MedicalData.imagePatterns;
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        
        // Simple pattern matching based on image characteristics
        let bestMatch = null;
        let confidence = 0;
        
        // Check for dehydration signs
        if (brightness < 100 && contrast > 50) {
            // Darker image with good contrast might show skin tenting
            bestMatch = patterns.dehydration.skinTenting;
            confidence = 0.7;
        } else if (brightness < 80) {
            // Very dark might indicate sunken eyes
            bestMatch = patterns.dehydration.sunkenEyes;
            confidence = 0.6;
        } else if (redness > 1.5 && brightness > 120) {
            // Red and bright might indicate heat-related skin changes
            bestMatch = patterns.heatExhaustion.flushedSkin;
            confidence = 0.8;
        } else if (brightness > 150 && contrast < 30) {
            // Bright with low contrast might show sweating
            bestMatch = patterns.heatExhaustion.profuseSweating;
            confidence = 0.6;
        } else {
            // Default to dry skin pattern
            bestMatch = patterns.dehydration.drySkin;
            confidence = 0.5;
        }
        
        // Determine condition and recommendations
        const isDehydration = bestMatch === patterns.dehydration.skinTenting || 
                             bestMatch === patterns.dehydration.drySkin || 
                             bestMatch === patterns.dehydration.sunkenEyes;
        
        const condition = isDehydration ? 'dehydration' : 'heat_exhaustion';
        const conditionData = isDehydration ? MedicalData.dehydration : MedicalData.heatExhaustion;
        
        // Get appropriate assessment level based on confidence
        let assessmentLevel;
        if (confidence > 0.8) {
            assessmentLevel = isDehydration ? conditionData.assessment.severe : conditionData.assessment.stroke;
        } else if (confidence > 0.6) {
            assessmentLevel = isDehydration ? conditionData.assessment.moderate : conditionData.assessment.exhaustion;
        } else {
            assessmentLevel = isDehydration ? conditionData.assessment.mild : conditionData.assessment.normal;
        }
        
        return {
            condition,
            pattern: bestMatch,
            confidence: Math.min(confidence, bestMatch.confidence),
            assessment: assessmentLevel,
            description: currentLang === 'es' ? bestMatch.descriptionEs : bestMatch.description,
            title: currentLang === 'es' ? assessmentLevel.titleEs : assessmentLevel.title,
            recommendations: currentLang === 'es' ? assessmentLevel.recommendationsEs : assessmentLevel.recommendations,
            urgency: assessmentLevel.urgency
        };
    }
    
    displayAnalysisResults(analysis, container) {
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        
        // Determine confidence level styling
        const confidenceClass = analysis.confidence > 0.8 ? 'confidence-high' : 
                               analysis.confidence > 0.6 ? 'confidence-medium' : 'confidence-low';
        
        const confidenceText = analysis.confidence > 0.8 ? 'High' : 
                              analysis.confidence > 0.6 ? 'Medium' : 'Low';
        
        const urgencyClass = analysis.urgency === 'high' ? 'emergency-action' : '';
        
        container.innerHTML = `
            <div class="result-header">
                <h3>${analysis.title}</h3>
                <div class="confidence-badge ${confidenceClass}">
                    <span>📊</span>
                    <span>${currentLang === 'es' ? 'Confianza' : 'Confidence'}: ${confidenceText}</span>
                </div>
            </div>
            
            <div class="result-content">
                <p><strong>${currentLang === 'es' ? 'Análisis de imagen' : 'Image Analysis'}:</strong> ${analysis.description}</p>
                <p><strong>${currentLang === 'es' ? 'Evaluación' : 'Assessment'}:</strong> ${currentLang === 'es' ? analysis.assessment.descriptionEs : analysis.assessment.description}</p>
                
                <div class="recommendations ${urgencyClass}">
                    <h4>${currentLang === 'es' ? 'Recomendaciones' : 'Recommendations'}:</h4>
                    <ul>
                        ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                
                ${analysis.urgency === 'high' ? `
                    <div class="emergency-warning">
                        <div class="warning-icon">⚠️</div>
                        <p><strong>${currentLang === 'es' ? 'ADVERTENCIA' : 'WARNING'}:</strong> ${currentLang === 'es' ? 'Esta condición puede requerir atención médica inmediata.' : 'This condition may require immediate medical attention.'}</p>
                    </div>
                ` : ''}
                
                <div class="result-actions" style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button class="btn-primary" onclick="imageAnalyzer.showDetailedResults()">
                        ${currentLang === 'es' ? 'Ver Detalles Completos' : 'View Full Details'}
                    </button>
                    <button class="btn-secondary" onclick="imageAnalyzer.saveResults()">
                        ${currentLang === 'es' ? 'Guardar Resultados' : 'Save Results'}
                    </button>
                    ${analysis.urgency === 'high' ? `
                        <button class="btn-emergency" onclick="showEmergency()">
                            ${currentLang === 'es' ? 'Recursos de Emergencia' : 'Emergency Resources'}
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    showDetailedResults() {
        if (!this.analysisResults) return;
        
        const modal = document.getElementById('resultsModal');
        const modalResults = document.getElementById('modalResults');
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        
        if (modal && modalResults) {
            modalResults.innerHTML = `
                <div class="detailed-results">
                    <h4>${currentLang === 'es' ? 'Análisis Detallado de Imagen' : 'Detailed Image Analysis'}</h4>
                    
                    <div class="analysis-section">
                        <h5>${currentLang === 'es' ? 'Patrón Detectado' : 'Detected Pattern'}</h5>
                        <p>${this.analysisResults.description}</p>
                        <p><strong>${currentLang === 'es' ? 'Confianza' : 'Confidence'}:</strong> ${Math.round(this.analysisResults.confidence * 100)}%</p>
                    </div>
                    
                    <div class="analysis-section">
                        <h5>${currentLang === 'es' ? 'Evaluación Médica' : 'Medical Assessment'}</h5>
                        <p><strong>${currentLang === 'es' ? 'Condición' : 'Condition'}:</strong> ${this.analysisResults.title}</p>
                        <p>${currentLang === 'es' ? this.analysisResults.assessment.descriptionEs : this.analysisResults.assessment.description}</p>
                    </div>
                    
                    <div class="analysis-section">
                        <h5>${currentLang === 'es' ? 'Recomendaciones de Acción' : 'Action Recommendations'}</h5>
                        <ul>
                            ${this.analysisResults.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="analysis-section">
                        <h5>${currentLang === 'es' ? 'Información Importante' : 'Important Information'}</h5>
                        <p>${currentLang === 'es' ? 
                            'Este análisis se basa en características visuales básicas y no reemplaza el diagnóstico médico profesional. Si los síntomas persisten o empeoran, busque atención médica.' :
                            'This analysis is based on basic visual characteristics and does not replace professional medical diagnosis. If symptoms persist or worsen, seek medical attention.'
                        }</p>
                    </div>
                    
                    <div class="timestamp">
                        <p><small>${currentLang === 'es' ? 'Análisis realizado el' : 'Analysis performed on'}: ${new Date().toLocaleString()}</small></p>
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
        }
    }
    
    saveResults() {
        if (!this.analysisResults) return;
        
        const results = {
            timestamp: new Date().toISOString(),
            type: 'image_analysis',
            condition: this.analysisResults.condition,
            confidence: this.analysisResults.confidence,
            assessment: this.analysisResults.title,
            recommendations: this.analysisResults.recommendations,
            urgency: this.analysisResults.urgency
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
    
    trackAnalysis(type, condition) {
        // Basic analytics tracking
        const analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
        const today = new Date().toDateString();
        
        if (!analytics[today]) {
            analytics[today] = {};
        }
        
        if (!analytics[today][type]) {
            analytics[today][type] = {};
        }
        
        if (!analytics[today][type][condition]) {
            analytics[today][type][condition] = 0;
        }
        
        analytics[today][type][condition]++;
        localStorage.setItem('analytics', JSON.stringify(analytics));
    }
    
    // Demo functionality
    runDemo() {
        // Simulate demo image analysis
        const demoResults = {
            condition: 'dehydration',
            pattern: MedicalData.imagePatterns.dehydration.skinTenting,
            confidence: 0.85,
            assessment: MedicalData.dehydration.assessment.moderate,
            description: 'Skin tenting test showing delayed return',
            title: 'Moderate Dehydration',
            recommendations: MedicalData.dehydration.assessment.moderate.recommendations,
            urgency: 'medium'
        };
        
        this.analysisResults = demoResults;
        
        // Show demo results
        const resultsContainer = document.getElementById('imageResults');
        const analysisResults = document.getElementById('imageAnalysisResults');
        
        if (resultsContainer && analysisResults) {
            resultsContainer.classList.remove('hidden');
            analysisResults.classList.remove('hidden');
            this.displayAnalysisResults(demoResults, analysisResults);
        }
        
        const currentLang = translationManager?.getCurrentLanguage() || 'en';
        showToast(
            currentLang === 'es' ? 'Demo de análisis de imagen completado' : 'Image analysis demo completed',
            'success'
        );
    }
}

// Initialize image analyzer
let imageAnalyzer;

document.addEventListener('DOMContentLoaded', () => {
    imageAnalyzer = new ImageAnalyzer();
    imageAnalyzer.init();
});

// Export for global access
window.imageAnalyzer = imageAnalyzer;