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

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: SCREENE_LABELS,
            datasets: [
                {
                    label: 'Après 1 mois',
                    data: SCORES_AFTER_1_MONTH,
                    borderColor: '#312478',
                    backgroundColor: 'rgba(49, 36, 120, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#312478',
                    pointRadius: 3,
                    tension: 0.1
                },
                {
                    label: 'Onboarding',
                    data: SCORES_ONBOARDING,
                    borderColor: '#A21463',
                    backgroundColor: 'rgba(162, 20, 99, 0.15)',
                    borderWidth: 2,
                    pointBackgroundColor: '#A21463',
                    pointRadius: 3,
                    tension: 0.1,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Vendeur SCREENE',
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
                        color: '#A0A0A0',
                        font: {
                            family: "'JetBrains Mono', monospace",
                            size: 10
                        }
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
