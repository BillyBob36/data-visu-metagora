/* ============================================
   CYBERMETEO - AVATAR CONTROLLER
   Exact replication of avalution2 animation system
   with smooth transitions on slide changes
   ============================================ */

class AvatarController {
    constructor() {
        this.img = document.getElementById('avatarImg');
        this.imgBack = document.getElementById('avatarImgBack');
        this.placeholder = document.getElementById('avatarPlaceholder');

        // Animation constants (from avalution2)
        this.FPS = AVATAR_CONFIG.fps;
        this.FRAME_COUNT = AVATAR_CONFIG.frameCount;
        this.FRAME_DURATION = 1000 / this.FPS;
        this.VIDEO_DURATION = 5.0;
        this.KEYFRAME_INTERVAL = 0.5;
        this.KEYFRAMES_PER_INTERVAL = 15;

        // Quality settings
        this.quality = AVATAR_CONFIG.quality;

        // Frame arrays
        this.idleFrames = [];
        this.speakFrames = [];

        // Animation state
        this.currentMode = 'idle';
        this.currentFrame = 0;
        this.playDirection = 1;
        this.isPlaying = false;
        this.animationFrameId = null;
        this.lastFrameTime = 0;

        // Half accordion mode
        this.isHalfAccordion = false;
        this.switchToHalfAccordionPending = false;

        // Audio state
        this.pendingAudio = null;
        this.preparedAudio = null;
        this.waitingForAudio = false;
        this.audioReady = false;
        this.holdingAtZero = false;

        // Waiting animation state
        this.isWaitingMode = false;
        this.waitingState = 0;
        this.returningToZero = false;

        // Timeline state
        this.timeline = [];
        this.audioDuration = 0;
        this.audioStartTime = 0;
        this.lastSoundTime = 0;
        this.currentSegmentIndex = 0;
        this.currentMaxFrame = 0;
        this.currentFramesPerCycle = 0;

        // Silence detection
        this.minSilenceDuration = AVATAR_CONFIG.minSilenceDuration;

        // Loading state
        this.framesLoaded = false;

        // Current audio source and context (for stopping)
        this.currentAudioSource = null;
        this.currentAudioContext = null;

        // Promise resolver for current speech
        this.speechResolve = null;
        this.speechReject = null;

        // Flag to indicate we're stopping (to prevent race conditions)
        this.isStopping = false;

        // Promise that resolves when stop is complete
        this.stopPromise = null;
        this.stopResolve = null;

        // Crossfade state
        this.crossfadeState = null;
    }

    async init() {
        await this.preloadFrames();

        if (this.framesLoaded) {
            if (this.placeholder) this.placeholder.style.display = 'none';
            if (this.img) this.img.style.display = 'block';
            this.showFrame(0);
            this.startAccordionLoop();
        }
    }

