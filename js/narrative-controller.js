/* ============================================
   BILANMETAGORA - NARRATIVE CONTROLLER
   Handles slide navigation, dialogue display,
   scenario switching, and emotional sub-steps
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

        // Emotional intelligence sub-step state
        this.emotionalSubStep = 0; // 0=initial, 1=card0 flipped, 2=card1 described, 3=card1 flipped, 4=show actions
        this.emotionalBlocking = false; // blocks global click when on emotional slide

        // Flag to track if we're in the middle of a slide transition
        this.isTransitioning = false;

        // Slide mapping: maps narrative index -> DOM slide index
        this.slideMap = [];

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
        return getScenarioNarrative();
    }

    // Get current slide data
    getCurrentSlide() {
        return this.getNarrative()[this.currentSlide];
    }

    // Build slide mapping based on scenario
    buildSlideMap() {
        const narrative = this.getNarrative();
        this.slideMap = [];
        const allSlides = document.querySelectorAll('.slide');
        
        narrative.forEach((item) => {
            for (let i = 0; i < allSlides.length; i++) {
                if (allSlides[i].dataset.slideType === item.slideType) {
                    this.slideMap.push(i);
                    break;
                }
            }
        });
    }

    // Get the DOM slide index for current narrative slide
    getDomSlideIndex() {
        return this.slideMap[this.currentSlide] || this.currentSlide;
    }

    setupEventListeners() {
        // Global click handler
        document.body.addEventListener('click', this.handleClick);

        // Dot navigation
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', this.handleDotClick);
        });

        // Flip card click handlers
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                // Only handle flip if we're on the emotional slide
                if (this.getCurrentSlide()?.slideType === 'emotional') {
                    this.handleFlipCardClick(card);
                }
            });
        });

        // Emotional "more errors" button
        const moreBtn = document.getElementById('emotionalMoreBtn');
        if (moreBtn) {
            moreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                alert('Fonctionnalité à venir : accès à toutes vos erreurs et réponses idéales.');
            });
        }
    }

    handleClick(e) {
        // Don't handle clicks on choices, dots, flip cards, or emotional buttons
        if (e.target.closest('.choice-btn') || e.target.closest('.dot') || 
            e.target.closest('.flip-card') || e.target.closest('.emotional-more-btn')) {
            return;
        }

        // If on emotional slide with sub-steps, handle sub-step progression
        if (this.emotionalBlocking) {
            this.advanceEmotionalSubStep();
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
    // EMOTIONAL INTELLIGENCE SUB-STEPS
    // ============================================
    initEmotionalSlide() {
        this.emotionalSubStep = 0;
        this.emotionalBlocking = true;

        // Populate card data from scenario
        const data = getScenarioData();
        if (!data.emotionalIntelligence) return;

        const ei = data.emotionalIntelligence;
        const cards = ei.cards;

        // Set scores
        const presBar = document.getElementById('emoPresentationBar');
        const objBar = document.getElementById('emoObjectionsBar');
        if (presBar) setTimeout(() => { presBar.style.width = ei.presentationScore + '%'; }, 200);
        if (objBar) setTimeout(() => { objBar.style.width = ei.objectionsScore + '%'; }, 400);

        // Populate flip cards
        cards.forEach((card, i) => {
            const ctx = document.getElementById(`flipContext${i}`);
            const resp = document.getElementById(`flipResponse${i}`);
            const diag = document.getElementById(`flipDiagnostic${i}`);
            const ideal = document.getElementById(`flipIdeal${i}`);
            const just = document.getElementById(`flipJustification${i}`);

            if (ctx) ctx.textContent = card.front.context;
            if (resp) resp.textContent = `« ${card.front.yourResponse} »`;
            if (diag) diag.textContent = `→ ${card.front.diagnostic}`;
            if (ideal) ideal.textContent = `« ${card.back.idealResponse} »`;
            if (just) just.textContent = card.back.justification;
        });

        // Reset flip states
        document.querySelectorAll('.flip-card').forEach(c => c.classList.remove('flipped'));

        // Hide second card initially, show first
        const card0 = document.getElementById('flipCard0');
        const card1 = document.getElementById('flipCard1');
        if (card0) card0.style.display = 'block';
        if (card1) card1.style.display = 'none';

        // Hide actions
        const actions = document.getElementById('emotionalActions');
        if (actions) actions.style.display = 'none';
    }

    handleFlipCardClick(card) {
        const idx = parseInt(card.dataset.cardIndex);
        
        // Only allow flipping the current active card at the right sub-step
        if (this.emotionalSubStep === 0 && idx === 0) {
            // Flip first card to show ideal response
            card.classList.add('flipped');
            this.emotionalSubStep = 1;
            
            // Update narrative text
            const data = getScenarioData();
            const idealCard = data.emotionalIntelligence.cards[0];
            this.typeWriter(
                `La réponse idéale aurait été : <span class='highlight'>« ${idealCard.back.idealResponse.substring(0, 80)}... »</span> — ${idealCard.back.justification}`,
                () => {}
            );
        } else if (this.emotionalSubStep === 2 && idx === 1) {
            // Flip second card
            card.classList.add('flipped');
            this.emotionalSubStep = 3;
            
            const data = getScenarioData();
            const idealCard = data.emotionalIntelligence.cards[1];
            this.typeWriter(
                `La réponse idéale : <span class='highlight'>« ${idealCard.back.idealResponse.substring(0, 80)}... »</span> — ${idealCard.back.justification}`,
                () => {
                    // Show the "more errors" button and allow continuing
                    this.emotionalSubStep = 4;
                    const actions = document.getElementById('emotionalActions');
                    if (actions) actions.style.display = 'block';
                    this.showEmotionalContinueHint();
                }
            );
        }
    }

    advanceEmotionalSubStep() {
        if (this.emotionalSubStep === 1) {
            // After first card flipped, show second card and describe it
            this.emotionalSubStep = 2;
            const card1 = document.getElementById('flipCard1');
            if (card1) card1.style.display = 'block';

            const data = getScenarioData();
            const card = data.emotionalIntelligence.cards[1];
            this.typeWriter(
                `En phase Objections, score de <span class='highlight'>${data.emotionalIntelligence.objectionsScore}%</span>. Lors de la simulation n°${card.simNumber}, le client a dit : <span class='highlight'>« ${card.front.context.substring(card.front.context.indexOf('«') + 2, card.front.context.lastIndexOf('»'))} »</span>. Vous avez répondu : <span class='highlight'>« ${card.front.yourResponse} »</span> — ${card.front.diagnostic}.`,
                () => {}
            );
        } else if (this.emotionalSubStep >= 4) {
            // Done with emotional slide, allow normal progression
            this.emotionalBlocking = false;
            this.showClickHint();
        }
    }

    showEmotionalContinueHint() {
        if (this.clickHint) {
            this.clickHint.textContent = 'Cliquez pour continuer votre bilan...';
            this.clickHint.classList.add('visible');
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
            case 'download':
                this.downloadReport();
                break;
            case 'tips':
                this.showTips();
                break;
        }
    }

    downloadReport() {
        alert('Téléchargement du rapport en cours...');
    }

    showTips() {
        alert('5 Tips pour améliorer vos performances :\n\n1. Écoutez activement avant de proposer\n2. Identifiez les motivations SCREENE du client\n3. Reformulez pour valider la compréhension\n4. Adaptez votre argumentaire au profil\n5. Concluez avec une question ouverte');
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
        const domIndex = this.getDomSlideIndex();
        document.querySelectorAll('.slide').forEach((slide, index) => {
            slide.classList.remove('active', 'exit');
            if (index === domIndex) {
                slide.classList.add('active');
            }
        });
    }

    // Configure which slides are visible based on scenario
    configureSlideVisibility() {
        const narrative = this.getNarrative();
        const activeTypes = narrative.map(n => n.slideType);
        
        document.querySelectorAll('.slide').forEach(slide => {
            const type = slide.dataset.slideType;
            if (type && !activeTypes.includes(type)) {
                slide.style.display = 'none';
            } else {
                slide.style.display = '';
            }
        });
    }

    // Update HTML content based on scenario data
    updateSlideContent() {
        const data = getScenarioData();
        
        // Update rank slide
        const rankLabel = document.querySelector('.rank-subtitle');
        if (rankLabel) rankLabel.textContent = data.rank.label;
        
        // Update resilience slide if present
        if (data.resilience) {
            this.initResilienceSlide(data.resilience);
        }
    }

    initResilienceSlide(res) {
        const scoreEl = document.getElementById('resilienceScore');
        const levelEl = document.getElementById('resilienceLevel');
        const simEl = document.getElementById('resSimulations');
        const progEl = document.getElementById('resProgression');
        const startEl = document.getElementById('resStartScore');
        const endEl = document.getElementById('resEndScore');
        const fillEl = document.getElementById('resProgressFill');
        const sparkEl = document.getElementById('resSparkline');

        if (scoreEl) scoreEl.textContent = res.score;
        if (levelEl) levelEl.textContent = `Level ${res.level}/${res.maxLevel}`;
        if (simEl) simEl.textContent = res.totalSimulations;
        if (progEl) progEl.textContent = `+${res.progressionMonth}`;
        if (startEl) startEl.textContent = res.startScore;
        if (endEl) endEl.textContent = res.score;
        if (fillEl) setTimeout(() => { fillEl.style.width = res.score + '%'; }, 300);

        // Build sparkline
        if (sparkEl && res.sparkline) {
            sparkEl.innerHTML = '';
            const max = Math.max(...res.sparkline);
            res.sparkline.forEach((val, i) => {
                const bar = document.createElement('div');
                bar.className = 'sparkline-bar';
                bar.style.height = '0%';
                sparkEl.appendChild(bar);
                setTimeout(() => {
                    bar.style.height = (val / max * 100) + '%';
                }, 400 + i * 150);
            });
        }
    }

    async goToSlide(slideIndex, useCrossfade = true) {
        if (slideIndex < 0 || slideIndex >= this.getNarrative().length) return;

        // Prevent rapid slide changes during transition
        if (this.isTransitioning) {
            return;
        }

        this.isTransitioning = true;
        this.audioPlaying = false;
        this.emotionalBlocking = false;

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

        // Get current slide type
        const slideType = this.getCurrentSlide().slideType;

        // Handle avatar size changes per slide type
        const avatarZone = document.querySelector('.avatar-zone');
        if (avatarZone) {
            avatarZone.classList.remove('reduced', 'minimized');
            
            if (slideType === 'stats' || slideType === 'resilience' || slideType === 'emotional') {
                avatarZone.classList.add('reduced');
            } else if (slideType === 'radar') {
                avatarZone.classList.add('minimized');
                setTimeout(() => initRadarChart(), 100);
            }
        }

        // Initialize emotional slide sub-steps
        if (slideType === 'emotional' && this.getCurrentSlide().subSteps) {
            this.initEmotionalSlide();
        }

        this.isTransitioning = false;

        // Start typing IMMEDIATELY
        this.typeWriter(this.getCurrentSlide().text, () => {
            if (this.getCurrentSlide().choices) {
                this.showChoices();
                this.narrativeComplete = true;
            } else if (slideType === 'emotional' && this.getCurrentSlide().subSteps) {
                // Don't show click hint, wait for card interaction
            } else {
                this.showClickHint();
            }
        });

        // Start audio
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
        // Build slide map and configure visibility
        this.buildSlideMap();
        this.configureSlideVisibility();
        this.updateSlideContent();

        // Start preloading all audio in background
        audioCache.preloadAll((loaded, total) => {
            console.log(`Audio preload: ${loaded}/${total}`);
        });

        // Start with first slide - no crossfade for initial load
        await this.goToSlide(0, false);
    }
}
