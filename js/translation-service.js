/* ============================================
   CYBERMETEO - TRANSLATION SERVICE
   Translates UI and narrative content via OpenAI
   ============================================ */

class TranslationService {
    constructor() {
        this.apiEndpoint = API_CONFIG.endpoint;
        this.cache = new Map();
    }

    // Generate cache key for translations
    getCacheKey(langCode) {
        return `translation_${langCode}_${API_CONFIG.cacheVersion}`;
    }

    // Get cached translation from IndexedDB
    async getFromCache(langCode) {
        return new Promise((resolve) => {
            const request = indexedDB.open('CyberMeteoTranslations', 1);

            request.onerror = () => resolve(null);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('translations')) {
                    db.createObjectStore('translations', { keyPath: 'key' });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                try {
                    const transaction = db.transaction(['translations'], 'readonly');
                    const store = transaction.objectStore('translations');
                    const key = this.getCacheKey(langCode);
                    const getRequest = store.get(key);

                    getRequest.onsuccess = () => {
                        if (getRequest.result) {
                            resolve(getRequest.result.data);
                        } else {
                            resolve(null);
                        }
                    };
                    getRequest.onerror = () => resolve(null);
                } catch (e) {
                    resolve(null);
                }
            };
        });
    }

    // Save translation to IndexedDB
    async saveToCache(langCode, data) {
        return new Promise((resolve) => {
            const request = indexedDB.open('CyberMeteoTranslations', 1);

            request.onerror = () => resolve(false);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('translations')) {
                    db.createObjectStore('translations', { keyPath: 'key' });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                try {
                    const transaction = db.transaction(['translations'], 'readwrite');
                    const store = transaction.objectStore('translations');
                    const key = this.getCacheKey(langCode);
                    store.put({ key, data, timestamp: Date.now() });
                    transaction.oncomplete = () => resolve(true);
                    transaction.onerror = () => resolve(false);
                } catch (e) {
                    resolve(false);
                }
            };
        });
    }

    // Clear all cached translations (when switching language)
    async clearCache() {
        return new Promise((resolve) => {
            const request = indexedDB.open('CyberMeteoTranslations', 1);
            request.onsuccess = (event) => {
                const db = event.target.result;
                try {
                    const transaction = db.transaction(['translations'], 'readwrite');
                    const store = transaction.objectStore('translations');
                    store.clear();
                    transaction.oncomplete = () => resolve(true);
                } catch (e) {
                    resolve(false);
                }
            };
            request.onerror = () => resolve(false);
        });
    }

    // Translate all content to target language
    async translateAll(targetLangCode, onProgress) {
        if (targetLangCode === 'fr') {
            // French is the source language, no translation needed
            return {
                narrative: getScenarioNarrative(),
                ui: UI_TRANSLATIONS.fr
            };
        }

        // Check cache first
        const cached = await this.getFromCache(targetLangCode);
        if (cached) {
            console.log(`Translation loaded from cache for ${targetLangCode}`);
            return cached;
        }

        const targetLang = getLanguageByCode(targetLangCode);
        if (!targetLang) {
            throw new Error(`Unsupported language: ${targetLangCode}`);
        }

        if (onProgress) onProgress('ui', 0);

        // Translate UI texts
        const translatedUI = await this.translateUI(targetLang.name);
        if (onProgress) onProgress('ui', 100);

        if (onProgress) onProgress('narrative', 0);

        // Translate narrative texts
        const translatedNarrative = await this.translateNarrative(targetLang.name, (progress) => {
            if (onProgress) onProgress('narrative', progress);
        });

        const result = {
            narrative: translatedNarrative,
            ui: translatedUI
        };

        // Save to cache
        await this.saveToCache(targetLangCode, result);

        return result;
    }

    // Translate UI strings
    async translateUI(targetLanguageName) {
        const uiStrings = UI_TRANSLATIONS.fr;
        
        const prompt = `Translate the following UI strings from French to ${targetLanguageName}. 
Return ONLY a valid JSON object with the same keys.
Keep it natural and appropriate for a professional cybersecurity report interface.

IMPORTANT: You MUST translate ALL terms, including technical/cybersecurity terms like:
- "DNS" should be translated (e.g., in Japanese: "DNS健全性" or similar)
- "Cubit" should be translated or transliterated
- "Endpoint" should be translated
- "IP Rep" (IP Reputation) should be translated
- "Hacker" should be translated
- "App Sec" (Application Security) should be translated
- "Network" should be translated
- "Patching" should be translated
- "Social Eng" (Social Engineering) should be translated
- "Info Leak" should be translated
- "SecurityScorecard" should be transliterated in the target language script

Do NOT leave any English terms - translate or transliterate everything to ${targetLanguageName}.

French strings to translate:
${JSON.stringify(uiStrings, null, 2)}

Return the translated JSON object only, no explanation.`;

        try {
            const response = await fetch(`${this.apiEndpoint}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'gpt-4o-mini'
                })
            });

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // Parse JSON from response (handle markdown code blocks)
            let jsonStr = content;
            if (content.includes('```')) {
                jsonStr = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
            }
            
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('UI translation error:', error);
            return uiStrings; // Fallback to French
        }
    }

    // Translate narrative texts
    async translateNarrative(targetLanguageName, onProgress) {
        const translatedNarrative = [];
        const narrative = getScenarioNarrative();
        const total = narrative.length;

        for (let i = 0; i < narrative.length; i++) {
            const slide = narrative[i];
            
            const prompt = `Translate the following cybersecurity report text from French to ${targetLanguageName}.
Keep the same professional tone. Preserve any HTML tags like <span class='highlight'>.
The text is for a spoken narrative, so make it sound natural when read aloud.

IMPORTANT: You MUST translate or transliterate ALL terms to ${targetLanguageName}, including:
- Technical terms like "Endpoint Security", "IP Reputation", "Cubit Score", "Hacker Chatter", "Information Leak", "Social Engineering", "Patching Cadence", "DNS Health", "Application Security", "Network Security"
- Brand names like "SecurityScorecard" should be transliterated in the target language script
- Do NOT leave any English or French terms - everything must be in ${targetLanguageName}

Return ONLY a JSON object with these exact fields:
- "text": the translated text with HTML tags preserved
- "speechText": the translated text optimized for text-to-speech (no HTML, natural pronunciation)
${slide.choices ? '- "choices": array of translated choice objects with "label" and same "action" and "url"' : ''}

French text to translate:
Text (with HTML): ${slide.text}
Speech text: ${slide.speechText}
${slide.choices ? `Choices: ${JSON.stringify(slide.choices)}` : ''}

Return ONLY the JSON object, no explanation.`;

            try {
                const response = await fetch(`${this.apiEndpoint}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ role: 'user', content: prompt }],
                        model: 'gpt-4o-mini'
                    })
                });

                if (!response.ok) {
                    throw new Error(`Translation API error: ${response.status}`);
                }

                const data = await response.json();
                const content = data.choices[0].message.content;
                
                // Parse JSON from response
                let jsonStr = content;
                if (content.includes('```')) {
                    jsonStr = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
                }
                
                const translated = JSON.parse(jsonStr);
                translatedNarrative.push({
                    text: translated.text,
                    speechText: translated.speechText,
                    choices: translated.choices || slide.choices
                });

            } catch (error) {
                console.error(`Narrative translation error for slide ${i}:`, error);
                // Fallback to original
                translatedNarrative.push(slide);
            }

            if (onProgress) {
                onProgress(Math.round(((i + 1) / total) * 100));
            }
        }

        return translatedNarrative;
    }
}

// Global instance
const translationService = new TranslationService();
