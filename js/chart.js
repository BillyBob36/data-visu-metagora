/* ============================================
   BILANMETAGORA - CHART INITIALIZATION
   Radar chart configuration - SCREENE 7 branches
   ============================================ */

function initRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    // Destroy existing chart if any
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();

    // Get scenario-aware data
    const data = getScenarioData();
    const labels = data.screeneLabels || SCREENE_LABELS;
    const scoresAfter = data.scoresAfter1Month || SCORES_AFTER_1_MONTH;
    const scoresOnboard = data.scoresOnboarding || SCORES_ONBOARDING;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Après 1 mois',
                    data: scoresAfter,
                    borderColor: '#6B5FFF',
                    backgroundColor: 'rgba(107, 95, 255, 0.25)',
                    borderWidth: 4,
                    pointBackgroundColor: '#6B5FFF',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.1
                },
                {
                    label: 'Onboarding',
                    data: scoresOnboard,
                    borderColor: '#FF1493',
                    backgroundColor: 'rgba(255, 20, 147, 0.2)',
                    borderWidth: 4,
                    pointBackgroundColor: '#FF1493',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.1,
                    borderDash: [8, 4]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: CURRENT_SCENARIO === 'equipe' ? 'Équipe SCREENE' : 'Vendeur SCREENE',
                    color: '#A21463',
                    font: {
                        family: "'JetBrains Mono', monospace",
                        size: 14,
                        weight: 'bold'
                    },
                    padding: { bottom: 10 }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#A0A0A0',
                        font: {
                            family: "'JetBrains Mono', monospace",
                            size: 10
                        },
                        boxWidth: 12,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    titleFont: {
                        family: "'JetBrains Mono', monospace",
                        size: 11
                    },
                    bodyFont: {
                        family: "'Inter', sans-serif",
                        size: 11
                    },
                    borderColor: '#A21463',
                    borderWidth: 1,
                    padding: 10
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 25,
                        color: '#666666',
                        backdropColor: 'transparent',
                        font: { size: 8 }
                    },
                    pointLabels: {
                        color: '#FFFFFF',
                        font: {
                            family: "'JetBrains Mono', monospace",
                            size: window.innerWidth <= 600 ? 9 : 12,
                            weight: 'bold'
                        },
                        padding: window.innerWidth <= 600 ? 10 : 15
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}
