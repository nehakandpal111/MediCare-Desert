// Advanced Telemedicine Triage Assistant
class MediCareDesert {
    constructor() {
        this.currentSymptom = null;
        this.currentQuestionIndex = 0;
        this.followupAnswers = {};
        this.assessmentResult = null;
        this.currentQuestions = [];
        this.photoData = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('welcome');
        this.updateWeatherInfo();
    }

    // Enhanced symptom data with desert-specific conditions
    symptoms = {
        'heat-exhaustion': {
            name: "Heat Exhaustion",
            icon: "🥵",
            description: "Excessive sweating, weakness, nausea in hot weather",
            category: "heat-related",
            followupQuestions: [
                {
                    id: "temperature",
                    question: "What is your body temperature?",
                    options: [
                        { value: "normal", label: "Normal (98-100°F)" },
                        { value: "elevated", label: "Slightly elevated (100-102°F)" },
                        { value: "high", label: "High fever (>102°F)" }
                    ]
                },
                {
                    id: "sweating",
                    question: "How much are you sweating?",
                    options: [
                        { value: "normal", label: "Normal sweating" },
                        { value: "excessive", label: "Excessive, profuse sweating" },
                        { value: "stopped", label: "Stopped sweating (dangerous sign)" }
                    ]
                },
                {
                    id: "symptoms",
                    question: "What other symptoms do you have?",
                    options: [
                        { value: "mild", label: "Mild fatigue and thirst" },
                        { value: "moderate", label: "Nausea, headache, dizziness" },
                        { value: "severe", label: "Vomiting, confusion, muscle cramps" }
                    ]
                },
                {
                    id: "duration",
                    question: "How long have you been in the heat?",
                    options: [
                        { value: "short", label: "Less than 1 hour" },
                        { value: "moderate", label: "1-3 hours" },
                        { value: "extended", label: "More than 3 hours" }
                    ]
                },
                {
                    id: "hydration",
                    question: "How much water have you consumed today?",
                    options: [
                        { value: "adequate", label: "More than 2 liters" },
                        { value: "some", label: "1-2 liters" },
                        { value: "little", label: "Less than 1 liter" }
                    ]
                }
            ]
        },
        'dehydration': {
            name: "Dehydration",
            icon: "💧",
            description: "Thirst, dry mouth, fatigue, dizziness",
            category: "heat-related",
            followupQuestions: [
                {
                    id: "severity",
                    question: "How severe are your symptoms?",
                    options: [
                        { value: "mild", label: "Slightly thirsty, mild fatigue" },
                        { value: "moderate", label: "Very thirsty, dry mouth, headache" },
                        { value: "severe", label: "Dizziness, confusion, rapid heartbeat" }
                    ]
                },
                {
                    id: "urine",
                    question: "What color is your urine?",
                    options: [
                        { value: "light", label: "Light yellow or clear" },
                        { value: "dark", label: "Dark yellow" },
                        { value: "very-dark", label: "Very dark or brown" }
                    ]
                },
                {
                    id: "intake",
                    question: "Can you keep fluids down?",
                    options: [
                        { value: "yes", label: "Yes, drinking normally" },
                        { value: "some", label: "Some, but not enough" },
                        { value: "unable", label: "Unable to keep fluids down" }
                    ]
                },
                {
                    id: "duration",
                    question: "How long have you felt this way?",
                    options: [
                        { value: "recent", label: "A few hours" },
                        { value: "today", label: "Since this morning" },
                        { value: "extended", label: "More than a day" }
                    ]
                }
            ]
        },
        'heat-stroke': {
            name: "Heat Stroke",
            icon: "🔥",
            description: "High fever, confusion, hot dry skin - EMERGENCY",
            category: "heat-related",
            followupQuestions: [
                {
                    id: "temperature",
                    question: "What is the person's body temperature?",
                    options: [
                        { value: "high", label: "Very high (>104°F/40°C)" },
                        { value: "unknown", label: "Don't know, but feels very hot" },
                        { value: "normal", label: "Seems normal" }
                    ]
                },
                {
                    id: "mental-state",
                    question: "What is their mental state?",
                    options: [
                        { value: "alert", label: "Alert and responsive" },
                        { value: "confused", label: "Confused or disoriented" },
                        { value: "unconscious", label: "Unconscious or unresponsive" }
                    ]
                },
                {
                    id: "skin",
                    question: "How does their skin feel?",
                    options: [
                        { value: "sweaty", label: "Hot and sweaty" },
                        { value: "dry", label: "Hot and dry" },
                        { value: "normal", label: "Normal temperature" }
                    ]
                }
            ]
        },
        'cuts': {
            name: "Cuts & Wounds",
            icon: "🩹",
            description: "Bleeding, lacerations, punctures",
            category: "injury",
            followupQuestions: [
                {
                    id: "severity",
                    question: "How deep is the wound?",
                    options: [
                        { value: "superficial", label: "Superficial scratch or scrape" },
                        { value: "moderate", label: "Moderate cut, some depth" },
                        { value: "deep", label: "Deep cut, can see fat or muscle" }
                    ]
                },
                {
                    id: "bleeding",
                    question: "How much bleeding is there?",
                    options: [
                        { value: "minimal", label: "Minimal bleeding, stops easily" },
                        { value: "moderate", label: "Steady bleeding" },
                        { value: "severe", label: "Heavy bleeding, won't stop" }
                    ]
                },
                {
                    id: "location",
                    question: "Where is the wound located?",
                    options: [
                        { value: "extremity", label: "Arm, leg, hand, or foot" },
                        { value: "torso", label: "Chest, back, or abdomen" },
                        { value: "head", label: "Head, face, or neck" }
                    ]
                },
                {
                    id: "contamination",
                    question: "Is the wound contaminated?",
                    options: [
                        { value: "clean", label: "Clean wound" },
                        { value: "dirty", label: "Dirty or has debris" },
                        { value: "unknown", label: "Not sure" }
                    ]
                }
            ]
        },
        'burns': {
            name: "Burns",
            icon: "🔥",
            description: "Heat, chemical, or sun burns",
            category: "injury",
            followupQuestions: [
                {
                    id: "degree",
                    question: "What type of burn is it?",
                    options: [
                        { value: "first", label: "Red skin, no blisters (1st degree)" },
                        { value: "second", label: "Blisters and severe pain (2nd degree)" },
                        { value: "third", label: "White/charred skin, no pain (3rd degree)" }
                    ]
                },
                {
                    id: "size",
                    question: "How large is the burned area?",
                    options: [
                        { value: "small", label: "Smaller than palm of hand" },
                        { value: "medium", label: "Size of palm to dinner plate" },
                        { value: "large", label: "Larger than dinner plate" }
                    ]
                },
                {
                    id: "cause",
                    question: "What caused the burn?",
                    options: [
                        { value: "heat", label: "Heat (fire, hot object)" },
                        { value: "sun", label: "Sun exposure" },
                        { value: "chemical", label: "Chemical" }
                    ]
                },
                {
                    id: "location",
                    question: "Where is the burn located?",
                    options: [
                        { value: "extremity", label: "Arms or legs" },
                        { value: "face", label: "Face or neck" },
                        { value: "torso", label: "Chest, back, or abdomen" }
                    ]
                }
            ]
        },
        'breathing': {
            name: "Breathing Problems",
            icon: "🫁",
            description: "Shortness of breath, wheezing",
            category: "respiratory",
            followupQuestions: [
                {
                    id: "severity",
                    question: "How is your breathing?",
                    options: [
                        { value: "mild", label: "Slight difficulty, can speak normally" },
                        { value: "moderate", label: "Noticeable difficulty, short sentences" },
                        { value: "severe", label: "Severe difficulty, cannot speak" }
                    ]
                },
                {
                    id: "onset",
                    question: "When did this start?",
                    options: [
                        { value: "sudden", label: "Suddenly, within minutes" },
                        { value: "gradual", label: "Gradually over hours" },
                        { value: "chronic", label: "Has been ongoing" }
                    ]
                },
                {
                    id: "triggers",
                    question: "Any known triggers?",
                    options: [
                        { value: "dust", label: "Dust storm or sand" },
                        { value: "heat", label: "Extreme heat" },
                        { value: "none", label: "No obvious trigger" }
                    ]
                }
            ]
        }
    };

