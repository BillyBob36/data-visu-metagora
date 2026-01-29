/* ============================================
   CYBERMETEO - AUDIO CACHE MANAGER
   Pre-generates and caches all narrative audio
   Uses ElevenLabs for speech synthesis
   Now also pre-calculates animation timelines
   ============================================ */

class AudioCacheManager {
    constructor() {
        this.cache = new Map();           // Audio blobs
        this.timelineCache = new Map();   // Pre-calculated animation timelines
        this.loadingPromises = new Map();
        this.isPreloading = false;
        this.preloadComplete = false;
        this.onProgressCallback = null;
        this.currentLanguage = 'fr';
        this.currentVoiceId = null;

        // Animation constants (must match AvatarController)
        this.FPS = AVATAR_CONFIG.fps;
        this.FRAME_COUNT = AVATAR_CONFIG.frameCount;
        this.minSilenceDuration = AVATAR_CONFIG.minSilenceDuration;
    }

    // Generate cache key for a text (includes language and voice)
    getCacheKey(index) {
        const lang = I18N_STATE?.currentLanguage || 'fr';
        const voice = I18N_STATE?.currentVoice || 'default';
        return `${API_CONFIG.cacheKey}_${API_CONFIG.cacheVersion}_${lang}_${voice}_${index}`;
    }

    // Set current language and voice
    setLanguageAndVoice(langCode, voiceId) {
        const languageChanged = this.currentLanguage !== langCode;
        const voiceChanged = this.currentVoiceId !== voiceId;

        if (languageChanged || voiceChanged) {
            this.currentLanguage = langCode;
            this.currentVoiceId = voiceId;
            // Reset preload state when language/voice changes
            this.preloadComplete = false;
            this.isPreloading = false;
            // CRITICAL: Clear timeline cache - must recalculate for new audio
            this.timelineCache.clear();
            console.log('AudioCache: Language/voice changed, timeline cache cleared');
        }
    }

