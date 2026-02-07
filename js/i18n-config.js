/* ============================================
   CYBERMETEO - INTERNATIONALIZATION CONFIG
   Languages, voices, and UI translations
   ============================================ */

// ElevenLabs Multilingual v2 supported languages (29 languages)
const SUPPORTED_LANGUAGES = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', elevenCode: 'fr' },
    { code: 'en', name: 'English', flag: '🇬🇧', elevenCode: 'en' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', elevenCode: 'ja' },
    { code: 'zh', name: '中文', flag: '🇨🇳', elevenCode: 'zh' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', elevenCode: 'de' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', elevenCode: 'hi' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', elevenCode: 'ko' },
    { code: 'pt', name: 'Português', flag: '🇧🇷', elevenCode: 'pt' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', elevenCode: 'it' },
    { code: 'es', name: 'Español', flag: '🇪🇸', elevenCode: 'es' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', elevenCode: 'id' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱', elevenCode: 'nl' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', elevenCode: 'tr' },
    { code: 'fil', name: 'Filipino', flag: '🇵🇭', elevenCode: 'fil' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱', elevenCode: 'pl' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪', elevenCode: 'sv' },
    { code: 'bg', name: 'Български', flag: '🇧🇬', elevenCode: 'bg' },
    { code: 'ro', name: 'Română', flag: '🇷🇴', elevenCode: 'ro' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', elevenCode: 'ar' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿', elevenCode: 'cs' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷', elevenCode: 'el' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮', elevenCode: 'fi' },
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷', elevenCode: 'hr' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', elevenCode: 'ms' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', elevenCode: 'sk' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰', elevenCode: 'da' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', elevenCode: 'ta' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦', elevenCode: 'uk' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', elevenCode: 'ru' }
];

// ElevenLabs voices organized by language with native speakers
// Top 4 voices are eleven_v3 model (2 women, 2 men), followed by multilingual_v2 voices
const VOICES_BY_LANGUAGE = {
    // French - Native French voices
    fr: [
        // Lucie - Native French voice (Elevenlabs Voice Library)
        { id: 'YxrwjAKoUKULGd0g8K9Y', name: 'Lucie', gender: 'female', description: 'Française native, claire', model: 'eleven_multilingual_v2' },
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: 'Expressive, naturelle', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: 'Fluide, calme', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: 'Confiant, professionnel', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'Amical, engageant', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', gender: 'female', description: 'Douce, narrative' },
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: 'Chaleureuse, professionnelle' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: 'Casual, conversationnel' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Profond, narratif' }
    ],
    // English - Native English voices (best rated)
    en: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: 'Expressive, natural', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: 'Smooth, calm', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: 'Confident, professional', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'Friendly, engaging', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', gender: 'male', description: 'Warm, narrative' },
        { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female', description: 'Calm, professional' },
        { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', gender: 'male', description: 'Deep, British' },
        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', gender: 'female', description: 'Soft, young' }
    ],
    // Japanese - Native Japanese voices
    ja: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: '表現力豊か、自然', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: '滑らか、落ち着いた', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: '自信のある、プロ', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'フレンドリー', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', gender: 'female', description: '柔らかい、若い' },
        { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'female', description: '表現力豊か' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: 'カジュアル' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'ナレーション向け' }
    ],
    // Chinese - Voices optimized for Chinese
    zh: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: '富有表现力、自然', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: '流畅、平静', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: '自信、专业', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: '友好、吸引人', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: '温暖、专业' },
        { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'female', description: '表达力强' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: '随意、对话式' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: '深沉、叙述' }
    ],
    // German - Native German voices
    de: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: 'Ausdrucksstark, natürlich', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: 'Fließend, ruhig', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: 'Selbstbewusst, professionell', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'Freundlich, einnehmend', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', gender: 'female', description: 'Sanft, erzählend' },
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: 'Warm, professionell' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: 'Lässig, gesprächig' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Tief, narrativ' }
    ],
    // Spanish - Native Spanish voices
    es: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: 'Expresiva, natural', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: 'Fluida, tranquila', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: 'Seguro, profesional', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'Amigable, atractivo', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', gender: 'female', description: 'Suave, narrativa' },
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: 'Cálida, profesional' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: 'Casual, conversacional' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Profundo, narrativo' }
    ],
    // Italian - Native Italian voices
    it: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: 'Espressiva, naturale', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: 'Fluida, calma', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: 'Sicuro, professionale', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'Amichevole, coinvolgente', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', gender: 'female', description: 'Dolce, narrativa' },
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: 'Calda, professionale' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: 'Casual, conversazionale' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Profondo, narrativo' }
    ],
    // Portuguese - Native Portuguese voices
    pt: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: 'Expressiva, natural', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: 'Fluida, calma', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: 'Confiante, profissional', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'Amigável, envolvente', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', gender: 'female', description: 'Suave, narrativa' },
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: 'Calorosa, profissional' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: 'Casual, conversacional' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Profundo, narrativo' }
    ],
    // Korean - Voices optimized for Korean
    ko: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: '표현력 있는, 자연스러운', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: '부드러운, 차분한', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: '자신감 있는, 전문적인', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: '친근한, 매력적인', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: '따뜻한, 전문적인' },
        { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'female', description: '표현력 있는' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: '캐주얼한' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: '내레이션용' }
    ],
    // Hindi - Voices optimized for Hindi
    hi: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: 'अभिव्यंजक, प्राकृतिक', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: 'सहज, शांत', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: 'आत्मविश्वासी, पेशेवर', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'मिलनसार, आकर्षक', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: 'गर्म, पेशेवर' },
        { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'female', description: 'अभिव्यंजक' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: 'आकस्मिक' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'कथावाचक' }
    ],
    // Arabic - Voices optimized for Arabic
    ar: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: 'معبرة، طبيعية', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: 'سلسة، هادئة', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: 'واثق، محترف', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'ودود، جذاب', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: 'دافئ، محترف' },
        { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'female', description: 'معبر' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: 'غير رسمي' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'سردي' }
    ],
    // Russian - Voices optimized for Russian
    ru: [
        // eleven_v3 voices (top quality)
        { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: 'Выразительный, естественный', model: 'eleven_v3' },
        { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: 'Плавный, спокойный', model: 'eleven_v3' },
        { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: 'Уверенный, профессиональный', model: 'eleven_v3' },
        { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'Дружелюбный, привлекательный', model: 'eleven_v3' },
        // multilingual_v2 voices
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: 'Тёплый, профессиональный' },
        { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'female', description: 'Выразительный' },
        { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: 'Непринуждённый' },
        { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Повествовательный' }
    ]
};

