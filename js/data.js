/* ============================================
   BILANMETAGORA - DATA CONFIGURATION
   ============================================ */

// Current scenario (set by user on loading screen)
let CURRENT_SCENARIO = 'individuel';

// ============================================
// SCENARIO: INDIVIDUEL
// ============================================
const DATA_INDIVIDUEL = {
    report: {
        trainee: { name: "Alexandre", role: "Commercial Junior" },
        date: "29 janvier 2026",
        generatedBy: "Metagora"
    },
    rank: { grade: "B", label: "Rookie Vendeur" },
    stats: {
        simulations: 24,
        salesSuccess: 18,
        activeDays: 12,
        listeningScore: 78
    },
    resilience: {
        score: 78,
        level: 4,
        maxLevel: 5,
        startScore: 66,
        sparkline: [66, 68, 72, 78],
        totalSimulations: 24,
        progressionMonth: 12
    },
    emotionalIntelligence: {
        presentationScore: 82,
        objectionsScore: 78,
        cards: [
            {
                phase: "Présentation",
                simNumber: 22,
                front: {
                    context: "Le client cherchait une solution pour équiper ses 15 commerciaux terrain.",
                    yourResponse: "Notre logiciel a toutes les fonctionnalités dont vous avez besoin, je vais vous montrer.",
                    diagnostic: "Manque d'écoute active"
                },
                back: {
                    idealResponse: "Je comprends que vous équipez 15 commerciaux terrain. Quels sont les principaux défis qu'ils rencontrent au quotidien ? Le suivi client, la prise de commande ?",
                    justification: "Cela démontre l'écoute et cible les vrais besoins avant de proposer."
                }
            },
            {
                phase: "Objections",
                simNumber: 19,
                front: {
                    context: "Le client dit « Je dois en parler à mon directeur avant de me décider. »",
                    yourResponse: "D'accord, je vous rappelle la semaine prochaine pour avoir sa réponse.",
                    diagnostic: "Objection non explorée"
                },
                back: {
                    idealResponse: "Bien sûr, c'est une décision importante. Qu'est-ce qui pourrait le convaincre selon vous ? Y a-t-il un point précis sur lequel il aurait des réserves ?",
                    justification: "Cela permet d'identifier les vraies objections et de préparer des arguments ciblés."
                }
            }
        ]
    },
    screeneLabels: ["Security", "Comfort", "Relational", "Ego", "Economy", "Novelty", "Ecology"],
    scoresOnboarding: [45, 52, 38, 60, 55, 42, 48],
    scoresAfter1Month: [72, 68, 75, 62, 78, 70, 50]
};

const NARRATIVE_INDIVIDUEL = [
    {
        slideType: "rank",
        text: "Bonjour <span class='highlight'>Alexandre</span> ! Voici le bilan de votre parcours de simulation de vente. Vous avez atteint le <span class='highlight'>Rang B</span> : <span class='highlight'>Rookie Vendeur</span>. Un excellent point de départ !",
        speechText: "Bonjour Alexandre ! Voici le bilan de votre parcours de simulation de vente. Vous avez atteint le Rang B : Rookie Vendeur. Un excellent point de départ !",
        choices: null
    },
    {
        slideType: "stats",
        text: "En <span class='highlight'>12 jours actifs</span>, vous avez réalisé <span class='highlight'>24 simulations</span> avec <span class='highlight'>18 ventes réussies</span>. Votre score d'écoute active est de <span class='highlight'>78/100</span>, ce qui montre une vraie capacité d'adaptation.",
        speechText: "En 12 jours actifs, vous avez réalisé 24 simulations avec 18 ventes réussies. Votre score d'écoute active est de 78 sur 100, ce qui montre une vraie capacité d'adaptation.",
        choices: null
    },
    {
        slideType: "resilience",
        text: "Votre score de <span class='highlight'>Résilience</span> est de <span class='highlight'>78/100</span>, niveau 4 sur 5. Vous êtes passé de <span class='highlight'>66</span> à <span class='highlight'>78 points</span> en un mois, soit <span class='highlight'>+12 points</span> de progression. Excellente capacité de rebond !",
        speechText: "Votre score de Résilience est de 78 sur 100, niveau 4 sur 5. Vous êtes passé de 66 à 78 points en un mois, soit plus 12 points de progression. Excellente capacité de rebond !",
        choices: null
    },
    {
        slideType: "emotional",
        text: "Passons à votre <span class='highlight'>Intelligence Émotionnelle</span>. En phase Présentation, votre score est de <span class='highlight'>82%</span>. Lors de la simulation n°22, vous avez dit : <span class='highlight'>« Notre logiciel a toutes les fonctionnalités dont vous avez besoin »</span> — sans explorer les vrais besoins du client.",
        speechText: "Passons à votre Intelligence Émotionnelle. En phase Présentation, votre score est de 82%. Lors de la simulation numéro 22, vous avez dit : Notre logiciel a toutes les fonctionnalités dont vous avez besoin, sans explorer les vrais besoins du client.",
        choices: null,
        subSteps: true
    },
    {
        slideType: "radar",
        text: "Voici votre profil <span class='highlight'>Vendeur SCREENE</span>. La ligne rose représente votre évaluation à l'<span class='highlight'>Onboarding</span>, la ligne bleue votre progression après <span class='highlight'>1 mois</span>. Belle évolution sur la plupart des axes !",
        speechText: "Voici votre profil Vendeur SCREENE. La ligne rose représente votre évaluation à l'Onboarding, la ligne bleue votre progression après 1 mois. Belle évolution sur la plupart des axes !",
        choices: null
    },
    {
        slideType: "final",
        text: "Que souhaitez-vous faire maintenant ?",
        speechText: "Que souhaitez-vous faire maintenant ?",
        choices: [
            { label: "Télécharger le report", action: "download", url: null },
            { label: "Lire les 5 tips pour m'améliorer", action: "tips", url: null }
        ]
    }
];

