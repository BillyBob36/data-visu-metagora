/* ============================================
   CYBERMETEO - CHART INITIALIZATION
   Radar chart configuration
   ============================================ */

function getRadarLabels() {
    return [
        getUIText('indEndpoint'),
        getUIText('indIpRep'),
        getUIText('indCubit'),
        getUIText('indHacker'),
        getUIText('indInfoLeak'),
        getUIText('indSocialEng'),
        getUIText('indPatching'),
        getUIText('indDns'),
        getUIText('indAppSec'),
        getUIText('indNetwork')
    ];
}

function initRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    // Destroy existing chart if any
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();

    // Get company scores from indicators
    const companyScores = INDICATORS.map(ind => ind.score);

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: getRadarLabels(),
            datasets: [
                {
                    label: REPORT_DATA.company.name,
                    data: companyScores,
                    borderColor: '#FFC107',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#FFC107',
                    pointRadius: 2,
                    tension: 0.3
                },
                {
                    label: getUIText('industryAverage') || 'Moyenne industrie',
                    data: REPORT_DATA.industry.averages,
                    borderColor: '#00D4FF',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#00D4FF',
                    pointRadius: 2,
                    tension: 0.3,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#A0A0A0',
                        font: {
                            family: "'JetBrains Mono', monospace",
                            size: 9
                        },
                        boxWidth: 10,
                        padding: 10
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
                    borderColor: '#E87B35',
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
                        font: { size: 7 }
                    },
                    pointLabels: {
                        color: '#A0A0A0',
                        font: {
                            family: "'JetBrains Mono', monospace",
                            size: 8
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
