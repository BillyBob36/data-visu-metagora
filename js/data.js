/* ============================================
   BILANMETAGORA - DATA CONFIGURATION
   ============================================ */

// Trainee and report data
const REPORT_DATA = {
    trainee: {
        name: "Alexandre",
        role: "Commercial Junior"
    },
    report: {
        date: "29 janvier 2026",
        generatedBy: "Metagora"
    },
    rank: {
        grade: "B",
        label: "Rookie Vendeur"
    },
    stats: {
        simulations: 24,
        salesSuccess: 18,
        activeDays: 12,
        listeningScore: 78
    }
};

// SCREENE indicators - 7 branches
const SCREENE_LABELS = ["Security", "Comfort", "Relational", "Ego", "Economy", "Novelty", "Ecology"];

// Scores at Onboarding (initial evaluation)
const SCORES_ONBOARDING = [45, 52, 38, 60, 55, 42, 48];

// Scores after 1 month (improved, except 2 branches that stagnate)
const SCORES_AFTER_1_MONTH = [72, 68, 75, 62, 78, 70, 50];

// Narrative texts for BilanMetagora
const NARRATIVE = [
    {
        text: "Bonjour <span class='highlight'>Alexandre</span> ! Voici le bilan de votre parcours de simulation de vente. Vous avez atteint le <span class='highlight'>Rang B</span> : <span class='highlight'>Rookie Vendeur</span>. Un excellent point de départ !",
        speechText: "Bonjour Alexandre ! Voici le bilan de votre parcours de simulation de vente. Vous avez atteint le Rang B : Rookie Vendeur. Un excellent point de départ !",
        choices: null
    },
    {
        text: "En <span class='highlight'>12 jours actifs</span>, vous avez réalisé <span class='highlight'>24 simulations</span> avec <span class='highlight'>18 ventes réussies</span>. Votre score d'écoute active est de <span class='highlight'>78/100</span>, ce qui montre une vraie capacité d'adaptation.",
        speechText: "En 12 jours actifs, vous avez réalisé 24 simulations avec 18 ventes réussies. Votre score d'écoute active est de 78 sur 100, ce qui montre une vraie capacité d'adaptation.",
        choices: null
    },
    {
        text: "Voici votre profil <span class='highlight'>Vendeur SCREENE</span>. La ligne rose représente votre évaluation à l'<span class='highlight'>Onboarding</span>, la ligne bleue votre progression après <span class='highlight'>1 mois</span>. Belle évolution sur la plupart des axes !",
        speechText: "Voici votre profil Vendeur SCREENE. La ligne rose représente votre évaluation à l'Onboarding, la ligne bleue votre progression après 1 mois. Belle évolution sur la plupart des axes !",
        choices: null
    },
    {
        text: "Que souhaitez-vous faire maintenant ?",
        speechText: "Que souhaitez-vous faire maintenant ?",
        choices: [
            { label: "Télécharger le report", action: "download", url: null },
            { label: "Lire les 5 tips pour m'améliorer", action: "tips", url: null }
        ]
    }
];

// API Configuration
const API_CONFIG = {
    endpoint: "https://cybermeteo-api.lamidetlm.com",
    voice: "alloy",
    cacheKey: "bilanmetagora_audio_cache",
    cacheVersion: "v1"
};

// Avatar configuration
const AVATAR_CONFIG = {
    framesPath: "frames/",
    quality: "demi",
    fps: 30,
    frameCount: 150,
    frameDuration: 1000 / 30,
    minSilenceDuration: 0.8
};
