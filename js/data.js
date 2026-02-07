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
                simNumber: 14,
                front: {
                    context: "Le client cherchait un cadeau pour sa compagne.",
                    yourResponse: "C'est pour offrir ? Prenez de l'or, ça fait toujours plaisir.",
                    diagnostic: "Réponse directive et réductrice qui ignore les goûts du destinataire"
                },
                back: {
                    idealResponse: "C'est pour offrir ? Pouvez-vous me parler un peu de la personne ? Ses goûts, ce qu'elle porte habituellement ?",
                    justification: "Montre de l'empathie et permet de faire une recommandation pertinente."
                }
            },
            {
                phase: "Objections",
                simNumber: 9,
                front: {
                    context: "Le client hésite devant un bracelet en série limitée.",
                    yourResponse: "Si vous ne le prenez pas maintenant, il risque de ne plus être disponible demain.",
                    diagnostic: "Pression artificielle qui génère de la méfiance"
                },
                back: {
                    idealResponse: "Cette pièce est effectivement en série limitée. Si vous le souhaitez, je peux la mettre de côté 48h le temps que vous décidiez sereinement.",
                    justification: "Informe sans presser, et offre une solution concrète qui rassure."
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
        text: "Passons à votre <span class='highlight'>Intelligence Émotionnelle</span>. En phase Présentation, votre score est de <span class='highlight'>82%</span>, et en Objections <span class='highlight'>78%</span>. C'est encourageant ! Pour aller plus loin, voyons ce que vous pouvez améliorer.",
        speechText: "Passons à votre Intelligence Émotionnelle. En phase Présentation, votre score est de 82%, et en Objections 78%. C'est encourageant ! Pour aller plus loin, voyons ce que vous pouvez améliorer.",
        choices: null,
        subSteps: true
    },
    {
        slideType: "radar",
        text: "Voici votre profil <span class='highlight'>Vendeur SCREENE</span>. La ligne rose représente votre évaluation à l'<span class='highlight'>Onboarding</span>, la ligne bleue votre progression après <span class='highlight'>1 mois</span>. Belle évolution sur la plupart des axes !",
        speechText: "Voici votre profil Vendeur Scriiine. La ligne rose représente votre évaluation à l'Onboarding, la ligne bleue votre progression après 1 mois. Belle évolution sur la plupart des axes !",
        choices: null
    },
    {
        slideType: "final",
        text: "Que souhaitez-vous faire maintenant ?",
        speechText: "Que souhaitez-vous faire maintenant ?",
        choices: [
            { label: "Télécharger le rapport", action: "download", url: null },
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
        simulations: 66,
        salesSuccess: 54,
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
        text: "En <span class='highlight'>12 jours actifs</span>, votre équipe a réalisé <span class='highlight'>66 simulations</span> avec <span class='highlight'>54 ventes réussies</span>. Le score d'écoute active est de <span class='highlight'>78/100</span>, ce qui montre une vraie capacité d'adaptation de votre équipe.",
        speechText: "En 12 jours actifs, votre équipe a réalisé 66 simulations avec 54 ventes réussies. Le score d'écoute active est de 78 sur 100, ce qui montre une vraie capacité d'adaptation de votre équipe.",
        choices: null
    },
    {
        slideType: "radar",
        text: "Voici le profil <span class='highlight'>SCREENE</span> de votre équipe. La ligne rose représente leur niveau en début de mois lors de l'<span class='highlight'>Onboarding RMS</span>. La ligne bleue montre leur progression après <span class='highlight'>1 mois</span>. Belle évolution sur la plupart des axes !",
        speechText: "Voici le profil Scriiine de votre équipe. La ligne rose représente leur niveau en début de mois lors de l'Onboarding R.M.S. La ligne bleue montre leur progression après 1 mois. Belle évolution sur la plupart des axes !",
        choices: null
    },
    {
        slideType: "final",
        text: "Que souhaitez-vous faire maintenant ?",
        speechText: "Que souhaitez-vous faire maintenant ?",
        choices: [
            { label: "Télécharger le rapport", action: "download", url: null },
            { label: "Lire les 3 tips pour mon équipe", action: "tips", url: null }
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
    cacheVersion: "v2"
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
