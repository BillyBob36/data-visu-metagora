/* ============================================
   CYBERMETEO - MAIN APPLICATION
   Entry point and initialization
   ============================================ */

// Global instances
let avatarController = null;
let narrativeController = null;
let globalAudioContext = null;

// DOM Elements
let scenarioSelect = null;
let languageSelect = null;
let voiceSelect = null;
let previewVoiceBtn = null;
let startExperienceBtn = null;
let i18nSelectors = null;
let progressText = null;
let progressBarFill = null;

// Initialize application
async function initApp() {
    console.log('CyberMeteo: Initializing...');

    // Get DOM elements
    scenarioSelect = document.getElementById('scenarioSelect');
    languageSelect = document.getElementById('languageSelect');
    voiceSelect = document.getElementById('voiceSelect');
    previewVoiceBtn = document.getElementById('previewVoiceBtn');
    startExperienceBtn = document.getElementById('startExperienceBtn');
    i18nSelectors = document.getElementById('i18nSelectors');
    progressText = document.getElementById('progressText');
    progressBarFill = document.getElementById('progressBarFill');

    // Initialize avatar controller
    avatarController = new AvatarController();
    await avatarController.init();

    // Initialize narrative controller
    narrativeController = new NarrativeController(avatarController);

    // Populate language and voice selectors
    populateLanguageSelector();
    populateVoiceSelector();

    // Setup event listeners
    setupScenarioListener();
    setupI18nEventListeners();

    // Show language/voice selection
    updateProgress('Choisissez votre langue et voix...', 100);
    if (i18nSelectors) {
        i18nSelectors.style.display = 'block';
    }

    console.log('CyberMeteo: Ready for configuration');
}

// Setup scenario selector listener
function setupScenarioListener() {
    if (scenarioSelect) {
        scenarioSelect.addEventListener('change', (e) => {
            CURRENT_SCENARIO = e.target.value;
            console.log('Scenario changed to:', CURRENT_SCENARIO);
        });
    }
}

// Populate language dropdown
function populateLanguageSelector() {
    if (!languageSelect) return;

    languageSelect.innerHTML = '';
    SUPPORTED_LANGUAGES.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = `${lang.flag} ${lang.name}`;
        if (lang.code === I18N_STATE.currentLanguage) {
            option.selected = true;
        }
        languageSelect.appendChild(option);
    });
}

// Populate voice dropdown with voices for current language
function populateVoiceSelector() {
    if (!voiceSelect) return;

    const voices = getVoicesForLanguage(I18N_STATE.currentLanguage);
    voiceSelect.innerHTML = '';
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = voice.id;
        option.textContent = `${voice.name} (${voice.gender === 'male' ? '♂' : '♀'}) - ${voice.description}`;
        if (voice.id === I18N_STATE.currentVoice || index === 0) {
            option.selected = true;
        }
        voiceSelect.appendChild(option);
    });
    
    // Update current voice to first voice of new language if current voice not in list
    const currentVoiceInList = voices.find(v => v.id === I18N_STATE.currentVoice);
    if (!currentVoiceInList && voices.length > 0) {
        I18N_STATE.currentVoice = voices[0].id;
    }
}

// Setup i18n event listeners
function setupI18nEventListeners() {
    // Language change - also update voice selector
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            I18N_STATE.currentLanguage = e.target.value;
            console.log('Language changed to:', e.target.value);
            // Refresh voice selector with voices for new language
            populateVoiceSelector();
        });
    }

    // Voice change
    if (voiceSelect) {
        voiceSelect.addEventListener('change', (e) => {
            I18N_STATE.currentVoice = e.target.value;
            console.log('Voice changed to:', e.target.value);
        });
    }

    // Preview voice
    if (previewVoiceBtn) {
        previewVoiceBtn.addEventListener('click', async () => {
            await previewVoice();
        });
    }

    // Start experience
    if (startExperienceBtn) {
        startExperienceBtn.addEventListener('click', async () => {
            await startExperience();
        });
    }
}

