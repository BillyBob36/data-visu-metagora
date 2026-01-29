/* ============================================
   CYBERMETEO - NARRATIVE CONTROLLER
   Handles slide navigation and dialogue display
   Adapted for smooth avatar transitions
   ============================================ */

class NarrativeController {
    constructor(avatarController) {
        this.avatar = avatarController;

        // DOM elements
        this.dialogueText = document.getElementById('dialogueText');
        this.choicesContainer = document.getElementById('choicesContainer');
        this.clickHint = document.getElementById('clickHint');
        this.loadingIndicator = document.getElementById('loadingIndicator');

        // State
        this.currentSlide = 0;
        this.isTyping = false;
        this.typewriterTimeout = null;
        this.narrativeComplete = false;
        this.audioPlaying = false;
        this.canContinue = false;
        this.userHasInteracted = false;

        // Flag to track if we're in the middle of a slide transition
        this.isTransitioning = false;

        // Bind methods
        this.handleClick = this.handleClick.bind(this);
        this.handleDotClick = this.handleDotClick.bind(this);

        // Setup event listeners
        this.setupEventListeners();
    }

    // Get current narrative data (translated or original)
    getNarrative() {
        if (I18N_STATE && I18N_STATE.translatedNarrative && I18N_STATE.translatedNarrative.length > 0) {
            return I18N_STATE.translatedNarrative;
        }
        return NARRATIVE;
    }

    // Get current slide data
    getCurrentSlide() {
        return this.getNarrative()[this.currentSlide];
    }

