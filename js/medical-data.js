// Medical data and knowledge base for offline functionality
const MedicalData = {
    // Dehydration assessment data
    dehydration: {
        symptoms: [
            {
                id: 'thirst',
                question: 'How would you describe your thirst level?',
                questionEs: '¿Cómo describiría su nivel de sed?',
                options: [
                    { value: 0, text: 'No thirst', textEs: 'Sin sed' },
                    { value: 1, text: 'Mild thirst', textEs: 'Sed leve' },
                    { value: 2, text: 'Moderate thirst', textEs: 'Sed moderada' },
                    { value: 3, text: 'Extreme thirst', textEs: 'Sed extrema' }
                ]
            },
            {
                id: 'urination',
                question: 'How often have you urinated in the last 8 hours?',
                questionEs: '¿Con qué frecuencia ha orinado en las últimas 8 horas?',
                options: [
                    { value: 0, text: 'Normal frequency (4-6 times)', textEs: 'Frecuencia normal (4-6 veces)' },
                    { value: 1, text: 'Less than usual (2-3 times)', textEs: 'Menos de lo usual (2-3 veces)' },
                    { value: 2, text: 'Very little (1 time)', textEs: 'Muy poco (1 vez)' },
                    { value: 3, text: 'None at all', textEs: 'Nada en absoluto' }
                ]
            },
            {
                id: 'mouth',
                question: 'How does your mouth feel?',
                questionEs: '¿Cómo se siente su boca?',
                options: [
                    { value: 0, text: 'Normal moisture', textEs: 'Humedad normal' },
                    { value: 1, text: 'Slightly dry', textEs: 'Ligeramente seca' },
                    { value: 2, text: 'Very dry', textEs: 'Muy seca' },
                    { value: 3, text: 'Extremely dry and sticky', textEs: 'Extremadamente seca y pegajosa' }
                ]
            },
            {
                id: 'skin',
                question: 'When you pinch the skin on the back of your hand, how quickly does it return to normal?',
                questionEs: 'Cuando pellizca la piel del dorso de su mano, ¿qué tan rápido vuelve a la normalidad?',
                options: [
                    { value: 0, text: 'Immediately (less than 1 second)', textEs: 'Inmediatamente (menos de 1 segundo)' },
                    { value: 1, text: 'Quickly (1-2 seconds)', textEs: 'Rápidamente (1-2 segundos)' },
                    { value: 2, text: 'Slowly (3-4 seconds)', textEs: 'Lentamente (3-4 segundos)' },
                    { value: 3, text: 'Very slowly (5+ seconds)', textEs: 'Muy lentamente (5+ segundos)' }
                ]
            },
            {
                id: 'energy',
                question: 'How is your energy level?',
                questionEs: '¿Cómo está su nivel de energía?',
                options: [
                    { value: 0, text: 'Normal energy', textEs: 'Energía normal' },
                    { value: 1, text: 'Slightly tired', textEs: 'Ligeramente cansado' },
                    { value: 2, text: 'Very tired and weak', textEs: 'Muy cansado y débil' },
                    { value: 3, text: 'Extremely weak, dizzy', textEs: 'Extremadamente débil, mareado' }
                ]
            }
        ],
        assessment: {
            mild: {
                range: [0, 5],
                title: 'Mild Dehydration',
                titleEs: 'Deshidratación Leve',
                description: 'You may be experiencing mild dehydration. This is common in desert environments.',
                descriptionEs: 'Puede estar experimentando deshidratación leve. Esto es común en ambientes desérticos.',
                recommendations: [
                    'Drink water slowly and steadily',
                    'Rest in shade or cool area',
                    'Avoid alcohol and caffeine',
                    'Monitor your symptoms'
                ],
                recommendationsEs: [
                    'Beba agua lenta y constantemente',
                    'Descanse en sombra o área fresca',
                    'Evite alcohol y cafeína',
                    'Monitoree sus síntomas'
                ],
                urgency: 'low'
            },
            moderate: {
                range: [6, 10],
                title: 'Moderate Dehydration',
                titleEs: 'Deshidratación Moderada',
                description: 'You are showing signs of moderate dehydration. Immediate action is needed.',
                descriptionEs: 'Está mostrando signos de deshidratación moderada. Se necesita acción inmediata.',
                recommendations: [
                    'Drink oral rehydration solution if available',
                    'Drink small amounts of water frequently',
                    'Seek medical attention if symptoms worsen',
                    'Rest in cool environment',
                    'Avoid physical activity'
                ],
                recommendationsEs: [
                    'Beba solución de rehidratación oral si está disponible',
                    'Beba pequeñas cantidades de agua frecuentemente',
                    'Busque atención médica si los síntomas empeoran',
                    'Descanse en ambiente fresco',
                    'Evite actividad física'
                ],
                urgency: 'medium'
            },
            severe: {
                range: [11, 15],
                title: 'Severe Dehydration',
                titleEs: 'Deshidratación Severa',
                description: 'You are showing signs of severe dehydration. This requires immediate medical attention.',
                descriptionEs: 'Está mostrando signos de deshidratación severa. Esto requiere atención médica inmediata.',
                recommendations: [
                    'Seek immediate medical attention',
                    'Call emergency services if available',
                    'Drink small sips of water if conscious',
                    'Do not drink large amounts quickly',
                    'Lie down in cool area'
                ],
                recommendationsEs: [
                    'Busque atención médica inmediata',
                    'Llame a servicios de emergencia si están disponibles',
                    'Beba pequeños sorbos de agua si está consciente',
                    'No beba grandes cantidades rápidamente',
                    'Acuéstese en área fresca'
                ],
                urgency: 'high'
            }
        }
    },
    
    // Heat exhaustion assessment data
    heatExhaustion: {
        symptoms: [
            {
                id: 'temperature',
                question: 'What is your approximate body temperature or how do you feel?',
                questionEs: '¿Cuál es su temperatura corporal aproximada o cómo se siente?',
                options: [
                    { value: 0, text: 'Normal (98.6°F / 37°C)', textEs: 'Normal (98.6°F / 37°C)' },
                    { value: 1, text: 'Slightly warm (99-100°F / 37-38°C)', textEs: 'Ligeramente caliente (99-100°F / 37-38°C)' },
                    { value: 2, text: 'Hot (101-103°F / 38-39°C)', textEs: 'Caliente (101-103°F / 38-39°C)' },
                    { value: 3, text: 'Very hot (104°F+ / 40°C+)', textEs: 'Muy caliente (104°F+ / 40°C+)' }
                ]
            },
            {
                id: 'sweating',
                question: 'How much are you sweating?',
                questionEs: '¿Cuánto está sudando?',
                options: [
                    { value: 0, text: 'Normal sweating', textEs: 'Sudoración normal' },
                    { value: 1, text: 'Heavy sweating', textEs: 'Sudoración intensa' },
                    { value: 2, text: 'Profuse sweating', textEs: 'Sudoración profusa' },
                    { value: 3, text: 'No sweating despite heat', textEs: 'Sin sudoración a pesar del calor' }
                ]
            },
            {
                id: 'nausea',
                question: 'Are you experiencing nausea or vomiting?',
                questionEs: '¿Está experimentando náuseas o vómitos?',
                options: [
                    { value: 0, text: 'No nausea', textEs: 'Sin náuseas' },
                    { value: 1, text: 'Mild nausea', textEs: 'Náuseas leves' },
                    { value: 2, text: 'Strong nausea', textEs: 'Náuseas fuertes' },
                    { value: 3, text: 'Vomiting', textEs: 'Vómitos' }
                ]
            },
            {
                id: 'headache',
                question: 'Do you have a headache?',
                questionEs: '¿Tiene dolor de cabeza?',
                options: [
                    { value: 0, text: 'No headache', textEs: 'Sin dolor de cabeza' },
                    { value: 1, text: 'Mild headache', textEs: 'Dolor de cabeza leve' },
                    { value: 2, text: 'Moderate headache', textEs: 'Dolor de cabeza moderado' },
                    { value: 3, text: 'Severe headache', textEs: 'Dolor de cabeza severo' }
                ]
            },
            {
                id: 'confusion',
                question: 'How is your mental state?',
                questionEs: '¿Cómo está su estado mental?',
                options: [
                    { value: 0, text: 'Clear thinking', textEs: 'Pensamiento claro' },
                    { value: 1, text: 'Slightly confused', textEs: 'Ligeramente confundido' },
                    { value: 2, text: 'Very confused', textEs: 'Muy confundido' },
                    { value: 3, text: 'Disoriented or unconscious', textEs: 'Desorientado o inconsciente' }
                ]
            }
        ],
        assessment: {
            normal: {
                range: [0, 3],
                title: 'Normal Heat Response',
                titleEs: 'Respuesta Normal al Calor',
                description: 'Your body is responding normally to heat. Continue to stay hydrated and cool.',
                descriptionEs: 'Su cuerpo está respondiendo normalmente al calor. Continúe manteniéndose hidratado y fresco.',
                recommendations: [
                    'Continue drinking water regularly',
                    'Take breaks in shade',
                    'Wear light-colored, loose clothing',
                    'Monitor your condition'
                ],
                recommendationsEs: [
                    'Continúe bebiendo agua regularmente',
                    'Tome descansos en la sombra',
                    'Use ropa clara y suelta',
                    'Monitoree su condición'
                ],
                urgency: 'low'
            },
            exhaustion: {
                range: [4, 9],
                title: 'Heat Exhaustion',
                titleEs: 'Agotamiento por Calor',
                description: 'You are experiencing heat exhaustion. Immediate cooling and rest are needed.',
                descriptionEs: 'Está experimentando agotamiento por calor. Se necesita enfriamiento y descanso inmediatos.',
                recommendations: [
                    'Move to cool, shaded area immediately',
                    'Remove excess clothing',
                    'Apply cool water to skin',
                    'Drink cool fluids slowly',
                    'Rest and avoid activity',
                    'Seek medical attention if symptoms persist'
                ],
                recommendationsEs: [
                    'Muévase a un área fresca y sombreada inmediatamente',
                    'Quítese el exceso de ropa',
                    'Aplique agua fresca a la piel',
                    'Beba líquidos frescos lentamente',
                    'Descanse y evite actividad',
                    'Busque atención médica si los síntomas persisten'
                ],
                urgency: 'medium'
            },
            stroke: {
                range: [10, 15],
                title: 'Heat Stroke Risk',
                titleEs: 'Riesgo de Golpe de Calor',
                description: 'You may be experiencing heat stroke. This is a medical emergency requiring immediate attention.',
                descriptionEs: 'Puede estar experimentando un golpe de calor. Esta es una emergencia médica que requiere atención inmediata.',
                recommendations: [
                    'Call emergency services immediately',
                    'Move to coolest available location',
                    'Remove clothing and apply ice/cool water',
                    'Do not give fluids if unconscious',
                    'Monitor breathing and consciousness'
                ],
                recommendationsEs: [
                    'Llame a servicios de emergencia inmediatamente',
                    'Muévase a la ubicación más fresca disponible',
                    'Quite la ropa y aplique hielo/agua fría',
                    'No dé líquidos si está inconsciente',
                    'Monitoree respiración y conciencia'
                ],
                urgency: 'high'
            }
        }
    },
    
    // Image analysis patterns for offline matching
    imagePatterns: {
        dehydration: {
            skinTenting: {
                description: 'Skin tenting test showing delayed return',
                descriptionEs: 'Prueba de pellizco de piel mostrando retorno retardado',
                confidence: 0.8,
                indicators: ['slow skin return', 'poor skin elasticity', 'dehydration sign']
            },
            drySkin: {
                description: 'Dry, flaky skin indicating dehydration',
                descriptionEs: 'Piel seca y escamosa indicando deshidratación',
                confidence: 0.7,
                indicators: ['dry skin', 'flaky appearance', 'dehydration']
            },
            sunkenEyes: {
                description: 'Sunken eyes, a sign of severe dehydration',
                descriptionEs: 'Ojos hundidos, signo de deshidratación severa',
                confidence: 0.9,
                indicators: ['sunken eyes', 'severe dehydration', 'emergency sign']
            }
        },
        heatExhaustion: {
            profuseSweating: {
                description: 'Excessive sweating indicating heat stress',
                descriptionEs: 'Sudoración excesiva indicando estrés por calor',
                confidence: 0.8,
                indicators: ['excessive sweating', 'heat stress', 'overheating']
            },
            flushedSkin: {
                description: 'Red, flushed skin from heat exposure',
                descriptionEs: 'Piel roja y enrojecida por exposición al calor',
                confidence: 0.7,
                indicators: ['red skin', 'flushed appearance', 'heat exposure']
            },
            heatRash: {
                description: 'Heat rash from prolonged heat exposure',
                descriptionEs: 'Sarpullido por calor por exposición prolongada al calor',
                confidence: 0.6,
                indicators: ['heat rash', 'skin irritation', 'heat exposure']
            }
        }
    },
    
    // Chatbot decision tree
    chatbotResponses: {
        greetings: {
            patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'hola', 'buenos días'],
            responses: {
                en: [
                    "Hello! I'm here to help with desert health concerns. What symptoms are you experiencing?",
                    "Hi there! How can I assist you with your health today?",
                    "Good day! I'm your medical assistant. What can I help you with?"
                ],
                es: [
                    "¡Hola! Estoy aquí para ayudar con problemas de salud del desierto. ¿Qué síntomas está experimentando?",
                    "¡Hola! ¿Cómo puedo ayudarle con su salud hoy?",
                    "¡Buen día! Soy su asistente médico. ¿En qué puedo ayudarle?"
                ]
            }
        },
        dehydration: {
            patterns: ['dehydration', 'thirsty', 'dry mouth', 'no urine', 'deshidratación', 'sed', 'boca seca'],
            responses: {
                en: [
                    "Dehydration is serious in desert environments. Key signs include: extreme thirst, little/no urination, dry mouth, sunken eyes, and weakness. Are you experiencing any of these symptoms?",
                    "I can help assess dehydration. Common signs are: increased thirst, decreased urination, dry mouth and skin, fatigue, and dizziness. Which symptoms do you have?"
                ],
                es: [
                    "La deshidratación es seria en ambientes desérticos. Signos clave incluyen: sed extrema, poca/ninguna orina, boca seca, ojos hundidos y debilidad. ¿Está experimentando alguno de estos síntomas?",
                    "Puedo ayudar a evaluar la deshidratación. Signos comunes son: sed aumentada, orina disminuida, boca y piel secas, fatiga y mareos. ¿Qué síntomas tiene?"
                ]
            }
        },
        heatExhaustion: {
            patterns: ['heat exhaustion', 'overheating', 'hot', 'sweating', 'nausea', 'agotamiento por calor', 'calor', 'sudando'],
            responses: {
                en: [
                    "Heat exhaustion symptoms include: heavy sweating, weakness, nausea, headache, and dizziness. If you have a high fever (104°F+) or stop sweating, this could be heat stroke - seek immediate help!",
                    "Heat-related illness is dangerous. Symptoms range from heavy sweating and fatigue to confusion and high body temperature. What symptoms are you experiencing?"
                ],
                es: [
                    "Los síntomas de agotamiento por calor incluyen: sudoración intensa, debilidad, náuseas, dolor de cabeza y mareos. Si tiene fiebre alta (104°F+) o deja de sudar, ¡esto podría ser golpe de calor - busque ayuda inmediata!",
                    "Las enfermedades relacionadas con el calor son peligrosas. Los síntomas van desde sudoración intensa y fatiga hasta confusión y temperatura corporal alta. ¿Qué síntomas está experimentando?"
                ]
            }
        },
        emergency: {
            patterns: ['emergency', 'help', 'urgent', 'serious', 'unconscious', 'emergencia', 'ayuda', 'urgente', 'inconsciente'],
            responses: {
                en: [
                    "If this is a life-threatening emergency, call 911 immediately! For severe dehydration or heat stroke: move to cool area, remove excess clothing, apply cool water, and seek immediate medical attention.",
                    "Emergency signs include: unconsciousness, confusion, high fever (104°F+), no sweating despite heat, severe vomiting. Call emergency services now if experiencing these!"
                ],
                es: [
                    "¡Si esta es una emergencia que amenaza la vida, llame al 911 inmediatamente! Para deshidratación severa o golpe de calor: muévase a área fresca, quite ropa excesiva, aplique agua fría y busque atención médica inmediata.",
                    "Signos de emergencia incluyen: inconsciencia, confusión, fiebre alta (104°F+), sin sudoración a pesar del calor, vómitos severos. ¡Llame a servicios de emergencia ahora si experimenta esto!"
                ]
            }
        },
        prevention: {
            patterns: ['prevent', 'avoid', 'tips', 'advice', 'prevenir', 'evitar', 'consejos'],
            responses: {
                en: [
                    "Prevention tips: Drink water regularly (don't wait until thirsty), wear light-colored loose clothing, take frequent breaks in shade, avoid alcohol/caffeine, and recognize early warning signs.",
                    "Stay safe in the desert: hydrate before, during, and after activities; wear sun protection; rest during hottest hours (10am-4pm); and never ignore symptoms of heat illness."
                ],
                es: [
                    "Consejos de prevención: Beba agua regularmente (no espere hasta tener sed), use ropa clara y suelta, tome descansos frecuentes en sombra, evite alcohol/cafeína y reconozca signos de advertencia temprana.",
                    "Manténgase seguro en el desierto: hidrátese antes, durante y después de actividades; use protección solar; descanse durante las horas más calurosas (10am-4pm); y nunca ignore síntomas de enfermedad por calor."
                ]
            }
        },
        default: {
            responses: {
                en: [
                    "I can help with dehydration and heat-related health issues. Try asking about 'dehydration symptoms', 'heat exhaustion', or 'emergency signs'.",
                    "I'm specialized in desert health conditions. You can ask me about symptoms, prevention, or emergency situations.",
                    "I can assist with medical assessments for dehydration and heat illness. What specific symptoms or concerns do you have?"
                ],
                es: [
                    "Puedo ayudar con deshidratación y problemas de salud relacionados con el calor. Trate preguntando sobre 'síntomas de deshidratación', 'agotamiento por calor' o 'signos de emergencia'.",
                    "Me especializo en condiciones de salud del desierto. Puede preguntarme sobre síntomas, prevención o situaciones de emergencia.",
                    "Puedo ayudar con evaluaciones médicas para deshidratación y enfermedades por calor. ¿Qué síntomas o preocupaciones específicas tiene?"
                ]
            }
        }
    }
};

// Export for use in other modules
window.MedicalData = MedicalData;