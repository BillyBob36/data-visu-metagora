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

    // Build slide mapping: stores direct DOM references for active slides
    buildSlideMap() {
        const narrative = this.getNarrative();
        this.slideMap = []; // Array of DOM elements
        const allSlides = document.querySelectorAll('.slide');
        
        narrative.forEach((item) => {
            for (let i = 0; i < allSlides.length; i++) {
                if (allSlides[i].dataset.slideType === item.slideType) {
                    this.slideMap.push(allSlides[i]);
                    break;
                }
            }
        });
    }

    // Get the DOM element for current narrative slide
    getActiveSlideElement() {
        return this.slideMap[this.currentSlide] || null;
    }

    setupEventListeners() {
        // Global click handler
        document.body.addEventListener('click', this.handleClick);

        // Dot navigation
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', this.handleDotClick);
        });

        // Emotional "more errors" button
        const moreBtn = document.getElementById('emotionalMoreBtn');
        if (moreBtn) {
            moreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                alert('Fonctionnalité à venir : accès à toutes vos erreurs et réponses idéales.');
            });
        }

        // Emotional "continue" button
        const continueBtn = document.getElementById('emotionalContinueBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.emotionalBlocking = false;
                this.canContinue = true;
                this.goToSlide(this.currentSlide + 1);
            });
        }
    }

    handleClick(e) {
        // Don't handle clicks on choices, dots, or buttons
        if (e.target.closest('.choice-btn') || e.target.closest('.dot')) {
            return;
        }

        // Block clicks during emotional sub-narratives
        if (this.emotionalBlocking) {
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
    // EMOTIONAL INTELLIGENCE - 3 SUB-NARRATIVES
    // Sub 0: scores overview (audio ends → sub 1)
    // Sub 1: card front shown + narration (audio ends → flip + sub 2)
    // Sub 2: card back narration + buttons
    // ============================================
    initEmotionalSlide() {
        this.emotionalSubStep = 0;
        this.emotionalBlocking = true;

        const data = getScenarioData();
        if (!data.emotionalIntelligence) return;

        const ei = data.emotionalIntelligence;
        const card = ei.cards[0];

        // Animate score bars
        const presBar = document.getElementById('emoPresentationBar');
        const objBar = document.getElementById('emoObjectionsBar');
        if (presBar) setTimeout(() => { presBar.style.width = ei.presentationScore + '%'; }, 200);
        if (objBar) setTimeout(() => { objBar.style.width = ei.objectionsScore + '%'; }, 400);

        // Populate flip card data
        const badge = document.getElementById('flipBadge0');
        const ctx = document.getElementById('flipContext0');
        const resp = document.getElementById('flipResponse0');
        const diag = document.getElementById('flipDiagnostic0');
        const ideal = document.getElementById('flipIdeal0');
        const just = document.getElementById('flipJustification0');

        if (badge) badge.textContent = `❌ ${card.phase.toUpperCase()} #${card.simNumber}`;
        if (ctx) ctx.textContent = card.front.context;
        if (resp) resp.textContent = `« ${card.front.yourResponse} »`;
        if (diag) diag.textContent = `→ ${card.front.diagnostic}`;
        if (ideal) ideal.textContent = `« ${card.back.idealResponse} »`;
        if (just) just.textContent = card.back.justification;

        // Reset panels: show scores, hide card + actions
        const panelScores = document.getElementById('emoPanelScores');
        const panelCard = document.getElementById('emoPanelCard');
        const actions = document.getElementById('emotionalActions');
        const flipCard = document.getElementById('flipCard0');

        if (panelScores) panelScores.classList.remove('hidden');
        if (panelCard) panelCard.classList.add('hidden');
        if (actions) actions.classList.add('hidden');
        if (flipCard) flipCard.classList.remove('flipped');
    }

    // Called when audio finishes on the emotional slide
    onEmotionalAudioEnd() {
        if (this.emotionalSubStep === 0) {
            // Audio for scores overview finished → show card front
            this.emotionalSubStep = 1;
            this.showEmotionalCardFront();
        } else if (this.emotionalSubStep === 1) {
            // Audio for card front description finished → flip card + narrate back
            this.emotionalSubStep = 2;
            this.flipEmotionalCard();
        } else if (this.emotionalSubStep === 2) {
            // Audio for card back finished → hide card, show buttons
            this.emotionalSubStep = 3;
            this.showEmotionalActions();
        }
    }

    showEmotionalCardFront() {
        // Swap panels: hide scores, show card
        const panelScores = document.getElementById('emoPanelScores');
        const panelCard = document.getElementById('emoPanelCard');
        if (panelScores) panelScores.classList.add('hidden');
        if (panelCard) panelCard.classList.remove('hidden');

        // Build sub-narrative text
        const data = getScenarioData();
        const card = data.emotionalIntelligence.cards[0];
        const subText = `En phase <span class='highlight'>${card.phase}</span>, lors de la simulation n°${card.simNumber}, vous avez dit : <span class='highlight'>« ${card.front.yourResponse} »</span>. ${card.front.diagnostic} — cela sous-entend un manque d'écoute des besoins réels du client. Voyons comment améliorer.`;
        const subSpeech = `En phase ${card.phase}, lors de la simulation numéro ${card.simNumber}, vous avez dit : ${card.front.yourResponse}. ${card.front.diagnostic}, cela sous-entend un manque d'écoute des besoins réels du client. Voyons comment améliorer.`;

        // Type + play audio for sub-narrative 1
        this.typeWriter(subText, () => {});
        this.playSubNarrativeAudio(subSpeech);
    }

    flipEmotionalCard() {
        const flipCard = document.getElementById('flipCard0');
        if (flipCard) flipCard.classList.add('flipped');

        const data = getScenarioData();
        const card = data.emotionalIntelligence.cards[0];
        const subText = `Idéalement, vous auriez dû répondre : <span class='highlight'>« ${card.back.idealResponse} »</span>. ${card.back.justification}`;
        const subSpeech = `Idéalement, vous auriez dû répondre : ${card.back.idealResponse}. ${card.back.justification}`;

        this.typeWriter(subText, () => {});
        this.playSubNarrativeAudio(subSpeech);
    }

    showEmotionalActions() {
        // Hide card panel, show buttons in its place
        const panelCard = document.getElementById('emoPanelCard');
        const actions = document.getElementById('emotionalActions');
        if (panelCard) panelCard.classList.add('hidden');
        if (actions) actions.classList.remove('hidden');

        this.typeWriter("Que souhaitez-vous faire ?", () => {});
    }

    async playSubNarrativeAudio(speechText) {
        if (!this.avatar || !this.avatar.framesLoaded) return;

        try {
            // Generate TTS for this sub-narrative
            const voices = getVoicesForLanguage(I18N_STATE.currentLanguage);
            const selectedVoice = voices.find(v => v.id === I18N_STATE.currentVoice);
            const modelId = selectedVoice?.model || 'eleven_multilingual_v2';

            const response = await fetch(`${API_CONFIG.endpoint}/api/elevenlabs/speech`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: speechText,
                    voiceId: I18N_STATE.currentVoice,
                    modelId,
                    outputFormat: 'mp3_44100_192'
                })
            });

            if (!response.ok) return;

            const audioBlob = await response.blob();
            this.audioPlaying = true;

            if (this.avatar.speakWithCrossfade) {
                await this.avatar.speakWithCrossfade(audioBlob, -1);
            } else {
                await this.avatar.speakWithAudio(audioBlob, -1);
            }

            this.audioPlaying = false;
            // Trigger next sub-step when audio ends
            this.onEmotionalAudioEnd();
        } catch (error) {
            console.error('Sub-narrative audio error:', error);
            this.audioPlaying = false;
            // Still advance even if audio fails
            this.onEmotionalAudioEnd();
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
        // Generate and download a simple text report
        const data = getScenarioData();
        const narrative = this.getNarrative();
        const name = data.report.trainee.name;
        const role = data.report.trainee.role;
        const date = data.report.date;

        let report = `BILAN METAGORA - ${data.report.generatedBy}\n`;
        report += `${'='.repeat(40)}\n\n`;
        report += `Nom : ${name}\n`;
        report += `Rôle : ${role}\n`;
        report += `Date : ${date}\n`;
        report += `Rang : ${data.rank.grade} - ${data.rank.label}\n\n`;
        report += `STATISTIQUES\n${'-'.repeat(20)}\n`;
        report += `Simulations : ${data.stats.simulations}\n`;
        report += `Ventes réussies : ${data.stats.salesSuccess}\n`;
        report += `Jours actifs : ${data.stats.activeDays}\n`;
        report += `Score écoute active : ${data.stats.listeningScore}/100\n`;

        if (data.resilience) {
            report += `\nRÉSILIENCE\n${'-'.repeat(20)}\n`;
            report += `Score : ${data.resilience.score}/100 (Level ${data.resilience.level}/${data.resilience.maxLevel})\n`;
            report += `Progression : +${data.resilience.progressionMonth} pts/mois\n`;
        }

        if (data.emotionalIntelligence) {
            report += `\nINTELLIGENCE ÉMOTIONNELLE\n${'-'.repeat(20)}\n`;
            report += `Présentation : ${data.emotionalIntelligence.presentationScore}%\n`;
            report += `Objections : ${data.emotionalIntelligence.objectionsScore}%\n`;
        }

        report += `\n${'='.repeat(40)}\n`;
        report += `Généré par ${data.report.generatedBy} le ${date}\n`;

        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Bilan_Metagora_${name.replace(/\s/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
        const activeEl = this.getActiveSlideElement();
        // Hide ALL slides first
        document.querySelectorAll('.slide').forEach(slide => {
            slide.classList.remove('active', 'exit');
        });
        // Show only the active one
        if (activeEl) {
            activeEl.classList.add('active');
        }
    }

    // Configure which slides are visible based on scenario
    configureSlideVisibility() {
        const narrative = this.getNarrative();
        const activeTypes = narrative.map(n => n.slideType);
        
        document.querySelectorAll('.slide').forEach(slide => {
            const type = slide.dataset.slideType;
            if (type && !activeTypes.includes(type)) {
                // Completely remove from flow and DOM rendering
                slide.classList.add('scenario-hidden');
                slide.classList.remove('active', 'exit');
            } else {
                slide.classList.remove('scenario-hidden');
            }
        });
    }

    // Update HTML content based on scenario data
    updateSlideContent() {
        const data = getScenarioData();
        
        // Update rank slide
        const rankLabel = document.querySelector('.rank-subtitle');
        if (rankLabel) rankLabel.textContent = data.rank.label;

        // Update stats slide from scenario data
        const statSim = document.getElementById('statSimulations');
        const statSales = document.getElementById('statSalesSuccess');
        const statDays = document.getElementById('statActiveDays');
        const statScore = document.getElementById('statListeningScore');
        if (statSim) statSim.textContent = data.stats.simulations;
        if (statSales) statSales.textContent = data.stats.salesSuccess;
        if (statDays) statDays.textContent = data.stats.activeDays;
        if (statScore) statScore.textContent = data.stats.listeningScore;
        
        // Update resilience slide if present
        if (data.resilience) {
            this.initResilienceSlide(data.resilience);
        }
    }

    initResilienceSlide(res) {
        // SVG ring gauge
        const ringFill = document.getElementById('resRingFill');
        const ringValue = document.getElementById('resRingValue');
        const levelEl = document.getElementById('resLevel');
        const simEl = document.getElementById('resSim');
        const progEl = document.getElementById('resProg');
        const sparkStartEl = document.getElementById('resSparkStart');
        const sparkEndEl = document.getElementById('resSparkEnd');
        const sparkEl = document.getElementById('resSparkline');

        if (ringValue) ringValue.textContent = res.score;
        if (levelEl) levelEl.textContent = `Level ${res.level}/${res.maxLevel}`;
        if (simEl) simEl.textContent = res.totalSimulations;
        if (progEl) progEl.textContent = `+${res.progressionMonth}`;
        if (sparkStartEl) sparkStartEl.textContent = res.startScore;
        if (sparkEndEl) sparkEndEl.textContent = res.score;

        // Animate SVG ring: circumference = 2 * PI * 52 ≈ 326.73
        if (ringFill) {
            const circumference = 326.73;
            const offset = circumference - (res.score / 100) * circumference;
            setTimeout(() => {
                ringFill.style.strokeDashoffset = offset;
            }, 300);
        }

        // Build sparkline bars
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
        const isEmotional = slideType === 'emotional' && this.getCurrentSlide().subSteps;
        if (isEmotional) {
            this.initEmotionalSlide();
        }

        this.isTransitioning = false;

        // Start typing IMMEDIATELY
        this.typeWriter(this.getCurrentSlide().text, () => {
            if (this.getCurrentSlide().choices) {
                this.showChoices();
                this.narrativeComplete = true;
            } else if (isEmotional) {
                // Don't show click hint — audio end triggers next sub-step
            } else {
                this.showClickHint();
            }
        });

        // Start audio — for emotional slide, audio end triggers sub-steps
        if (this.userHasInteracted) {
            if (isEmotional) {
                this.playSlideAudioWithCallback(useCrossfade, () => {
                    this.onEmotionalAudioEnd();
                });
            } else {
                this.playSlideAudio(useCrossfade);
            }
        }
    }

    async playSlideAudio(useCrossfade = true) {
        if (!this.avatar || !this.avatar.framesLoaded) {
            return;
        }

        try {
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

    // Same as playSlideAudio but calls onComplete when audio finishes
    async playSlideAudioWithCallback(useCrossfade = true, onComplete) {
        if (!this.avatar || !this.avatar.framesLoaded) {
            if (onComplete) onComplete();
            return;
        }

        try {
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
            if (onComplete) onComplete();
        } catch (error) {
            console.error('Failed to play audio:', error);
            this.hideLoading();
            this.audioPlaying = false;
            if (onComplete) onComplete();
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