    async preloadFrames() {
        const loadImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = src;
            });
        };

        const basePath = AVATAR_CONFIG.framesPath;
        const promises = [];

        for (let i = 0; i < this.FRAME_COUNT; i++) {
            const frameNum = i.toString().padStart(4, '0');
            promises.push(loadImage(`${basePath}idle/${this.quality}/frame_${frameNum}.jpg`));
            promises.push(loadImage(`${basePath}speek/${this.quality}/frame_${frameNum}.jpg`));
        }

        const results = await Promise.all(promises);

        let loadedCount = 0;
        for (let i = 0; i < this.FRAME_COUNT; i++) {
            const idleFrame = results[i * 2];
            const speakFrame = results[i * 2 + 1];
            this.idleFrames.push(idleFrame);
            this.speakFrames.push(speakFrame);
            if (idleFrame) loadedCount++;
        }

        this.framesLoaded = loadedCount > 0;
        console.log(`Avatar: Loaded ${loadedCount} frames (${this.quality})`);
    }

    getFrames() {
        return this.currentMode === 'idle' ? this.idleFrames : this.speakFrames;
    }

    showFrame(frameIndex) {
        if (!this.framesLoaded) return;
        const frames = this.getFrames();
        const frame = frames[frameIndex];
        if (frame) {
            this.img.src = frame.src;
        }
        this.currentFrame = frameIndex;
    }

    // ============================================
    // ACCORDION ANIMATION (Idle loop) - From avalution2
    // ============================================
    startAccordionLoop() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.lastFrameTime = performance.now();
        this.playDirection = 1;
        this.currentFrame = 0;
        this.showFrame(0);
        this.animate();
    }

    animate() {
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;

        if (elapsed >= this.FRAME_DURATION) {
            this.lastFrameTime = now - (elapsed % this.FRAME_DURATION);

            let nextFrame = this.currentFrame + this.playDirection;

            const maxFrame = this.isHalfAccordion
                ? Math.floor(this.FRAME_COUNT / 2) - 1
                : this.FRAME_COUNT - 1;

            if (this.playDirection === 1 && nextFrame > maxFrame) {
                nextFrame = maxFrame;
                this.playDirection = -1;
            } else if (this.playDirection === -1 && nextFrame < 0) {
                nextFrame = 0;
                this.playDirection = 1;

                if (this.switchToHalfAccordionPending) {
                    this.isHalfAccordion = true;
                    this.switchToHalfAccordionPending = false;
                }
            }

            this.showFrame(nextFrame);
        }

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    // ============================================
    // RETURN TO START - Critical for smooth transitions
    // ============================================
    returnToStart(callback) {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Already at frame 0
        if (this.currentFrame <= 0) {
            this.currentFrame = 0;
            this.showFrame(0);
            if (callback) callback();
            return;
        }

        this.playDirection = -1;
        this.isPlaying = true;
        this.lastFrameTime = performance.now();

        const animateReturn = () => {
            const now = performance.now();
            const elapsed = now - this.lastFrameTime;

            if (elapsed >= this.FRAME_DURATION) {
                this.lastFrameTime = now;

                let nextFrame = this.currentFrame - 1;

                if (nextFrame <= 0) {
                    this.currentFrame = 0;
                    this.showFrame(0);
                    this.isPlaying = false;
                    if (callback) callback();
                    return;
                }

                this.currentFrame = nextFrame;
                this.showFrame(nextFrame);
            }

            this.animationFrameId = requestAnimationFrame(animateReturn);
        };

        animateReturn();
    }

    // ============================================
    // MODE SWITCHING - Always returns to frame 0 first
    // ============================================
    switchToMode(mode, callback) {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.returnToStart(() => {
            this.currentMode = mode;
            this.currentFrame = 0;
            this.playDirection = 1;
            this.showFrame(0);
            if (callback) callback();
        });
    }

    startSpeakMode() {
        if (this.currentMode === 'speak') return;
        this.switchToMode('speak', () => this.startAccordionLoop());
    }

    startIdleMode() {
        if (this.currentMode === 'idle') return;
        this.isHalfAccordion = false;
        this.switchToMode('idle', () => this.startAccordionLoop());
    }

    enableHalfAccordion() {
        this.switchToHalfAccordionPending = true;
    }

    // ============================================
    // WAITING ANIMATION - From avalution2
    // ============================================
    startWaitingAnimation() {
        this.isWaitingMode = true;
        this.waitingState = 0;
        this.playDirection = 1;
        this.currentFrame = 0;
        this.isPlaying = true;
        this.lastFrameTime = performance.now();
        this.animateWaiting();
    }

    animateWaiting() {
        // Check if audio is ready and we should start returning to zero
        if (this.audioReady && !this.returningToZero) {
            this.startReturnToZero();
            return;
        }

        const now = performance.now();
        const elapsed = now - this.lastFrameTime;

        if (elapsed >= this.FRAME_DURATION) {
            this.lastFrameTime = now - (elapsed % this.FRAME_DURATION);

            let nextFrame = this.currentFrame + this.playDirection;

            // Waiting animation states:
            // 0: Going from 0 to 10
            // 1: Looping between 10 and 139
            // 2: Returning from 139 to 10
            if (this.waitingState === 0) {
                if (nextFrame >= 10) {
                    nextFrame = 10;
                    this.waitingState = 1;
                }
            } else if (this.waitingState === 1) {
                if (nextFrame >= 139) {
                    nextFrame = 139;
                    this.playDirection = -1;
                    this.waitingState = 2;
                }
            } else if (this.waitingState === 2) {
                if (nextFrame <= 10) {
                    nextFrame = 10;
                    this.playDirection = 1;
                    this.waitingState = 1;
                }
            }

            this.currentFrame = nextFrame;
            this.showFrame(nextFrame);
        }

        this.animationFrameId = requestAnimationFrame(() => this.animateWaiting());
    }

    startReturnToZero() {
        this.returningToZero = true;

        // Ensure we're going backwards
        if (this.playDirection === 1) {
            this.playDirection = -1;
        }

        this.animateReturnToZero();
    }

    animateReturnToZero() {
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;

        if (elapsed >= this.FRAME_DURATION) {
            this.lastFrameTime = now - (elapsed % this.FRAME_DURATION);

            let nextFrame = this.currentFrame + this.playDirection;

            if (nextFrame <= 0) {
                this.currentFrame = 0;
                this.showFrame(0);
                this.isWaitingMode = false;
                this.returningToZero = false;
                this.waitingState = 0;
                this.playDirection = 1;
                this.tryStartAudio();
                return;
            }

            this.currentFrame = nextFrame;
            this.showFrame(nextFrame);
        }

        this.animationFrameId = requestAnimationFrame(() => this.animateReturnToZero());
    }

    // ============================================
    // AUDIO HANDLING - From avalution2
    // ============================================
    tryStartAudio() {
        if (!this.waitingForAudio || !this.audioReady) return;
        if (this.currentFrame !== 0) return;

        this.waitingForAudio = false;
        this.holdingAtZero = false;
        this.playPendingAudio();
    }

    // Main entry point: Speak with pre-cached audio blob and pre-calculated timeline
    // slideIndex is used to retrieve the pre-calculated timeline
    async speakWithAudio(audioBlob, slideIndex = -1) {
        if (!this.framesLoaded) {
            return;
        }

        // If we're currently stopping, wait for it to complete first
        if (this.isStopping && this.stopPromise) {
            await this.stopPromise;
        }

        // Stop any current accordion loop
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.isPlaying = false;

        return new Promise((resolve, reject) => {
            this.speechResolve = resolve;
            this.speechReject = reject;

            // Reset all state
            this.waitingForAudio = true;
            this.audioReady = false;
            this.holdingAtZero = false;
            this.preparedAudio = null;
            this.timeline = [];

            // If already at frame 0, skip the return animation
            if (this.currentFrame === 0) {
                this.holdingAtZero = true;
                // Prepare audio immediately
                this.prepareAudioWithTimeline(audioBlob, slideIndex);
            } else {
                // Return to frame 0 first, then try to start audio
                this.returnToStart(() => {
                    this.holdingAtZero = true;
                    if (this.audioReady) {
                        this.tryStartAudio();
                    }
                });

                // Prepare audio in parallel - use pre-calculated timeline if available
                this.prepareAudioWithTimeline(audioBlob, slideIndex);
            }
        });
    }

    // Prepare audio using pre-calculated timeline when available
    async prepareAudioWithTimeline(audioBlob, slideIndex) {
        try {
            // Create AudioContext for playback
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Try to get pre-calculated timeline
            let timeline = null;
            let timelineData = null;

            if (slideIndex >= 0 && typeof audioCache !== 'undefined') {
                timelineData = audioCache.getTimeline(slideIndex);
            }

            if (timelineData && timelineData.timeline) {
                // Use pre-calculated timeline - instant!
                timeline = timelineData.timeline;
            } else {
                // Fallback: calculate on the fly (shouldn't happen normally)
                console.warn('Avatar: No pre-calculated timeline for slide', slideIndex, '- calculating on the fly');
                const silenceSegments = this.detectSilenceSegments(audioBuffer);
                timeline = this.buildAnimationTimeline(audioBuffer.duration, silenceSegments);
            }

            this.preparedAudio = {
                context: audioContext,
                buffer: audioBuffer,
                timeline: timeline
            };

            this.audioReady = true;
            this.tryStartAudio();
        } catch (error) {
            console.error('Avatar: Error preparing audio:', error);
            this.resetState();
            this.startAccordionLoop();

            if (this.speechResolve) {
                this.speechResolve();
                this.speechResolve = null;
                this.speechReject = null;
            }
        }
    }

    // Legacy method kept for compatibility
    async prepareAudio(audioBlob) {
        return this.prepareAudioWithTimeline(audioBlob, -1);
    }

    // ============================================
    // SILENCE DETECTION - From avalution2
    // ============================================
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

        this.lastSoundTime = lastSoundTime;
        return segments;
    }

    // ============================================
    // ANIMATION TIMELINE - From avalution2
    // ============================================
    buildAnimationTimeline(audioDuration, silenceSegments) {
        const timeline = [];
        let currentTime = 0;

        const effectiveEndTime = this.lastSoundTime || audioDuration;

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

        console.log('Avatar: Audio duration:', audioDuration, 'Last sound:', effectiveEndTime);
        return timeline;
    }

    createSegment(mode, startTime, endTime) {
        const duration = endTime - startTime;
        const totalFramesAvailable = duration * this.FPS;

        const fullAccordionFrames = this.FRAME_COUNT * 2; // Full cycle = up + down
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

        // Clamp to valid range
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

    // ============================================
    // PLAY AUDIO WITH ANIMATION - From avalution2
    // ============================================
    playPendingAudio() {
        if (!this.preparedAudio) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
            return;
        }

        // Clear waiting states
        this.pendingAudio = null;
        this.waitingForAudio = false;
        this.audioReady = false;
        this.holdingAtZero = false;
        this.isHalfAccordion = false;
        this.isWaitingMode = false;
        this.returningToZero = false;
        this.waitingState = 0;

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        const { context: audioContext, buffer: audioBuffer, timeline } = this.preparedAudio;
        this.preparedAudio = null;
        this.timeline = timeline;
        this.audioDuration = audioBuffer.duration;
        this.currentSegmentIndex = 0;

        // Create audio source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        // Store references for stopping
        this.currentAudioSource = source;
        this.currentAudioContext = audioContext;

        this.audioStartTime = audioContext.currentTime;
        this.isPlaying = true;

        // Set initial mode from first timeline segment
        if (this.timeline.length > 0) {
            const firstSegment = this.timeline[0];
            this.currentMode = firstSegment.mode;
            this.currentMaxFrame = firstSegment.maxFrame;
        }

        this.currentFrame = 0;
        this.playDirection = 1;
        this.showFrame(0);
        this.lastFrameTime = performance.now();

        // Start audio playback
        source.start(0);

        // Start synchronized animation
        this.animateWithTimeline(audioContext);

        // Handle audio end
        source.onended = () => {
            // Only process if we haven't been stopped
            if (this.isStopping) return;

            // Close the audio context (each playback gets its own)
            audioContext.close();
            this.currentAudioSource = null;
            this.currentAudioContext = null;

            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }

            // Return to idle at frame 0
            this.currentFrame = 0;
            this.playDirection = 1;
            this.currentMode = 'idle';
            this.showFrame(0);
            this.isPlaying = false;
            this.startAccordionLoop();

            // Resolve the speech promise
            if (this.speechResolve) {
                this.speechResolve();
                this.speechResolve = null;
                this.speechReject = null;
            }
        };
    }

    // ============================================
    // STOP CURRENT AUDIO - Smooth transition back to idle
    // Returns a promise that resolves when fully stopped
    // Uses the SHORTEST PATH to frame 0 (can go forward if closer)
    // ============================================
    stopCurrentAudio() {
        // If nothing is playing, resolve immediately
        if (!this.currentAudioSource && !this.waitingForAudio && !this.isWaitingMode && !this.isPlaying) {
            return Promise.resolve();
        }

        // If already stopping, return the existing promise
        if (this.isStopping && this.stopPromise) {
            return this.stopPromise;
        }

        this.isStopping = true;

        this.stopPromise = new Promise((resolve) => {
            this.stopResolve = resolve;

            // Stop the audio source if playing
            if (this.currentAudioSource) {
                try {
                    this.currentAudioSource.onended = null;
                    this.currentAudioSource.stop();
                } catch (e) {
                    // Already stopped
                }
                this.currentAudioSource = null;
            }

            // Close audio context
            if (this.currentAudioContext) {
                try {
                    this.currentAudioContext.close();
                } catch (e) {
                    // Already closed
                }
                this.currentAudioContext = null;
            }

            // Cancel any pending animation frame
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }

            // Reset audio-related state
            this.preparedAudio = null;
            this.waitingForAudio = false;
            this.audioReady = false;
            this.holdingAtZero = false;
            this.isWaitingMode = false;
            this.returningToZero = false;
            this.waitingState = 0;
            this.isPlaying = false;
            this.timeline = [];

            // Resolve the speech promise (audio was stopped)
            if (this.speechResolve) {
                this.speechResolve();
                this.speechResolve = null;
                this.speechReject = null;
            }

            const currentFrame = this.currentFrame;

            // Already at frame 0
            if (currentFrame === 0) {
                this.currentMode = 'idle';
                this.playDirection = 1;
                this.showFrame(0);
                this.finishStop(resolve);
                return;
            }

            // Calculate SHORTEST PATH to frame 0
            // Option 1: Go backward (currentFrame steps)
            // Option 2: Go forward to max then back to 0 (FRAME_COUNT - currentFrame + FRAME_COUNT steps) - NOT shorter
            // Actually for accordion: going backward is always shorter or equal
            // But we can also consider: if we're past halfway, continue forward is smoother visually

            // Simple approach: always go backward (it's the direct path to 0)
            this.playDirection = -1;
            this.lastFrameTime = performance.now();

            const animateToZero = () => {
                const now = performance.now();
                const elapsed = now - this.lastFrameTime;

                if (elapsed >= this.FRAME_DURATION) {
                    this.lastFrameTime = now;

                    let nextFrame = this.currentFrame - 1;

                    if (nextFrame <= 0) {
                        this.currentFrame = 0;
                        this.currentMode = 'idle';
                        this.showFrame(0);
                        this.playDirection = 1;
                        this.finishStop(resolve);
                        return;
                    }

                    this.currentFrame = nextFrame;
                    this.showFrame(nextFrame);
                }

                this.animationFrameId = requestAnimationFrame(animateToZero);
            };

            animateToZero();
        });

        return this.stopPromise;
    }

    // Helper to finish the stop process
    finishStop(resolve) {
        this.isStopping = false;
        this.stopPromise = null;
        this.stopResolve = null;
        this.startAccordionLoop();
        resolve();
    }

    // ============================================
    // STOP FOR SLIDE CHANGE - No return to frame 0
    // Just stops audio and clears state, keeps current frame
    // ============================================
    stopForSlideChange() {
        // Stop the audio source if playing
        if (this.currentAudioSource) {
            try {
                this.currentAudioSource.onended = null;
                this.currentAudioSource.stop();
            } catch (e) {
                // Already stopped
            }
            this.currentAudioSource = null;
        }

        // Close audio context
        if (this.currentAudioContext) {
            try {
                this.currentAudioContext.close();
            } catch (e) {
                // Already closed
            }
            this.currentAudioContext = null;
        }

        // Cancel any pending animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Reset audio-related state but keep current frame
        this.preparedAudio = null;
        this.waitingForAudio = false;
        this.audioReady = false;
        this.holdingAtZero = false;
        this.isWaitingMode = false;
        this.returningToZero = false;
        this.waitingState = 0;
        this.isPlaying = false;
        this.isStopping = false;
        this.timeline = [];

        // Resolve the speech promise (audio was stopped)
        if (this.speechResolve) {
            this.speechResolve();
            this.speechResolve = null;
            this.speechReject = null;
        }
    }

    // ============================================
    // SPEAK WITH CROSSFADE - Progressive crossfade over 10 frames
    // Old animation continues 10 frames (opaque, background)
    // New animation plays 10 frames (fade in 0->1, foreground)
    // ============================================
    async speakWithCrossfade(audioBlob, slideIndex = -1) {
        if (!this.framesLoaded) {
            return;
        }

        // Capture current state for background animation
        const oldFrame = this.currentFrame;
        const oldMode = this.currentMode;
        const oldPlayDirection = this.playDirection;

        // Stop any current audio without returning to frame 0
        this.stopForSlideChange();

        return new Promise((resolve, reject) => {
            this.speechResolve = resolve;
            this.speechReject = reject;

            // Start crossfade with dual animations
            this.prepareAndStartCrossfade(audioBlob, slideIndex, oldFrame, oldMode, oldPlayDirection);
        });
    }

    // Prepare new audio and start crossfade
    async prepareAndStartCrossfade(audioBlob, slideIndex, oldFrame, oldMode, oldPlayDirection) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            let timeline = null;
            let timelineData = null;

            if (slideIndex >= 0 && typeof audioCache !== 'undefined') {
                timelineData = audioCache.getTimeline(slideIndex);
            }

            if (timelineData && timelineData.timeline) {
                timeline = timelineData.timeline;
            } else {
                console.warn('Avatar: No pre-calculated timeline for slide', slideIndex, '- calculating on the fly');
                const silenceSegments = this.detectSilenceSegments(audioBuffer);
                timeline = this.buildAnimationTimeline(audioBuffer.duration, silenceSegments);
            }

            this.startCrossfadePlayback(audioContext, audioBuffer, timeline, oldFrame, oldMode, oldPlayDirection);

        } catch (error) {
            console.error('Avatar: Error preparing audio for crossfade:', error);
            this.img.style.opacity = '1';
            if (this.imgBack) this.imgBack.style.display = 'none';
            this.resetState();
            this.startAccordionLoop();

            if (this.speechResolve) {
                this.speechResolve();
                this.speechResolve = null;
                this.speechReject = null;
            }
        }
    }

    // Start playback with progressive crossfade
    startCrossfadePlayback(audioContext, audioBuffer, timeline, oldFrame, oldMode, oldPlayDirection) {
        this.pendingAudio = null;
        this.waitingForAudio = false;
        this.audioReady = false;
        this.holdingAtZero = false;
        this.isHalfAccordion = false;
        this.isWaitingMode = false;
        this.returningToZero = false;
        this.waitingState = 0;

        this.timeline = timeline;
        this.audioDuration = audioBuffer.duration;
        this.currentSegmentIndex = 0;

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        this.currentAudioSource = source;
        this.currentAudioContext = audioContext;

        this.audioStartTime = audioContext.currentTime;
        this.isPlaying = true;

        if (this.timeline.length > 0) {
            this.currentMode = this.timeline[0].mode;
            this.currentMaxFrame = this.timeline[0].maxFrame;
        }

        // Setup crossfade state
        this.crossfadeState = {
            active: true,
            totalFrames: 10,
            frameCount: 0,
            // Old animation state (background)
            oldFrame: oldFrame,
            oldMode: oldMode,
            oldPlayDirection: oldPlayDirection,
            oldFrames: oldMode === 'idle' ? this.idleFrames : this.speakFrames
        };

        // Setup background image with old animation
        if (this.imgBack) {
            const oldFrameImg = this.crossfadeState.oldFrames[oldFrame];
            if (oldFrameImg) {
                this.imgBack.src = oldFrameImg.src;
                this.imgBack.style.display = 'block';
                this.imgBack.style.opacity = '1';
                this.imgBack.style.position = 'absolute';
                this.imgBack.style.top = '0';
                this.imgBack.style.left = '0';
                this.imgBack.style.width = '100%';
                this.imgBack.style.height = '100%';
                this.imgBack.style.objectFit = 'cover';
            }
        }

        // Foreground image starts transparent
        this.img.style.opacity = '0';

        this.currentFrame = 0;
        this.playDirection = 1;
        this.lastFrameTime = performance.now();
        this.showFrame(0);

        source.start(0);

        this.animateWithCrossfade(audioContext);

        source.onended = () => {
            if (this.isStopping) return;

            audioContext.close();
            this.currentAudioSource = null;
            this.currentAudioContext = null;
            this.crossfadeState = null;
            this.img.style.opacity = '1';
            if (this.imgBack) this.imgBack.style.display = 'none';

            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }

            this.currentFrame = 0;
            this.playDirection = 1;
            this.currentMode = 'idle';
            this.showFrame(0);
            this.isPlaying = false;
            this.startAccordionLoop();

            if (this.speechResolve) {
                this.speechResolve();
                this.speechResolve = null;
                this.speechReject = null;
            }
        };
    }

    // Animate with progressive crossfade
    animateWithCrossfade(audioContext) {
        if (this.isStopping || !this.currentAudioSource) {
            return;
        }

        const audioElapsed = audioContext.currentTime - this.audioStartTime;

        if (audioElapsed >= this.audioDuration) {
            return;
        }

        const currentSegment = this.getCurrentSegment(audioElapsed);
        if (!currentSegment) {
            this.animationFrameId = requestAnimationFrame(() => {
                this.animateWithCrossfade(audioContext);
            });
            return;
        }

        if (currentSegment.mode !== this.currentMode) {
            this.currentMode = currentSegment.mode;
            this.currentMaxFrame = currentSegment.maxFrame;
            this.currentFramesPerCycle = currentSegment.framesPerCycle;
        }

        const timeInSegment = audioElapsed - currentSegment.startTime;
        const framesInSegment = timeInSegment * this.FPS;

        const positionInAccordion = framesInSegment % currentSegment.framesPerCycle;
        const halfCycle = currentSegment.framesPerCycle / 2;

        let frameToShow;
        if (positionInAccordion < halfCycle) {
            frameToShow = Math.floor((positionInAccordion / halfCycle) * currentSegment.maxFrame);
        } else {
            const returnPosition = positionInAccordion - halfCycle;
            frameToShow = Math.floor(currentSegment.maxFrame - (returnPosition / halfCycle) * currentSegment.maxFrame);
        }

        frameToShow = Math.max(0, Math.min(frameToShow, Math.floor(currentSegment.maxFrame)));

        if (frameToShow !== this.currentFrame) {
            this.currentFrame = frameToShow;
            this.showFrame(frameToShow);

            // Handle crossfade: fade in foreground, continue background animation
            if (this.crossfadeState && this.crossfadeState.active) {
                this.crossfadeState.frameCount++;
                
                // Fade in foreground (new animation)
                const opacity = Math.min(this.crossfadeState.frameCount / this.crossfadeState.totalFrames, 1);
                this.img.style.opacity = String(opacity);

                // Continue background animation (old animation stays opaque)
                if (this.imgBack && this.crossfadeState.frameCount <= this.crossfadeState.totalFrames) {
                    // Advance old animation by one frame
                    let nextOldFrame = this.crossfadeState.oldFrame + this.crossfadeState.oldPlayDirection;
                    
                    // Handle accordion boundaries
                    const maxOldFrame = this.FRAME_COUNT - 1;
                    if (this.crossfadeState.oldPlayDirection === 1 && nextOldFrame > maxOldFrame) {
                        nextOldFrame = maxOldFrame;
                        this.crossfadeState.oldPlayDirection = -1;
                    } else if (this.crossfadeState.oldPlayDirection === -1 && nextOldFrame < 0) {
                        nextOldFrame = 0;
                        this.crossfadeState.oldPlayDirection = 1;
                    }
                    
                    this.crossfadeState.oldFrame = nextOldFrame;
                    const oldFrameImg = this.crossfadeState.oldFrames[nextOldFrame];
                    if (oldFrameImg) {
                        this.imgBack.src = oldFrameImg.src;
                    }
                }

                if (this.crossfadeState.frameCount >= this.crossfadeState.totalFrames) {
                    // Crossfade complete
                    this.crossfadeState.active = false;
                    this.img.style.opacity = '1';
                    if (this.imgBack) {
                        this.imgBack.style.display = 'none';
                    }
                }
            }
        }

        this.animationFrameId = requestAnimationFrame(() => {
            this.animateWithCrossfade(audioContext);
        });
    }

    // ============================================
    // ANIMATE WITH TIMELINE - Core sync logic from avalution2
    // ============================================
    animateWithTimeline(audioContext) {
        // Check if we've been stopped
        if (this.isStopping || !this.currentAudioSource) {
            return;
        }

        const audioElapsed = audioContext.currentTime - this.audioStartTime;

        // Audio finished
        if (audioElapsed >= this.audioDuration) {
            return;
        }

        const currentSegment = this.getCurrentSegment(audioElapsed);
        if (!currentSegment) {
            // No segment found but audio still playing - continue loop
            this.animationFrameId = requestAnimationFrame(() => {
                this.animateWithTimeline(audioContext);
            });
            return;
        }

        // Switch mode if segment changed (smooth transition at frame 0 boundaries)
        if (currentSegment.mode !== this.currentMode) {
            this.currentMode = currentSegment.mode;
            this.currentMaxFrame = currentSegment.maxFrame;
            this.currentFramesPerCycle = currentSegment.framesPerCycle;
        }

        // Calculate frame based on timeline position
        const timeInSegment = audioElapsed - currentSegment.startTime;
        const framesInSegment = timeInSegment * this.FPS;

        const positionInAccordion = framesInSegment % currentSegment.framesPerCycle;
        const halfCycle = currentSegment.framesPerCycle / 2;

        let frameToShow;
        if (positionInAccordion < halfCycle) {
            // Forward: 0 -> maxFrame
            frameToShow = Math.floor((positionInAccordion / halfCycle) * currentSegment.maxFrame);
        } else {
            // Backward: maxFrame -> 0
            const returnPosition = positionInAccordion - halfCycle;
            frameToShow = Math.floor(currentSegment.maxFrame - (returnPosition / halfCycle) * currentSegment.maxFrame);
        }

        // Clamp to valid range
        frameToShow = Math.max(0, Math.min(frameToShow, Math.floor(currentSegment.maxFrame)));

        // Only update if frame actually changed
        if (frameToShow !== this.currentFrame) {
            this.currentFrame = frameToShow;
            this.showFrame(frameToShow);
        }

        this.animationFrameId = requestAnimationFrame(() => {
            this.animateWithTimeline(audioContext);
        });
    }

    getCurrentSegment(audioElapsed) {
        for (const segment of this.timeline) {
            if (audioElapsed >= segment.startTime && audioElapsed < segment.endTime) {
                return segment;
            }
        }
        return null;
    }

    // ============================================
    // RESET STATE
    // ============================================
    resetState() {
        this.pendingAudio = null;
        this.preparedAudio = null;
        this.waitingForAudio = false;
        this.audioReady = false;
        this.holdingAtZero = false;
        this.isHalfAccordion = false;
        this.isWaitingMode = false;
        this.returningToZero = false;
        this.waitingState = 0;
        this.timeline = [];

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}