    setupEventListeners() {
        // Global click handler
        document.body.addEventListener('click', this.handleClick);

        // Dot navigation
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', this.handleDotClick);
        });
    }

    handleClick(e) {
        // Don't handle clicks on choices or dots
        if (e.target.closest('.choice-btn') || e.target.closest('.dot')) {
            return;
        }

        // Only advance if we can continue
        if (this.canContinue || this.narrativeComplete) {
            this.nextSlide();
        }
    }

    handleDotClick(e) {
        e.stopPropagation();

        // Only allow direct navigation after narrative is complete
        if (this.narrativeComplete) {
            const slideIndex = parseInt(e.target.dataset.dot);
            this.goToSlide(slideIndex);
        }
    }

    // ============================================
    // TYPEWRITER EFFECT
    // ============================================
    typeWriter(text, callback) {
        this.isTyping = true;
        this.dialogueText.innerHTML = '';
        let i = 0;

        const type = () => {
            if (i < text.length) {
                // Handle HTML tags
                if (text[i] === '<') {
                    const closeIndex = text.indexOf('>', i);
                    if (closeIndex !== -1) {
                        i = closeIndex + 1;
                    }
                }
                this.dialogueText.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor"></span>';
                i++;
                this.typewriterTimeout = setTimeout(type, 18);
            } else {
                this.dialogueText.innerHTML = text;
                this.isTyping = false;
                if (callback) callback();
            }
        };

        type();
    }

    skipTypewriter() {
        if (this.typewriterTimeout) {
            clearTimeout(this.typewriterTimeout);
        }
        this.dialogueText.innerHTML = this.getCurrentSlide().text;
        this.isTyping = false;

        if (this.getCurrentSlide().choices) {
            this.showChoices();
        }
    }

    // ============================================
    // CHOICES
    // ============================================
    showChoices() {
        const choices = this.getCurrentSlide().choices;
        if (!choices) return;

        this.choicesContainer.innerHTML = '';
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.label;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleChoice(choice);
            });
            this.choicesContainer.appendChild(btn);
        });

        this.choicesContainer.classList.add('visible');
    }

    hideChoices() {
        this.choicesContainer.classList.remove('visible');
        this.choicesContainer.innerHTML = '';
    }

    showClickHint() {
        this.canContinue = true;
        if (this.clickHint) {
            this.clickHint.textContent = getUIText('clickToContinue');
            this.clickHint.classList.add('visible');
        }
    }

    hideClickHint() {
        this.canContinue = false;
        if (this.clickHint) {
            this.clickHint.classList.remove('visible');
        }
    }

    handleChoice(choice) {
        switch (choice.action) {
            case 'learn':
                if (choice.url) window.open(choice.url, '_blank');
                break;
            case 'expert':
                if (choice.url) window.open(choice.url, '_blank');
                break;
            case 'download':
                this.downloadReport();
                break;
        }
    }

    downloadReport() {
        // Placeholder for report download
        alert('Téléchargement du rapport d\'audit...');
    }

    // ============================================
    // SLIDE NAVIGATION
    // ============================================
    updateProgressDots() {
        const totalSlides = this.getNarrative().length;
        document.querySelectorAll('.dot').forEach((dot, index) => {
            if (index >= totalSlides) {
                dot.style.display = 'none';
            } else {
                dot.style.display = '';
                if (index === this.currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            }
        });
    }

    updateSlideVisibility() {
        document.querySelectorAll('.slide').forEach((slide, index) => {
            slide.classList.remove('active', 'exit');
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else if (index < this.currentSlide) {
                slide.classList.add('exit');
            }
        });
    }

    async goToSlide(slideIndex, useCrossfade = true) {
        if (slideIndex < 0 || slideIndex >= this.getNarrative().length) return;

        // Prevent rapid slide changes during transition
        if (this.isTransitioning) {
            return;
        }

        this.isTransitioning = true;
        this.audioPlaying = false;

        // Cancel any pending typewriter
        if (this.typewriterTimeout) {
            clearTimeout(this.typewriterTimeout);
            this.typewriterTimeout = null;
            this.isTyping = false;
        }

        this.currentSlide = slideIndex;

        // Update UI IMMEDIATELY
        this.updateProgressDots();
        this.updateSlideVisibility();

        // Hide click hint and choices
        this.hideClickHint();
        this.hideChoices();

        // Handle avatar size for radar chart slide
        const avatarZone = document.querySelector('.avatar-zone');
        if (avatarZone) {
            if (this.currentSlide === 3) {
                avatarZone.classList.add('minimized');
                setTimeout(() => initRadarChart(), 100);
            } else {
                avatarZone.classList.remove('minimized');
            }
        }

        this.isTransitioning = false;

        // Start typing IMMEDIATELY - don't wait for avatar
        this.typeWriter(this.getCurrentSlide().text, () => {
            if (this.getCurrentSlide().choices) {
                this.showChoices();
                this.narrativeComplete = true;
            } else {
                this.showClickHint();
            }
        });

        // Start audio with crossfade (for click transitions) or normal (for initial load)
        if (this.userHasInteracted) {
            this.playSlideAudio(useCrossfade);
        }
    }

    async playSlideAudio(useCrossfade = true) {
        if (!this.avatar || !this.avatar.framesLoaded) {
            return;
        }

        try {
            // Show loading if audio not ready
            if (!audioCache.isAudioReady(this.currentSlide)) {
                this.showLoading('Chargement audio...');
            }

            const audioBlob = await audioCache.getAudio(this.currentSlide);
            this.hideLoading();

            if (audioBlob) {
                this.audioPlaying = true;
                // Use crossfade for slide changes (smooth transition, no return to frame 0)
                // Use normal speakWithAudio for initial load (waits for frame 0)
                if (useCrossfade && this.avatar.speakWithCrossfade) {
                    await this.avatar.speakWithCrossfade(audioBlob, this.currentSlide);
                } else {
                    await this.avatar.speakWithAudio(audioBlob, this.currentSlide);
                }
                this.audioPlaying = false;
            }
        } catch (error) {
            console.error('Failed to play audio:', error);
            this.hideLoading();
            this.audioPlaying = false;
        }
    }

    nextSlide() {
        // Don't advance if we can't continue yet
        if (!this.canContinue && !this.narrativeComplete) return;

        // After narrative is complete, allow cycling through slides
        if (this.narrativeComplete) {
            const nextIndex = (this.currentSlide + 1) % this.getNarrative().length;
            this.goToSlide(nextIndex);
        } else if (this.currentSlide < this.getNarrative().length - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    // ============================================
    // LOADING INDICATOR
    // ============================================
    showLoading(message) {
        if (this.loadingIndicator) {
            this.loadingIndicator.textContent = message || getUIText('loading');
            this.loadingIndicator.style.display = 'block';
        }
    }

    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    async start() {
        // Start preloading all audio in background
        audioCache.preloadAll((loaded, total) => {
            console.log(`Audio preload: ${loaded}/${total}`);
        });

        // Start with first slide - no crossfade for initial load
        await this.goToSlide(0, false);
    }
}