// Preview selected voice
async function previewVoice() {
    if (!previewVoiceBtn) return;

    previewVoiceBtn.disabled = true;
    previewVoiceBtn.textContent = '...';

    try {
        // Create AudioContext if needed
        if (!globalAudioContext) {
            globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (globalAudioContext.state === 'suspended') {
            await globalAudioContext.resume();
        }

        // Get preview text based on selected language
        const previewTexts = {
            fr: "Bonjour, je suis votre assistant CyberMeteo.",
            en: "Hello, I am your CyberMeteo assistant.",
            ja: "こんにちは、私はあなたのCyberMeteoアシスタントです。",
            zh: "你好，我是你的CyberMeteo助手。",
            de: "Hallo, ich bin Ihr CyberMeteo-Assistent.",
            es: "Hola, soy su asistente CyberMeteo.",
            it: "Ciao, sono il tuo assistente CyberMeteo.",
            pt: "Olá, sou seu assistente CyberMeteo.",
            ko: "안녕하세요, 저는 당신의 CyberMeteo 어시스턴트입니다.",
            ar: "مرحبًا، أنا مساعدك CyberMeteo.",
            ru: "Здравствуйте, я ваш ассистент CyberMeteo.",
            hi: "नमस्ते, मैं आपका CyberMeteo सहायक हूं।",
            id: "Halo, saya asisten CyberMeteo Anda.",
            nl: "Hallo, ik ben uw CyberMeteo-assistent.",
            tr: "Merhaba, ben CyberMeteo asistanınızım.",
            fil: "Kumusta, ako ang iyong CyberMeteo assistant.",
            pl: "Cześć, jestem Twoim asystentem CyberMeteo.",
            sv: "Hej, jag är din CyberMeteo-assistent.",
            bg: "Здравейте, аз съм вашият CyberMeteo асистент.",
            ro: "Bună, sunt asistentul tău CyberMeteo.",
            cs: "Dobrý den, jsem váš asistent CyberMeteo.",
            el: "Γεια σας, είμαι ο βοηθός σας CyberMeteo.",
            fi: "Hei, olen CyberMeteo-avustajasi.",
            hr: "Pozdrav, ja sam vaš CyberMeteo asistent.",
            ms: "Hai, saya pembantu CyberMeteo anda.",
            sk: "Dobrý deň, som váš asistent CyberMeteo.",
            da: "Hej, jeg er din CyberMeteo-assistent.",
            ta: "வணக்கம், நான் உங்கள் CyberMeteo உதவியாளர்.",
            uk: "Привіт, я ваш асистент CyberMeteo."
        };
        const text = previewTexts[I18N_STATE.currentLanguage] || previewTexts.en;

        // Get model for selected voice
        const voices = getVoicesForLanguage(I18N_STATE.currentLanguage);
        const selectedVoice = voices.find(v => v.id === I18N_STATE.currentVoice);
        const modelId = selectedVoice?.model || 'eleven_multilingual_v2';

        // Generate preview audio
        const response = await fetch(`${API_CONFIG.endpoint}/api/elevenlabs/speech`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                voiceId: I18N_STATE.currentVoice,
                modelId,
                outputFormat: 'mp3_44100_128'
            })
        });

        if (!response.ok) throw new Error('Preview failed');

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();

        audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            previewVoiceBtn.textContent = '▶';
            previewVoiceBtn.disabled = false;
        };

    } catch (error) {
        console.error('Voice preview error:', error);
        previewVoiceBtn.textContent = '▶';
        previewVoiceBtn.disabled = false;
    }
}

// Start the experience
async function startExperience() {
    if (!startExperienceBtn) return;

    startExperienceBtn.disabled = true;
    startExperienceBtn.textContent = 'Chargement...';

    // Apply selected scenario
    if (scenarioSelect) {
        CURRENT_SCENARIO = scenarioSelect.value;
    }
    console.log('Starting with scenario:', CURRENT_SCENARIO);

    // Create AudioContext
    if (!globalAudioContext) {
        globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (globalAudioContext.state === 'suspended') {
        await globalAudioContext.resume();
    }

    // Hide selectors
    if (i18nSelectors) {
        i18nSelectors.style.display = 'none';
    }

    try {
        // Step 1: Translate content if not French
        if (I18N_STATE.currentLanguage !== 'fr') {
            updateProgress('Traduction en cours...', 0);

            const translations = await translationService.translateAll(
                I18N_STATE.currentLanguage,
                (type, progress) => {
                    if (type === 'ui') {
                        updateProgress(`Traduction interface... ${progress}%`, progress * 0.3);
                    } else {
                        updateProgress(`Traduction narratif... ${progress}%`, 30 + progress * 0.3);
                    }
                }
            );

            I18N_STATE.translatedNarrative = translations.narrative;
            I18N_STATE.translatedUI = translations.ui;

            // Update static labels in the DOM
            updateStaticLabels();

            // Reinitialize radar chart with translated labels
            if (typeof initRadarChart === 'function') {
                initRadarChart();
            }
        }

        // Step 2: Clear old audio cache and generate new audio
        await audioCache.clearCurrentLanguageCache();
        audioCache.setLanguageAndVoice(I18N_STATE.currentLanguage, I18N_STATE.currentVoice);

        updateProgress('Génération des voix...', 60);

        await new Promise((resolve) => {
            audioCache.preloadAll((loaded, total) => {
                const audioProgress = (loaded / total) * 30;
                updateProgress(`Génération audio ${loaded}/${total}...`, 60 + audioProgress);
                if (loaded >= total) {
                    resolve();
                }
            });
        });

        // Step 3: Pre-calculate animation timelines for instant playback
        updateProgress('Calcul des animations...', 90);

        await audioCache.preloadAllTimelines((calculated, total) => {
            const timelineProgress = (calculated / total) * 10;
            updateProgress(`Synchronisation ${calculated}/${total}...`, 90 + timelineProgress);
        });

        updateProgress('Prêt !', 100);

        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }

            // Ensure avatar has the global AudioContext
            if (avatarController) {
                avatarController.audioContext = globalAudioContext;
            }

            // Mark as interacted and start (builds slide map + configures visibility)
            narrativeController.userHasInteracted = true;
            console.log('Starting slide 0, avatar framesLoaded:', avatarController?.framesLoaded);
            narrativeController.start();
        }, 500);

    } catch (error) {
        console.error('Start experience error:', error);
        updateProgress('Erreur: ' + error.message, 0);
        startExperienceBtn.disabled = false;
        startExperienceBtn.textContent = 'Réessayer';
        if (i18nSelectors) {
            i18nSelectors.style.display = 'block';
        }
    }
}

// Update progress display
function updateProgress(text, percent) {
    if (progressText) {
        progressText.textContent = text;
    }
    if (progressBarFill) {
        progressBarFill.style.width = `${percent}%`;
    }
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