    // Check if audio is in IndexedDB
    async getFromIndexedDB(key) {
        return new Promise((resolve) => {
            const request = indexedDB.open('CyberMeteoAudio', 1);

            request.onerror = () => resolve(null);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('audio')) {
                    db.createObjectStore('audio', { keyPath: 'key' });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                try {
                    const transaction = db.transaction(['audio'], 'readonly');
                    const store = transaction.objectStore('audio');
                    const getRequest = store.get(key);

                    getRequest.onsuccess = () => {
                        if (getRequest.result) {
                            resolve(getRequest.result.blob);
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

    // Save audio to IndexedDB
    async saveToIndexedDB(key, blob) {
        return new Promise((resolve) => {
            const request = indexedDB.open('CyberMeteoAudio', 1);

            request.onerror = () => resolve(false);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('audio')) {
                    db.createObjectStore('audio', { keyPath: 'key' });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                try {
                    const transaction = db.transaction(['audio'], 'readwrite');
                    const store = transaction.objectStore('audio');
                    store.put({ key, blob, timestamp: Date.now() });
                    transaction.oncomplete = () => resolve(true);
                    transaction.onerror = () => resolve(false);
                } catch (e) {
                    resolve(false);
                }
            };
        });
    }

    // Get the best model for the current voice
    getModelForVoice(voiceId) {
        const langCode = I18N_STATE?.currentLanguage || 'fr';
        const voices = getVoicesForLanguage(langCode);
        const voice = voices.find(v => v.id === voiceId);
        
        // If voice has explicit model, use it
        if (voice && voice.model) {
            return voice.model;
        }
        
        // Default to multilingual_v2 for non-v3 voices
        return 'eleven_multilingual_v2';
    }

    // Generate speech from ElevenLabs API (via backend proxy)
    async generateSpeech(text) {
        const langCode = I18N_STATE?.currentLanguage || 'fr';
        const voiceId = I18N_STATE?.currentVoice || getVoicesForLanguage(langCode)[0].id;
        const modelId = this.getModelForVoice(voiceId);
        
        console.log(`AudioCache: Generating speech with model ${modelId} for voice ${voiceId} in language ${langCode}`);
        
        const response = await fetch(`${API_CONFIG.endpoint}/api/elevenlabs/speech`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                voiceId,
                modelId,
                outputFormat: 'mp3_44100_128'
            })
        });

        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        return await response.blob();
    }

    // Get audio for a specific narrative index
    async getAudio(index) {
        const cacheKey = this.getCacheKey(index);

        // Check memory cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Check if already loading
        if (this.loadingPromises.has(cacheKey)) {
            return await this.loadingPromises.get(cacheKey);
        }

        // Check IndexedDB
        const cachedBlob = await this.getFromIndexedDB(cacheKey);
        if (cachedBlob) {
            this.cache.set(cacheKey, cachedBlob);
            return cachedBlob;
        }

        // Generate new audio
        const loadPromise = this.loadAudioForIndex(index);
        this.loadingPromises.set(cacheKey, loadPromise);

        try {
            const blob = await loadPromise;
            this.loadingPromises.delete(cacheKey);
            return blob;
        } catch (error) {
            this.loadingPromises.delete(cacheKey);
            throw error;
        }
    }

    // Load audio for a specific index
    async loadAudioForIndex(index) {
        const cacheKey = this.getCacheKey(index);
        // Use translated narrative if available
        const narrative = getCurrentNarrative();
        const speechText = narrative[index].speechText;

        try {
            const blob = await this.generateSpeech(speechText);

            // Save to memory cache
            this.cache.set(cacheKey, blob);

            // Save to IndexedDB for persistence
            await this.saveToIndexedDB(cacheKey, blob);

            return blob;
        } catch (error) {
            console.error(`Failed to generate audio for slide ${index}:`, error);
            throw error;
        }
    }

    // Preload all narrative audio
    async preloadAll(onProgress) {
        if (this.isPreloading || this.preloadComplete) return;

        this.isPreloading = true;
        this.onProgressCallback = onProgress;

        const narrative = getCurrentNarrative();
        const total = narrative.length;
        let loaded = 0;

        // Load all audio in parallel but with concurrency limit
        const concurrency = 2;
        const queue = [...Array(total).keys()];

        const worker = async () => {
            while (queue.length > 0) {
                const index = queue.shift();
                if (index === undefined) break;

                try {
                    await this.getAudio(index);
                    loaded++;
                    if (this.onProgressCallback) {
                        this.onProgressCallback(loaded, total);
                    }
                } catch (error) {
                    console.error(`Failed to preload audio ${index}:`, error);
                    loaded++;
                    if (this.onProgressCallback) {
                        this.onProgressCallback(loaded, total);
                    }
                }
            }
        };

        // Start workers
        const workers = [];
        for (let i = 0; i < concurrency; i++) {
            workers.push(worker());
        }

        await Promise.all(workers);

        this.isPreloading = false;
        this.preloadComplete = true;
    }

    // Check if audio is ready for a specific slide
    isAudioReady(index) {
        const cacheKey = this.getCacheKey(index);
        return this.cache.has(cacheKey);
    }

    // Clear all cached audio
    async clearCache() {
        this.cache.clear();
        this.preloadComplete = false;
        this.isPreloading = false;

        return new Promise((resolve) => {
            const request = indexedDB.open('CyberMeteoAudio', 1);
            request.onsuccess = (event) => {
                const db = event.target.result;
                try {
                    const transaction = db.transaction(['audio'], 'readwrite');
                    const store = transaction.objectStore('audio');
                    store.clear();
                    transaction.oncomplete = () => resolve(true);
                } catch (e) {
                    resolve(false);
                }
            };
            request.onerror = () => resolve(false);
        });
    }

    // Clear cache for current language only and reset state
    async clearCurrentLanguageCache() {
        // Clear memory cache
        this.cache.clear();
        // Clear timeline cache
        this.timelineCache.clear();
        this.preloadComplete = false;
        this.isPreloading = false;

        // Clear IndexedDB
        await this.clearCache();
    }

    // ============================================
    // TIMELINE PRE-CALCULATION
    // ============================================

    // Get timeline cache key
    getTimelineCacheKey(index) {
        const lang = I18N_STATE?.currentLanguage || 'fr';
        const voice = I18N_STATE?.currentVoice || 'default';
        return `timeline_${lang}_${voice}_${index}`;
    }

    // Get pre-calculated timeline for a slide
    getTimeline(index) {
        const key = this.getTimelineCacheKey(index);
        return this.timelineCache.get(key) || null;
    }

    // Calculate timeline for an audio blob
    async calculateTimeline(audioBlob) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const silenceSegments = this.detectSilenceSegments(audioBuffer);
        const timeline = this.buildAnimationTimeline(audioBuffer.duration, silenceSegments);

        // Close context - we only needed it for decoding
        audioContext.close();

        return {
            timeline: timeline,
            duration: audioBuffer.duration,
            lastSoundTime: this._lastSoundTime
        };
    }

    // Detect silence segments in audio buffer (same logic as AvatarController)
    detectSilenceSegments(audioBuffer) {
        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;
        const segments = [];

        const windowSize = Math.floor(sampleRate * 0.05); // 50ms window
        const silenceThreshold = 0.02;
        const minSilenceDuration = this.minSilenceDuration;

        let silenceStart = null;
        let lastSoundTime = 0;

        for (let i = 0; i < channelData.length; i += windowSize) {
            let sum = 0;
            const end = Math.min(i + windowSize, channelData.length);

            for (let j = i; j < end; j++) {
                sum += Math.abs(channelData[j]);
            }

            const average = sum / (end - i);
            const currentTime = i / sampleRate;

            if (average < silenceThreshold) {
                if (silenceStart === null) silenceStart = currentTime;
            } else {
                lastSoundTime = currentTime + (windowSize / sampleRate);
                if (silenceStart !== null) {
                    const silenceDuration = currentTime - silenceStart;
                    if (silenceDuration >= minSilenceDuration) {
                        segments.push({ start: silenceStart, end: currentTime });
                    }
                    silenceStart = null;
                }
            }
        }

        // Handle trailing silence
        if (silenceStart !== null) {
            const audioDuration = channelData.length / sampleRate;
            const silenceDuration = audioDuration - silenceStart;
            if (silenceDuration >= minSilenceDuration) {
                segments.push({ start: silenceStart, end: audioDuration });
            }
        }

        this._lastSoundTime = lastSoundTime;
        return segments;
    }

    // Build animation timeline (same logic as AvatarController)
    buildAnimationTimeline(audioDuration, silenceSegments) {
        const timeline = [];
        let currentTime = 0;

        const effectiveEndTime = this._lastSoundTime || audioDuration;

        for (const silence of silenceSegments) {
            if (silence.start > currentTime) {
                timeline.push(this.createSegment('speak', currentTime, silence.start));
            }
            timeline.push(this.createSegment('idle', silence.start, silence.end));
            currentTime = silence.end;
        }

        if (currentTime < effectiveEndTime) {
            timeline.push(this.createSegment('speak', currentTime, effectiveEndTime));
        }

        return timeline;
    }

    // Create a timeline segment (same logic as AvatarController)
    createSegment(mode, startTime, endTime) {
        const duration = endTime - startTime;
        const totalFramesAvailable = duration * this.FPS;

        const fullAccordionFrames = this.FRAME_COUNT * 2;
        const fullCycles = Math.floor(totalFramesAvailable / fullAccordionFrames);

        let totalCycles;
        if (fullCycles === 0) {
            totalCycles = 1;
        } else {
            const remainingFrames = totalFramesAvailable - (fullCycles * fullAccordionFrames);
            totalCycles = (remainingFrames >= this.FPS) ? fullCycles + 1 : fullCycles;
            if (totalCycles === 0) totalCycles = 1;
        }

        const framesPerCycle = totalFramesAvailable / totalCycles;
        let maxFrame = framesPerCycle / 2;

        maxFrame = Math.min(maxFrame, this.FRAME_COUNT - 1);
        maxFrame = Math.max(maxFrame, 1);

        return {
            mode: mode,
            startTime: startTime,
            endTime: endTime,
            duration: duration,
            maxFrame: maxFrame,
            totalCycles: totalCycles,
            framesPerCycle: framesPerCycle
        };
    }

    // Pre-calculate all timelines after audio is loaded
    async preloadAllTimelines(onProgress) {
        const narrative = getCurrentNarrative();
        const total = narrative.length;
        let calculated = 0;

        console.log('AudioCache: Starting timeline pre-calculation for', total, 'slides');

        for (let i = 0; i < total; i++) {
            const timelineKey = this.getTimelineCacheKey(i);

            // Skip if already calculated
            if (this.timelineCache.has(timelineKey)) {
                calculated++;
                if (onProgress) onProgress(calculated, total);
                continue;
            }

            // Get the audio blob - use getAudio to ensure it's loaded from IndexedDB if needed
            let audioBlob;
            try {
                audioBlob = await this.getAudio(i);
            } catch (error) {
                console.warn('AudioCache: Could not get audio for slide', i, error);
                calculated++;
                if (onProgress) onProgress(calculated, total);
                continue;
            }

            if (!audioBlob) {
                console.warn('AudioCache: No audio blob for slide', i);
                calculated++;
                if (onProgress) onProgress(calculated, total);
                continue;
            }

            try {
                const timelineData = await this.calculateTimeline(audioBlob);
                this.timelineCache.set(timelineKey, timelineData);
                console.log('AudioCache: Timeline calculated for slide', i, '- duration:', timelineData.duration.toFixed(2) + 's');
            } catch (error) {
                console.error('AudioCache: Failed to calculate timeline for slide', i, error);
            }

            calculated++;
            if (onProgress) onProgress(calculated, total);
        }

        console.log('AudioCache: All timelines pre-calculated');
    }
}

// Global instance
const audioCache = new AudioCacheManager();
