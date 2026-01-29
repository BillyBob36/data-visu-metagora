/* ============================================
   CYBERMETEO - DATA CONFIGURATION
   ============================================ */

// Company and report data
const REPORT_DATA = {
    company: {
        name: "FILHET-ALLARD SA",
        domain: "filhetallard.com",
        contact: "Bertrand",
        contactRole: "responsable de la sécurité"
    },
    report: {
        date: "11 octobre 2021",
        generatedBy: "SecurityScorecard"
    },
    score: {
        value: 82,
        grade: "B",
        label: "Bonne Protection"
    },
    industry: {
        name: "Financial Services",
        averages: [70, 85, 75, 70, 85, 65, 80, 75, 70, 90]
    }
};

// Threat indicators data
const INDICATORS = [
    { id: "endpoint", name: "Endpoint Security", score: 100, grade: "A", desc: "Niveau de sécurité des postes de travail" },
    { id: "ip_rep", name: "IP Reputation", score: 100, grade: "A", desc: "Activités suspectes détectées sur le réseau" },
    { id: "cubit", name: "Cubit Score", score: 100, grade: "A", desc: "Implémentation des bonnes pratiques" },
    { id: "hacker", name: "Hacker Chatter", score: 100, grade: "A", desc: "Surveillance des discussions hackers" },
    { id: "info_leak", name: "Information Leak", score: 100, grade: "A", desc: "Fuites d'informations confidentielles" },
    { id: "social", name: "Social Engineering", score: 100, grade: "A", desc: "Sensibilisation au phishing" },
    { id: "patching", name: "Patching Cadence", score: 92, grade: "A", desc: "Mises à jour des systèmes" },
    { id: "dns", name: "DNS Health", score: 90, grade: "A", desc: "Configuration DNS sécurisée" },
    { id: "app_sec", name: "Application Security", score: 79, grade: "C", desc: "Vulnérabilités applicatives" },
    { id: "network", name: "Network Security", score: 49, grade: "F", desc: "Paramètres réseau non sécurisés" }
];

// Vulnerabilities data
const VULNERABILITIES = {
    openPorts: 1,
    siteVulnerabilities: 19,
    malwareDiscovered: 0,
    leakedInformation: 0
};

// Narrative texts with proper French accents
const NARRATIVE = [
    {
        text: "Bonjour <span class='highlight'>Bertrand</span>, en tant que responsable de la sécurité chez <span class='highlight'>FILHET-ALLARD SA</span>, il nous semble pertinent de vous partager le résultat de notre audit flash. Votre score global est de <span class='highlight'>82/100</span>, grade <span class='highlight'>B</span>.",
        speechText: "Bonjour Bertrand, en tant que responsable de la sécurité chez FILHET-ALLARD SA, il nous semble pertinent de vous partager le résultat de notre audit flash. Votre score global est de 82 sur 100, grade B.",
        choices: null
    },
    {
        text: "Excellente nouvelle ! Vous avez <span class='highlight'>8 indicateurs au niveau A</span> : Endpoint Security, IP Reputation, Cubit Score, Hacker Chatter, Information Leak, Social Engineering, Patching Cadence et DNS Health.",
        speechText: "Excellente nouvelle ! Vous avez 8 indicateurs au niveau A : Endpoint Security, IP Reputation, Cubit Score, Hacker Chatter, Information Leak, Social Engineering, Patching Cadence et DNS Health.",
        choices: null
    },
    {
        text: "Points d'attention : <span class='highlight'>Network Security (49/F)</span> nécessite une action urgente. <span class='highlight'>19 vulnérabilités</span> détectées sur vos sites et <span class='highlight'>1 port ouvert</span>. Aucun malware ni fuite détectés.",
        speechText: "Points d'attention : Network Security avec un score de 49 sur 100 et un grade F nécessite une action urgente. 19 vulnérabilités détectées sur vos sites et 1 port ouvert. Aucun malware ni fuite détectés.",
        choices: null
    },
    {
        text: "Voici votre positionnement face au secteur <span class='highlight'>Financial Services</span>. Vous surpassez l'industrie sur la majorité des critères.",
        speechText: "Voici votre positionnement face au secteur Financial Services. Vous surpassez l'industrie sur la majorité des critères.",
        choices: null
    },
    {
        text: "Que souhaitez-vous faire maintenant ?",
        speechText: "Que souhaitez-vous faire maintenant ?",
        choices: [
            { label: "En savoir plus sur SecurityScorecard", action: "learn", url: "https://securityscorecard.com" },
            { label: "Discuter avec un expert", action: "expert", url: "https://calendly.com" },
            { label: "Télécharger le rapport d'audit", action: "download", url: null }
        ]
    }
];

// API Configuration
// NOTE: Change endpoint to your deployed cybermeteo-api URL on Coolify
const API_CONFIG = {
    endpoint: "https://cybermeteo-api.lamidetlm.com",
    voice: "alloy",
    cacheKey: "cybermeteo_audio_cache",
    cacheVersion: "v5"
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