// ============================================
// SCENARIO: EQUIPE
// ============================================
const DATA_EQUIPE = {
    report: {
        trainee: { name: "Alexandre", role: "Manager Commercial" },
        date: "29 janvier 2026",
        generatedBy: "Metagora"
    },
    rank: { grade: "B", label: "Team Dynamique" },
    stats: {
        simulations: 24,
        salesSuccess: 18,
        activeDays: 12,
        listeningScore: 78
    },
    screeneLabels: ["Security", "Comfort", "Relational", "Ego", "Economy", "Novelty", "Ecology"],
    scoresOnboarding: [45, 52, 38, 60, 55, 42, 48],
    scoresAfter1Month: [72, 68, 75, 62, 78, 70, 50]
};

const NARRATIVE_EQUIPE = [
    {
        slideType: "rank",
        text: "Bonjour <span class='highlight'>Alexandre</span> ! Voici le bilan de votre magasin sur les parcours de simulation de vente. Votre équipe a atteint le <span class='highlight'>Rang B</span> : <span class='highlight'>Team Dynamique</span>. Un excellent point de départ !",
        speechText: "Bonjour Alexandre ! Voici le bilan de votre magasin sur les parcours de simulation de vente. Votre équipe a atteint le Rang B : Team Dynamique. Un excellent point de départ !",
        choices: null
    },
    {
        slideType: "stats",
        text: "En <span class='highlight'>12 jours actifs</span>, votre équipe a réalisé <span class='highlight'>24 simulations</span> avec <span class='highlight'>18 ventes réussies</span>. Le score d'écoute active est de <span class='highlight'>78/100</span>, ce qui montre une vraie capacité d'adaptation de votre équipe.",
        speechText: "En 12 jours actifs, votre équipe a réalisé 24 simulations avec 18 ventes réussies. Le score d'écoute active est de 78 sur 100, ce qui montre une vraie capacité d'adaptation de votre équipe.",
        choices: null
    },
    {
        slideType: "radar",
        text: "Voici le profil <span class='highlight'>SCREENE</span> de votre équipe. La ligne rose représente leur niveau en début de mois lors de l'<span class='highlight'>Onboarding RMS</span>. La ligne bleue montre leur progression après <span class='highlight'>1 mois</span>. Belle évolution sur la plupart des axes !",
        speechText: "Voici le profil SCREENE de votre équipe. La ligne rose représente leur niveau en début de mois lors de l'Onboarding RMS. La ligne bleue montre leur progression après 1 mois. Belle évolution sur la plupart des axes !",
        choices: null
    },
    {
        slideType: "final",
        text: "Que souhaitez-vous faire maintenant ?",
        speechText: "Que souhaitez-vous faire maintenant ?",
        choices: [
            { label: "Télécharger le report", action: "download", url: null },
            { label: "Lire les 5 tips pour m'améliorer", action: "tips", url: null }
        ]
    }
];

// ============================================
// ACCESSORS (used by other modules)
// ============================================
function getScenarioData() {
    return CURRENT_SCENARIO === 'equipe' ? DATA_EQUIPE : DATA_INDIVIDUEL;
}

function getScenarioNarrative() {
    return CURRENT_SCENARIO === 'equipe' ? NARRATIVE_EQUIPE : NARRATIVE_INDIVIDUEL;
}

// Legacy accessors for backward compatibility
const SCREENE_LABELS = DATA_INDIVIDUEL.screeneLabels;
const SCORES_ONBOARDING = DATA_INDIVIDUEL.scoresOnboarding;
const SCORES_AFTER_1_MONTH = DATA_INDIVIDUEL.scoresAfter1Month;
const REPORT_DATA = DATA_INDIVIDUEL.report;

// NARRATIVE is now dynamic - accessed via getScenarioNarrative()
const NARRATIVE = NARRATIVE_INDIVIDUEL;

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