// Default voices for languages not specifically configured (includes v3 voices)
const DEFAULT_VOICES = [
    // eleven_v3 voices (top quality)
    { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria [v3]', gender: 'female', description: 'Expressive, natural', model: 'eleven_v3' },
    { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River [v3]', gender: 'female', description: 'Smooth, calm', model: 'eleven_v3' },
    { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger [v3]', gender: 'male', description: 'Confident, professional', model: 'eleven_v3' },
    { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric [v3]', gender: 'male', description: 'Friendly, engaging', model: 'eleven_v3' },
    // multilingual_v2 voices
    { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', description: 'Warm, professional' },
    { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'female', description: 'Expressive' },
    { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'male', description: 'Casual' },
    { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', description: 'Narrative' }
];

// Get voices for a specific language
function getVoicesForLanguage(langCode) {
    return VOICES_BY_LANGUAGE[langCode] || DEFAULT_VOICES;
}

// Legacy compatibility - returns voices for current language
const ELEVENLABS_VOICES = DEFAULT_VOICES;

// UI Translations (base French, others generated via API)
const UI_TRANSLATIONS = {
    fr: {
        loading: 'Chargement...',
        selectLanguage: 'Choisir la langue',
        selectVoice: 'Choisir la voix',
        start: 'Démarrer l\'expérience',
        generating: 'Génération des traductions...',
        generatingAudio: 'Génération des voix...',
        clickToContinue: 'Cliquez pour continuer...',
        downloadReport: 'Télécharger le rapport d\'audit',
        learnMore: 'En savoir plus sur SecurityScorecard',
        talkToExpert: 'Discuter avec un expert',
        previewVoice: 'Aperçu',
        male: 'Homme',
        female: 'Femme',
        audioProgress: 'Chargement audio',
        translationProgress: 'Traduction en cours',
        ready: 'Prêt !',
        error: 'Erreur',
        retry: 'Réessayer',
        // Indicator labels
        indEndpoint: 'Endpoint',
        indIpRep: 'IP Rep',
        indCubit: 'Cubit',
        indHacker: 'Hacker',
        indInfoLeak: 'Info Leak',
        indSocialEng: 'Social Eng',
        indPatching: 'Patching',
        indDns: 'DNS',
        indAppSec: 'App Sec',
        indNetwork: 'Network',
        // Vulnerability labels
        vulnOpenPorts: 'Ports ouverts',
        vulnSiteVulns: 'Vulnérabilités',
        vulnMalware: 'Malware',
        vulnLeakedInfo: 'Fuites info',
        // Radar chart labels
        radarNetwork: 'Réseau',
        radarIpRep: 'IP Rep',
        radarCubit: 'Cubit',
        radarHacker: 'Hacker',
        radarInfoLeak: 'Fuite info',
        radarSocial: 'Social',
        radarPatching: 'Patching',
        radarDns: 'DNS',
        radarAppSec: 'App Sec',
        industryAverage: 'Moyenne industrie'
    }
};

// Current app state
const I18N_STATE = {
    currentLanguage: 'fr',
    currentVoice: getVoicesForLanguage('fr')[0].id,
    translatedNarrative: null,
    translatedUI: null,
    isTranslating: false,
    isGeneratingAudio: false
};

// Get language by code
function getLanguageByCode(code) {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

// Get voice by ID (searches in current language voices first, then all)
function getVoiceById(id) {
    const langVoices = getVoicesForLanguage(I18N_STATE.currentLanguage);
    let voice = langVoices.find(v => v.id === id);
    if (!voice) {
        // Search in all languages
        for (const lang in VOICES_BY_LANGUAGE) {
            voice = VOICES_BY_LANGUAGE[lang].find(v => v.id === id);
            if (voice) break;
        }
    }
    return voice || DEFAULT_VOICES.find(v => v.id === id);
}

// Get UI text
function getUIText(key) {
    const lang = I18N_STATE.currentLanguage;
    if (I18N_STATE.translatedUI && I18N_STATE.translatedUI[key]) {
        return I18N_STATE.translatedUI[key];
    }
    if (UI_TRANSLATIONS[lang] && UI_TRANSLATIONS[lang][key]) {
        return UI_TRANSLATIONS[lang][key];
    }
    return UI_TRANSLATIONS.fr[key] || key;
}

// Get current narrative (translated or original, scenario-aware)
function getCurrentNarrative() {
    if (I18N_STATE.translatedNarrative && I18N_STATE.currentLanguage !== 'fr') {
        return I18N_STATE.translatedNarrative;
    }
    return getScenarioNarrative();
}

// Update all elements with data-i18n attribute
function updateStaticLabels() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = getUIText(key);
        if (translated && translated !== key) {
            el.textContent = translated;
        }
    });
}