    // Enhanced assessment logic with desert-specific recommendations
    assessSymptoms(symptom, answers) {
        const assessments = {
            'heat-exhaustion': (answers) => {
                const riskFactors = [
                    answers.sweating === 'stopped',
                    answers.symptoms === 'severe',
                    answers.duration === 'extended',
                    answers.hydration === 'little'
                ].filter(Boolean).length;

                if (riskFactors >= 2 || answers.sweating === 'stopped') {
                    return {
                        urgency: 'high',
                        advice: [
                            'Move to shade or air conditioning immediately',
                            'Remove excess clothing',
                            'Apply cool water to skin',
                            'Seek medical attention if no improvement in 30 minutes'
                        ],
                        firstAid: [
                            'Move person to coolest available location',
                            'Remove tight or excess clothing',
                            'Apply cool, wet cloths to skin',
                            'Fan the person while misting with water',
                            'Give cool water if conscious and able to swallow'
                        ],
                        homeRemedies: [
                            'Wet towel on neck and wrists (uses 100ml water)',
                            'Aloe vera gel on skin for cooling',
                            'Electrolyte solution: 1/4 tsp salt + 2 tbsp sugar in 250ml water',
                            'Rest in darkest, coolest area available'
                        ]
                    };
                } else if (riskFactors >= 1) {
                    return {
                        urgency: 'moderate',
                        advice: [
                            'Rest in shade immediately',
                            'Drink cool fluids slowly',
                            'Cool the body gradually',
                            'Monitor symptoms closely'
                        ],
                        firstAid: [
                            'Find shade or create shelter',
                            'Loosen clothing',
                            'Sip cool water slowly',
                            'Use wet cloth on pulse points',
                            'Rest and avoid further heat exposure'
                        ],
                        homeRemedies: [
                            'Minimal water cooling technique (50ml on cloth)',
                            'Mint tea for internal cooling (when available)',
                            'Cucumber slices on temples if available',
                            'Elevate legs while resting'
                        ]
                    };
                } else {
                    return {
                        urgency: 'low',
                        advice: [
                            'Take frequent breaks in shade',
                            'Increase fluid intake',
                            'Avoid peak sun hours',
                            'Monitor for worsening symptoms'
                        ],
                        firstAid: [
                            'Rest in shade',
                            'Drink water regularly',
                            'Wear light-colored, loose clothing',
                            'Use hat or head covering'
                        ],
                        homeRemedies: [
                            'Regular small sips of water',
                            'Light-colored clothing for reflection',
                            'Wet bandana around neck',
                            'Avoid alcohol and caffeine'
                        ]
                    };
                }
            },
            'dehydration': (answers) => {
                const severity = answers.severity;
                const urineColor = answers.urine;
                const canDrink = answers.intake;

                if (severity === 'severe' || urineColor === 'very-dark' || canDrink === 'unable') {
                    return {
                        urgency: 'high',
                        advice: [
                            'Seek immediate medical attention',
                            'May need intravenous fluids',
                            'Do not delay treatment',
                            'Call emergency services if severe'
                        ],
                        firstAid: [
                            'Sip small amounts of water frequently',
                            'Try oral rehydration solution',
                            'Rest in cool, shaded area',
                            'Monitor consciousness level',
                            'Prepare for emergency transport'
                        ],
                        homeRemedies: [
                            'Emergency electrolyte solution (recipe below)',
                            'Ice chips if available (conserves water)',
                            'Coconut water if available',
                            'Avoid solid foods initially'
                        ]
                    };
                } else if (severity === 'moderate' || urineColor === 'dark') {
                    return {
                        urgency: 'moderate',
                        advice: [
                            'Increase fluid intake gradually',
                            'Use oral rehydration solutions',
                            'Rest and avoid heat',
                            'Monitor symptoms closely'
                        ],
                        firstAid: [
                            'Drink water slowly and steadily',
                            'Add pinch of salt to water',
                            'Rest in shade',
                            'Avoid strenuous activity',
                            'Monitor urine color'
                        ],
                        homeRemedies: [
                            'Homemade ORS: 1/4 tsp salt + 2 tbsp sugar in 250ml water',
                            'Dates for natural electrolytes',
                            'Small frequent sips rather than large amounts',
                            'Wet cloth on forehead for comfort'
                        ]
                    };
                } else {
                    return {
                        urgency: 'low',
                        advice: [
                            'Increase water intake',
                            'Rest in shade',
                            'Monitor symptoms',
                            'Prevent further dehydration'
                        ],
                        firstAid: [
                            'Drink water regularly',
                            'Eat water-rich foods if available',
                            'Avoid caffeine and alcohol',
                            'Take breaks from heat'
                        ],
                        homeRemedies: [
                            'Regular water intake throughout day',
                            'Watermelon or cucumber if available',
                            'Light meals to aid hydration',
                            'Monitor urine color as indicator'
                        ]
                    };
                }
            },
            'heat-stroke': (answers) => {
                return {
                    urgency: 'emergency',
                    advice: [
                        'CALL EMERGENCY SERVICES IMMEDIATELY',
                        'This is a life-threatening emergency',
                        'Begin cooling measures while waiting for help',
                        'Do not leave person alone'
                    ],
                    firstAid: [
                        'Call emergency services immediately',
                        'Move to coolest location available',
                        'Remove clothing',
                        'Apply cool water to entire body',
                        'Fan aggressively while applying water',
                        'Monitor breathing and consciousness'
                    ],
                    homeRemedies: [
                        'Use all available water for cooling',
                        'Ice packs on neck, armpits, groin if available',
                        'Wet sheets or towels over body',
                        'Create airflow with any available means'
                    ]
                };
            },
            'cuts': (answers) => {
                const severity = answers.severity;
                const bleeding = answers.bleeding;
                const location = answers.location;

                if (severity === 'deep' || bleeding === 'severe' || location === 'head') {
                    return {
                        urgency: 'high',
                        advice: [
                            'Apply direct pressure to control bleeding',
                            'Seek medical attention immediately',
                            'Do not remove embedded objects',
                            'Elevate if possible'
                        ],
                        firstAid: [
                            'Apply direct pressure with clean cloth',
                            'Do not remove embedded objects',
                            'Elevate wound above heart if possible',
                            'Apply pressure bandage',
                            'Monitor for shock'
                        ],
                        homeRemedies: [
                            'Clean water for initial cleaning (minimal amount)',
                            'Honey as natural antiseptic if available',
                            'Clean cloth for bandaging',
                            'Pressure points to control bleeding'
                        ]
                    };
                } else if (severity === 'moderate' || bleeding === 'moderate') {
                    return {
                        urgency: 'moderate',
                        advice: [
                            'Clean wound thoroughly',
                            'Apply antiseptic if available',
                            'Bandage securely',
                            'Monitor for infection signs'
                        ],
                        firstAid: [
                            'Clean hands before treating',
                            'Rinse wound with clean water',
                            'Apply pressure to stop bleeding',
                            'Cover with sterile bandage',
                            'Change dressing daily'
                        ],
                        homeRemedies: [
                            'Minimal water cleaning (50ml)',
                            'Honey dressing for healing',
                            'Aloe vera for wound healing',
                            'Keep wound elevated when possible'
                        ]
                    };
                } else {
                    return {
                        urgency: 'low',
                        advice: [
                            'Clean wound gently',
                            'Apply basic first aid',
                            'Keep wound clean and dry',
                            'Monitor for infection'
                        ],
                        firstAid: [
                            'Wash hands thoroughly',
                            'Clean with minimal water',
                            'Apply adhesive bandage',
                            'Keep dry and protected'
                        ],
                        homeRemedies: [
                            'Minimal water cleaning (25ml)',
                            'Natural honey antiseptic',
                            'Clean cloth bandaging',
                            'Daily inspection for healing'
                        ]
                    };
                }
            },
            'burns': (answers) => {
                const degree = answers.degree;
                const size = answers.size;
                const location = answers.location;

                if (degree === 'third' || size === 'large' || location === 'face') {
                    return {
                        urgency: 'emergency',
                        advice: [
                            'Seek emergency medical care immediately',
                            'Do not apply ice or butter',
                            'Cover with clean, dry cloth',
                            'Monitor for shock'
                        ],
                        firstAid: [
                            'Remove from heat source',
                            'Do not remove stuck clothing',
                            'Cover with clean, dry cloth',
                            'Do not apply ice or ointments',
                            'Monitor breathing if face burn'
                        ],
                        homeRemedies: [
                            'Cool water for initial cooling (not ice)',
                            'Clean cloth covering',
                            'Aloe vera for minor areas only',
                            'Elevate burned area if possible'
                        ]
                    };
                } else if (degree === 'second' || size === 'medium') {
                    return {
                        urgency: 'high',
                        advice: [
                            'Cool with water immediately',
                            'Seek medical attention',
                            'Do not break blisters',
                            'Cover with sterile bandage'
                        ],
                        firstAid: [
                            'Cool with water for 10-20 minutes',
                            'Remove jewelry before swelling',
                            'Cover with sterile, non-stick bandage',
                            'Take pain medication if available',
                            'Do not break blisters'
                        ],
                        homeRemedies: [
                            'Cool water treatment (use sparingly)',
                            'Aloe vera gel for cooling',
                            'Honey for healing properties',
                            'Loose, clean bandaging'
                        ]
                    };
                } else {
                    return {
                        urgency: 'moderate',
                        advice: [
                            'Cool with water',
                            'Apply aloe vera if available',
                            'Keep clean and protected',
                            'Monitor for infection'
                        ],
                        firstAid: [
                            'Cool with water',
                            'Apply aloe vera or cool compress',
                            'Take pain reliever if available',
                            'Keep area clean'
                        ],
                        homeRemedies: [
                            'Minimal cool water application',
                            'Fresh aloe vera gel',
                            'Cool, damp cloth',
                            'Avoid further sun exposure'
                        ]
                    };
                }
            },
            'breathing': (answers) => {
                const severity = answers.severity;
                const onset = answers.onset;

                if (severity === 'severe' || onset === 'sudden') {
                    return {
                        urgency: 'emergency',
                        advice: [
                            'Seek emergency medical care immediately',
                            'Call emergency services',
                            'Help person sit upright',
                            'Stay calm and provide reassurance'
                        ],
                        firstAid: [
                            'Call emergency services',
                            'Help person sit upright',
                            'Loosen tight clothing',
                            'Encourage slow, deep breaths',
                            'Do not leave alone'
                        ],
                        homeRemedies: [
                            'Move to cleaner air if dust-related',
                            'Sit upright position',
                            'Cool, damp cloth on forehead',
                            'Create airflow if possible'
                        ]
                    };
                } else if (severity === 'moderate') {
                    return {
                        urgency: 'high',
                        advice: [
                            'Seek medical attention',
                            'Rest in comfortable position',
                            'Avoid triggers',
                            'Monitor closely'
                        ],
                        firstAid: [
                            'Sit in comfortable position',
                            'Encourage slow breathing',
                            'Remove from triggers',
                            'Use prescribed medications if available'
                        ],
                        homeRemedies: [
                            'Steam inhalation if water available',
                            'Upright sitting position',
                            'Avoid dust and irritants',
                            'Relaxation techniques'
                        ]
                    };
                } else {
                    return {
                        urgency: 'moderate',
                        advice: [
                            'Rest and avoid exertion',
                            'Stay in clean air',
                            'Monitor symptoms',
                            'Seek help if worsens'
                        ],
                        firstAid: [
                            'Rest in comfortable position',
                            'Avoid strenuous activity',
                            'Stay hydrated',
                            'Practice relaxation'
                        ],
                        homeRemedies: [
                            'Warm water gargle if available',
                            'Honey for throat soothing',
                            'Avoid smoke and dust',
                            'Deep breathing exercises'
                        ]
                    };
                }
            }
        };

        return assessments[symptom] ? assessments[symptom](answers) : null;
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('start-assessment').addEventListener('click', () => {
            this.showScreen('assessment-type');
        });

        document.getElementById('photo-analysis').addEventListener('click', () => {
            this.showScreen('photo-analysis');
        });

        document.getElementById('home-remedies').addEventListener('click', () => {
            this.showScreen('home-remedies');
        });

        // Assessment type selection
        document.querySelectorAll('.assessment-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.dataset.type;
                if (type === 'symptoms') {
                    this.showScreen('symptom');
                } else if (type === 'photo') {
                    this.showScreen('photo-analysis');
                } else if (type === 'emergency') {
                    this.showEmergencyModal();
                }
            });
        });

        // Back buttons
        document.getElementById('back-to-welcome').addEventListener('click', () => {
            this.showScreen('welcome');
        });

        document.getElementById('back-to-assessment-type').addEventListener('click', () => {
            this.showScreen('assessment-type');
        });

        document.getElementById('back-to-assessment-type-2').addEventListener('click', () => {
            this.showScreen('assessment-type');
        });

        document.getElementById('back-to-symptoms').addEventListener('click', () => {
            this.showScreen('symptom');
        });

        document.getElementById('back-to-welcome-from-remedies').addEventListener('click', () => {
            this.showScreen('welcome');
        });

        // Weather sidebar
        document.getElementById('weather-toggle').addEventListener('click', () => {
            this.toggleWeatherSidebar();
        });

        document.getElementById('close-sidebar').addEventListener('click', () => {
            this.toggleWeatherSidebar();
        });

        // Emergency button
        document.getElementById('emergency-btn').addEventListener('click', () => {
            this.showEmergencyModal();
        });

        // Photo analysis
        document.getElementById('start-camera').addEventListener('click', () => {
            this.startCamera();
        });

        document.getElementById('take-photo').addEventListener('click', () => {
            this.takePhoto();
        });

        document.getElementById('retake-photo').addEventListener('click', () => {
            this.retakePhoto();
        });

        document.getElementById('upload-btn').addEventListener('click', () => {
            document.getElementById('upload-photo').click();
        });

        document.getElementById('upload-photo').addEventListener('change', (e) => {
            this.handlePhotoUpload(e);
        });

        document.getElementById('analyze-photo').addEventListener('click', () => {
            this.analyzePhoto();
        });

        // Question navigation
        document.getElementById('next-question').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('prev-question').addEventListener('click', () => {
            this.prevQuestion();
        });

        document.getElementById('get-results').addEventListener('click', () => {
            this.showResults();
        });

        // Results actions
        document.getElementById('start-new-assessment').addEventListener('click', () => {
            this.resetApp();
        });

        document.getElementById('save-assessment').addEventListener('click', () => {
            this.saveAssessment();
        });

        document.getElementById('share-results').addEventListener('click', () => {
            this.shareResults();
        });

        // Modal close
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Symptom selection
        this.setupSymptomSelection();
    }

    setupSymptomSelection() {
        document.querySelectorAll('.symptom-card.enhanced').forEach(card => {
            card.addEventListener('click', () => {
                const symptom = card.dataset.symptom;
                this.selectSymptom(symptom);
            });
        });
    }

    selectSymptom(symptomKey) {
        this.currentSymptom = symptomKey;
        this.currentQuestionIndex = 0;
        this.followupAnswers = {};
        
        // Update visual selection
        document.querySelectorAll('.symptom-card.enhanced').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-symptom="${symptomKey}"]`).classList.add('selected');
        
        // Initialize questions
        this.currentQuestions = this.symptoms[symptomKey].followupQuestions;
        
        setTimeout(() => {
            this.initializeFollowupScreen();
            this.showScreen('followup');
        }, 300);
    }

    initializeFollowupScreen() {
        const symptom = this.symptoms[this.currentSymptom];
        document.getElementById('followup-title').textContent = `${symptom.name} Assessment`;
        document.getElementById('followup-subtitle').textContent = 'Please answer these questions to help us provide better guidance';
        
        document.getElementById('total-questions').textContent = this.currentQuestions.length;
        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const content = document.getElementById('followup-content');
        
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        this.updateProgressBar();
        
        content.innerHTML = `
            <div class="question-group">
                <h4>${question.question}</h4>
                <div class="radio-group">
                    ${question.options.map(option => `
                        <div class="radio-option">
                            <input type="radio" name="${question.id}" value="${option.value}" id="${question.id}-${option.value}"
                                ${this.followupAnswers[question.id] === option.value ? 'checked' : ''}>
                            <label for="${question.id}-${option.value}">${option.label}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add event listeners for radio buttons
        content.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.followupAnswers[question.id] = radio.value;
                this.updateNavigationButtons();
            });
        });
        
        this.updateNavigationButtons();
    }

    updateProgressBar() {
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const resultsBtn = document.getElementById('get-results');
        
        prevBtn.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
        
        const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
        const hasAnswer = this.followupAnswers[currentQuestion.id];
        
        if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
            nextBtn.style.display = 'none';
            resultsBtn.style.display = hasAnswer ? 'block' : 'none';
        } else {
            nextBtn.style.display = hasAnswer ? 'block' : 'none';
            resultsBtn.style.display = 'none';
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.showCurrentQuestion();
        }
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showCurrentQuestion();
        }
    }

    showResults() {
        this.assessmentResult = this.assessSymptoms(this.currentSymptom, this.followupAnswers);
        
        if (!this.assessmentResult) {
            alert('Unable to assess symptoms. Please try again.');
            return;
        }
        
        // Update urgency badge
        const urgencyBadge = document.getElementById('urgency-badge');
        const urgencyLevel = document.getElementById('urgency-level');
        
        urgencyBadge.className = `urgency-badge ${this.assessmentResult.urgency}`;
        urgencyLevel.textContent = `${this.assessmentResult.urgency.charAt(0).toUpperCase() + this.assessmentResult.urgency.slice(1)} Priority`;
        
        // Update priority indicator
        const priorityIndicator = document.getElementById('priority-indicator');
        priorityIndicator.textContent = `${this.assessmentResult.urgency.charAt(0).toUpperCase() + this.assessmentResult.urgency.slice(1)} Priority`;
        priorityIndicator.className = `priority-indicator ${this.assessmentResult.urgency}`;
        
        // Update advice content
        this.updateResultsContent('advice-content', this.assessmentResult.advice);
        this.updateResultsContent('first-aid-content', this.assessmentResult.firstAid);
        this.updateResultsContent('home-remedies-content', this.assessmentResult.homeRemedies);
        
        // Load providers
        this.loadProviders();
        
        this.showScreen('results');
    }

    updateResultsContent(elementId, items) {
        const element = document.getElementById(elementId);
        const list = document.createElement('ul');
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
        
        element.innerHTML = '';
        element.appendChild(list);
    }

    async loadProviders() {
        try {
            const response = await fetch('providers.json');
            const providers = await response.json();
            
            const providersContent = document.getElementById('providers-content');
            providersContent.innerHTML = '';
            
            // Filter providers based on urgency level
            let relevantProviders = providers;
            if (this.assessmentResult.urgency === 'emergency' || this.assessmentResult.urgency === 'high') {
                relevantProviders = providers.filter(p => 
                    p.type === 'Emergency Room' || p.type === 'Hospital' || p.type === 'Urgent Care'
                );
            } else if (this.assessmentResult.urgency === 'moderate') {
                relevantProviders = providers.filter(p => 
                    p.type === 'Urgent Care' || p.type === 'Clinic'
                );
            }
            
            // Show top 3 most relevant providers
            relevantProviders.slice(0, 3).forEach(provider => {
                const providerCard = document.createElement('div');
                providerCard.className = 'provider-card';
                
                providerCard.innerHTML = `
                    <div class="provider-name">${provider.name}</div>
                    <div class="provider-type">${provider.type}</div>
                    <div class="provider-contact">📞 ${provider.phone}</div>
                    <div class="provider-contact">📍 ${provider.address}</div>
                    <div class="provider-services">Services: ${provider.services.join(', ')}</div>
                `;
                
                providersContent.appendChild(providerCard);
            });
            
            if (relevantProviders.length === 0) {
                providersContent.innerHTML = '<p>No specific providers found. Contact your local healthcare services.</p>';
            }
        } catch (error) {
            console.error('Error loading providers:', error);
            document.getElementById('providers-content').innerHTML = 
                '<p>Unable to load provider information. Please contact your local healthcare services.</p>';
        }
    }

    // Camera functionality
    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            const video = document.getElementById('camera-feed');
            video.srcObject = stream;
            
            document.getElementById('start-camera').style.display = 'none';
            document.getElementById('take-photo').style.display = 'block';
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please use the upload option instead.');
        }
    }

    takePhoto() {
        const video = document.getElementById('camera-feed');
        const canvas = document.getElementById('photo-canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        this.photoData = canvas.toDataURL('image/jpeg');
        
        // Stop camera stream
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        
        // Show captured photo
        video.style.display = 'none';
        canvas.style.display = 'block';
        
        document.getElementById('take-photo').style.display = 'none';
        document.getElementById('retake-photo').style.display = 'block';
        document.getElementById('analyze-photo').style.display = 'block';
        
        this.showPhotoResult();
    }

    retakePhoto() {
        const video = document.getElementById('camera-feed');
        const canvas = document.getElementById('photo-canvas');
        
        video.style.display = 'block';
        canvas.style.display = 'none';
        
        document.getElementById('take-photo').style.display = 'block';
        document.getElementById('retake-photo').style.display = 'none';
        document.getElementById('analyze-photo').style.display = 'none';
        
        document.getElementById('photo-result').style.display = 'none';
        
        this.startCamera();
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.photoData = e.target.result;
                this.showPhotoResult();
                document.getElementById('analyze-photo').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    showPhotoResult() {
        const resultDiv = document.getElementById('photo-result');
        const img = document.getElementById('captured-image');
        
        img.src = this.photoData;
        resultDiv.style.display = 'grid';
    }

    analyzePhoto() {
        // Simulated photo analysis - in a real app, this would use AI/ML
        const analysisResult = document.getElementById('photo-analysis-result');
        
        // Simple analysis based on common visual patterns
        const analysis = this.simulatePhotoAnalysis();
        
        analysisResult.innerHTML = `
            <div class="analysis-item">
                <h4>Visual Assessment</h4>
                <p><strong>Condition Type:</strong> ${analysis.type}</p>
                <p><strong>Severity:</strong> ${analysis.severity}</p>
                <p><strong>Recommendations:</strong></p>
                <ul>
                    ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            <div class="analysis-disclaimer">
                <p><em>Note: This is a basic visual assessment. For accurate diagnosis, consult a healthcare professional.</em></p>
            </div>
        `;
    }

    simulatePhotoAnalysis() {
        // This is a simplified simulation - real implementation would use computer vision
        const conditions = [
            {
                type: "Minor Cut/Abrasion",
                severity: "Low",
                recommendations: [
                    "Clean with minimal water",
                    "Apply honey as natural antiseptic",
                    "Cover with clean bandage",
                    "Monitor for signs of infection"
                ]
            },
            {
                type: "Possible Burn",
                severity: "Moderate",
                recommendations: [
                    "Cool with water immediately",
                    "Do not apply ice",
                    "Apply aloe vera if available",
                    "Seek medical attention if severe"
                ]
            },
            {
                type: "Skin Irritation/Rash",
                severity: "Low",
                recommendations: [
                    "Keep area clean and dry",
                    "Avoid further irritants",
                    "Apply cool compress",
                    "Monitor for spreading"
                ]
            }
        ];
        
        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    // Weather and sidebar functionality
    updateWeatherInfo() {
        // Simulated weather data for desert region
        const weatherData = {
            temperature: 42,
            condition: "Hot & Dry",
            humidity: 15,
            alerts: [
                {
                    type: "high-risk",
                    title: "Extreme Heat Warning",
                    message: "High risk of heat exhaustion"
                }
            ]
        };
        
        document.querySelector('.temperature').textContent = `${weatherData.temperature}°C`;
        document.querySelector('.condition').textContent = weatherData.condition;
        document.querySelector('.humidity').textContent = `Humidity: ${weatherData.humidity}%`;
        document.querySelector('.temp-display').textContent = `${weatherData.temperature}°C`;
    }

    toggleWeatherSidebar() {
        const sidebar = document.getElementById('weather-sidebar');
        sidebar.classList.toggle('active');
    }

    showEmergencyModal() {
        const modal = document.getElementById('emergency-modal');
        modal.classList.add('active');
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    saveAssessment() {
        const assessment = {
            symptom: this.currentSymptom,
            answers: this.followupAnswers,
            result: this.assessmentResult,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('lastAssessment', JSON.stringify(assessment));
        alert('Assessment saved successfully!');
    }

    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: 'Health Assessment Results',
                text: `Assessment completed for ${this.symptoms[this.currentSymptom].name}. Urgency level: ${this.assessmentResult.urgency}`,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const text = `Health Assessment Results\n\nCondition: ${this.symptoms[this.currentSymptom].name}\nUrgency: ${this.assessmentResult.urgency}\n\nRecommendations:\n${this.assessmentResult.advice.join('\n')}`;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
                alert('Results copied to clipboard!');
            } else {
                alert('Sharing not supported on this device.');
            }
        }
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(`${screenName}-screen`).classList.add('active');
    }

    resetApp() {
        this.currentSymptom = null;
        this.currentQuestionIndex = 0;
        this.followupAnswers = {};
        this.assessmentResult = null;
        this.currentQuestions = [];
        this.photoData = null;
        
        // Clear selections
        document.querySelectorAll('.symptom-card.enhanced').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Reset photo analysis
        document.getElementById('camera-feed').style.display = 'block';
        document.getElementById('photo-canvas').style.display = 'none';
        document.getElementById('photo-result').style.display = 'none';
        
        // Reset buttons
        document.getElementById('start-camera').style.display = 'block';
        document.getElementById('take-photo').style.display = 'none';
        document.getElementById('retake-photo').style.display = 'none';
        document.getElementById('analyze-photo').style.display = 'none';
        
        this.showScreen('welcome');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new MediCareDesert();
});