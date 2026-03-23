// gaming.js - JavaScript dla strony gaming

document.addEventListener('DOMContentLoaded', function() {
    console.log('Strona gaming załadowana');
    
    // Inicjalizacja filtrów benchmarków
    setupBenchmarkFilters();
    
    // Inicjalizacja kart konfiguracji
    setupSetupCards();
    
    // Inicjalizacja porad
    setupTipsInteraction();
    
    // Inicjalizacja newsów
    setupNewsCards();
});

function setupBenchmarkFilters() {
    const filterButtons = document.querySelectorAll('.benchmark-filter');
    const benchmarkCards = document.querySelectorAll('.benchmark-card');
    
    // Dane benchmarków dla różnych rozdzielczości
    const benchmarkData = {
        '1080p': {
            0: {
                title: "Cyberpunk 2077",
                results: [
                    { gpu: "RTX 4090", fps: 95, percent: 95 },
                    { gpu: "RTX 4080", fps: 78, percent: 78 },
                    { gpu: "RX 7900 XTX", fps: 82, percent: 82 }
                ]
            },
            1: {
                title: "Call of Duty: Warzone",
                results: [
                    { gpu: "RTX 4090", fps: 240, percent: 100 },
                    { gpu: "RTX 4070", fps: 180, percent: 75 },
                    { gpu: "RX 7800 XT", fps: 170, percent: 71 }
                ]
            },
            2: {
                title: "Baldur's Gate 3",
                results: [
                    { gpu: "RTX 4090", fps: 120, percent: 100 },
                    { gpu: "RTX 4070 Ti", fps: 90, percent: 75 },
                    { gpu: "RX 7700 XT", fps: 78, percent: 65 }
                ]
            }
        },
        '1440p': {
            0: {
                title: "Cyberpunk 2077",
                results: [
                    { gpu: "RTX 4090", fps: 72, percent: 90 },
                    { gpu: "RTX 4080", fps: 58, percent: 72 },
                    { gpu: "RX 7900 XTX", fps: 61, percent: 76 }
                ]
            },
            1: {
                title: "Call of Duty: Warzone",
                results: [
                    { gpu: "RTX 4090", fps: 190, percent: 100 },
                    { gpu: "RTX 4070", fps: 140, percent: 74 },
                    { gpu: "RX 7800 XT", fps: 135, percent: 71 }
                ]
            },
            2: {
                title: "Baldur's Gate 3",
                results: [
                    { gpu: "RTX 4090", fps: 95, percent: 100 },
                    { gpu: "RTX 4070 Ti", fps: 70, percent: 74 },
                    { gpu: "RX 7700 XT", fps: 62, percent: 65 }
                ]
            }
        },
        '4k': {
            0: {
                title: "Cyberpunk 2077",
                results: [
                    { gpu: "RTX 4090", fps: 48, percent: 100 },
                    { gpu: "RTX 4080", fps: 35, percent: 73 },
                    { gpu: "RX 7900 XTX", fps: 38, percent: 79 }
                ]
            },
            1: {
                title: "Call of Duty: Warzone",
                results: [
                    { gpu: "RTX 4090", fps: 120, percent: 100 },
                    { gpu: "RTX 4070", fps: 85, percent: 71 },
                    { gpu: "RX 7800 XT", fps: 82, percent: 68 }
                ]
            },
            2: {
                title: "Baldur's Gate 3",
                results: [
                    { gpu: "RTX 4090", fps: 65, percent: 100 },
                    { gpu: "RTX 4070 Ti", fps: 48, percent: 74 },
                    { gpu: "RX 7700 XT", fps: 42, percent: 65 }
                ]
            }
        }
    };
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Usuń aktywną klasę
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Dodaj aktywną klasę
            this.classList.add('active');
            
            const resolution = this.getAttribute('data-resolution');
            console.log('Zmieniono rozdzielczość na:', resolution);
            
            // Aktualizuj benchmarki
            updateBenchmarks(resolution);
        });
    });
    
    function updateBenchmarks(resolution) {
        const data = benchmarkData[resolution];
        if (!data) return;
        
        benchmarkCards.forEach((card, index) => {
            const gameData = data[index];
            if (!gameData) return;
            
            // Aktualizuj tytuł
            const titleElement = card.querySelector('.benchmark-header h3');
            if (titleElement) {
                titleElement.textContent = gameData.title;
            }
            
            // Aktualizuj wyniki
            const gpuResults = card.querySelectorAll('.gpu-result');
            gpuResults.forEach((result, resultIndex) => {
                const gpuData = gameData.results[resultIndex];
                if (!gpuData) return;
                
                // Aktualizuj nazwę GPU
                const gpuName = result.querySelector('.gpu-name');
                if (gpuName) {
                    gpuName.textContent = gpuData.gpu;
                }
                
                // Aktualizuj pasek FPS
                const fpsBar = result.querySelector('.fps-bar');
                const fpsValue = result.querySelector('.fps-value');
                
                if (fpsBar && fpsValue) {
                    fpsBar.style.width = `${gpuData.percent}%`;
                    
                    // Różne formaty FPS
                    if (gpuData.fps >= 200) {
                        fpsValue.textContent = `${gpuData.fps}+ FPS`;
                    } else if (gpuData.fps >= 100) {
                        fpsValue.textContent = `${gpuData.fps} FPS`;
                    } else {
                        fpsValue.textContent = `${gpuData.fps} FPS`;
                    }
                    
                    // Zmień kolor paska w zależności od FPS
                    if (gpuData.fps >= 60) {
                        fpsBar.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
                    } else if (gpuData.fps >= 30) {
                        fpsBar.style.background = 'linear-gradient(90deg, #FF9800, #FFC107)';
                    } else {
                        fpsBar.style.background = 'linear-gradient(90deg, #F44336, #FF5722)';
                    }
                }
            });
        });
    }
}

function setupSetupCards() {
    const setupCards = document.querySelectorAll('.setup-card');
    
    setupCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Podświetlanie karty
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
            
            // Animacja ikon
            const icons = this.querySelectorAll('.spec-item i');
            icons.forEach(icon => {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
            
            const icons = this.querySelectorAll('.spec-item i');
            icons.forEach(icon => {
                icon.style.transform = 'scale(1)';
            });
        });
        
        // Kliknięcie pokazuje więcej informacji
        card.addEventListener('click', function() {
            const type = this.classList.contains('budget') ? 'budget' : 
                        this.classList.contains('midrange') ? 'midrange' : 'high-end';
            
            showSetupDetails(type);
        });
    });
}

function showSetupDetails(type) {
    const setupDetails = {
        'budget': {
            title: "Budget Gaming PC (~4000 zł)",
            description: "Idealny zestaw dla graczy zaczynających przygodę z PC gamingiem lub mających ograniczony budżet.",
            components: [
                "Procesor: AMD Ryzen 5 7600 - około 900 zł",
                "Karta graficzna: NVIDIA RTX 4060 8GB - około 1500 zł",
                "Płyta główna: B650 - około 600 zł",
                "RAM: 16GB DDR5 6000MHz - około 400 zł",
                "Dysk: 1TB NVMe PCIe 4.0 - około 300 zł",
                "Zasilacz: 650W 80+ Bronze - około 350 zł",
                "Obudowa: Mid Tower z wentylatorami - około 300 zł",
                "Chłodzenie CPU: Boxowe (w zestawie z CPU)"
            ],
            performance: [
                "1080p Ultra: 60+ FPS w większości gier",
                "1080p Competitive: 144+ FPS w e-sport",
                "1440p Medium-High: 60 FPS",
                "Ray Tracing: Ograniczony (DLSS pomocny)"
            ],
            recommendations: [
                "Dodaj drugi moduł RAM do dual channel",
                "Rozważ RTX 4060 Ti dla lepszego ray tracingu",
                "AMD RX 7600 to alternatywa dla RTX 4060"
            ]
        },
        'midrange': {
            title: "Mid-Range Gaming PC (~7000 zł)",
            description: "Najlepszy stosunek ceny do wydajności. Zestaw dla graczy chcących grać w 1440p z wysokimi detalami.",
            components: [
                "Procesor: AMD Ryzen 7 7800X3D - około 1800 zł",
                "Karta graficzna: NVIDIA RTX 4070 Super 12GB - około 3000 zł",
                "Płyta główna: B650E - około 900 zł",
                "RAM: 32GB DDR5 6000MHz CL30 - około 700 zł",
                "Dysk: 2TB NVMe PCIe 4.0 - około 500 zł",
                "Zasilacz: 750W 80+ Gold - około 500 zł",
                "Obudowa: Premium z dobrą wentylacją - około 500 zł",
                "Chłodzenie: AIO 240mm - około 400 zł"
            ],
            performance: [
                "1440p Ultra: 100+ FPS w większości gier",
                "1440p Competitive: 200+ FPS w e-sport",
                "4K High: 60+ FPS z DLSS",
                "Ray Tracing: Bardzo dobry z DLSS 3"
            ],
            recommendations: [
                "RTX 4070 Ti Super dla jeszcze lepszej wydajności",
                "Rozważ monitor 1440p 144Hz+",
                "AMD RX 7900 GRE to dobra alternatywa"
            ]
        },
        'high-end': {
            title: "High-End Gaming PC (12000+ zł)",
            description: "Ekstremalna wydajność dla graczy wymagających najlepszego. 4K gaming z maksymalnymi ustawieniami.",
            components: [
                "Procesor: Intel i9-14900K / AMD Ryzen 9 7950X3D - około 2500 zł",
                "Karta graficzna: NVIDIA RTX 4090 24GB - około 7000+ zł",
                "Płyta główna: Z790 / X670E - około 1500 zł",
                "RAM: 32-64GB DDR5 6400MHz - około 1000-2000 zł",
                "Dysk: 4TB NVMe PCIe 5.0 - około 1200 zł",
                "Zasilacz: 1000W+ 80+ Platinum - około 1000 zł",
                "Obudowa: Full Tower premium - około 800 zł",
                "Chłodzenie: Custom loop / AIO 360mm - około 1000+ zł"
            ],
            performance: [
                "4K Ultra: 120+ FPS z DLSS 3",
                "4K Native: 60+ FPS w większości gier",
                "1440p: 240+ FPS (limit monitora)",
                "Ray Tracing: Maksymalny bez kompromisów",
                "8K Gaming: Możliwy z DLSS Performance"
            ],
            recommendations: [
                "Monitor 4K 144Hz+ OLED/IPS",
                "Rozważ RTX 4080 Super dla lepszego stosunku ceny",
                "Custom loop dla najlepszego chłodzenia i estetyki"
            ]
        }
    };
    
    const details = setupDetails[type];
    if (!details) return;
    
    // Tworzymy modal z informacjami
    const modal = document.createElement('div');
    modal.className = 'setup-details-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${details.title}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h4><i class="fas fa-info-circle"></i> Opis</h4>
                    <p>${details.description}</p>
                </div>
                
                <div class="modal-section">
                    <h4><i class="fas fa-list-ul"></i> Komponenty i ceny</h4>
                    <div class="components-list">
                        ${details.components.map(comp => `<div class="component-item">${comp}</div>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h4><i class="fas fa-tachometer-alt"></i> Wydajność</h4>
                    <div class="performance-list">
                        ${details.performance.map(perf => `<div class="performance-item">✓ ${perf}</div>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h4><i class="fas fa-lightbulb"></i> Rekomendacje</h4>
                    <div class="recommendations-list">
                        ${details.recommendations.map(rec => `<div class="recommendation-item">💡 ${rec}</div>`).join('')}
                    </div>
                </div>
                
                <div class="modal-note">
                    <p><i class="fas fa-exclamation-triangle"></i> Ceny są orientacyjne i mogą się zmieniać. Sprawdź aktualne ceny przed zakupem.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Styl dla modala
    const style = document.createElement('style');
    style.textContent = `
        .setup-details-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        }
        
        .setup-details-modal .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 30px;
            animation: slideUp 0.4s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f8ff;
        }
        
        .modal-header h3 {
            color: #1a1a2e;
            margin: 0;
            font-size: 1.5rem;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            line-height: 1;
        }
        
        .modal-section {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .modal-section h4 {
            color: #1a1a2e;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .components-list,
        .performance-list,
        .recommendations-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .component-item,
        .performance-item,
        .recommendation-item {
            padding: 10px 15px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #4cc9f0;
        }
        
        .modal-note {
            background: #fff3e0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #ff9800;
            margin-top: 20px;
        }
        
        .modal-note p {
            color: #666;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Obsługa zamknięcia
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            modal.remove();
            style.remove();
        }
    });
    
    // ESC zamyka modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.querySelector('.setup-details-modal')) {
            modal.remove();
            style.remove();
        }
    });
}

function setupTipsInteraction() {
    const tipCards = document.querySelectorAll('.tip-card');
    
    tipCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            
            showTipDetails(title, description);
        });
    });
    
    function showTipDetails(title, description) {
        // Tworzymy małe okienko z informacjami
        const tooltip = document.createElement('div');
        tooltip.className = 'tip-tooltip';
        
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>${title}</h4>
                <p>${description}</p>
                <button class="tooltip-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Styl
        const style = document.createElement('style');
        style.textContent = `
            .tip-tooltip {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 1000;
                animation: slideInRight 0.3s ease;
                max-width: 350px;
                padding: 20px;
            }
            
            .tooltip-content {
                position: relative;
            }
            
            .tooltip-content h4 {
                color: #1a1a2e;
                margin-bottom: 10px;
                font-size: 1.2rem;
            }
            
            .tooltip-content p {
                color: #666;
                line-height: 1.5;
                margin: 0;
            }
            
            .tooltip-close {
                position: absolute;
                top: -10px;
                right: -10px;
                background: #4cc9f0;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                font-size: 1.2rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        // Zamknięcie
        tooltip.querySelector('.tooltip-close').addEventListener('click', function() {
            tooltip.remove();
            style.remove();
        });
        
        // Auto zamknięcie po 5 sekundach
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
                style.remove();
            }
        }, 5000);
    }
}

function setupNewsCards() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        // Animacja hover
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('img');
            if (image) {
                image.style.transform = 'scale(1.05)';
                image.style.transition = 'transform 0.5s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
        
        // Kliknięcie pokazuje więcej informacji
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            const date = this.querySelector('.news-date').textContent;
            
            showNewsDetails(title, description, date);
        });
    });
    
    function showNewsDetails(title, description, date) {
        // Tutaj można dodać modal z pełnymi informacjami o newsie
        console.log('News details:', { title, description, date });
        
        // Dla uproszczenia pokażemy tylko alert
        alert(`${title}\n\n${description}\n\n${date}`);
    }
}

// Dodatkowa funkcja - symulator FPS
function createFpsSimulator() {
    const simulator = document.createElement('div');
    simulator.className = 'fps-simulator';
    simulator.innerHTML = `
        <div class="simulator-content">
            <h3><i class="fas fa-gamepad"></i> Symulator FPS</h3>
            <div class="simulator-controls">
                <div class="control-group">
                    <label>Rozdzielczość:</label>
                    <select id="sim-resolution">
                        <option value="1080">1080p</option>
                        <option value="1440">1440p</option>
                        <option value="2160">4K</option>
                    </select>
                </div>
                <div class="control-group">
                    <label>Ustawienia grafiki:</label>
                    <select id="sim-settings">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                        <option value="ultra">Ultra</option>
                        <option value="rt">Ultra + RT</option>
                    </select>
                </div>
                <div class="control-group">
                    <label>Karta graficzna:</label>
                    <select id="sim-gpu">
                        <option value="4060">RTX 4060</option>
                        <option value="4070">RTX 4070</option>
                        <option value="4080">RTX 4080</option>
                        <option value="4090">RTX 4090</option>
                        <option value="7600">RX 7600</option>
                        <option value="7800">RX 7800 XT</option>
                        <option value="7900">RX 7900 XTX</option>
                    </select>
                </div>
            </div>
            <div class="simulator-result">
                <h4>Szacowany FPS:</h4>
                <div class="fps-display" id="fps-result">-- FPS</div>
                <div class="fps-status" id="fps-status"></div>
            </div>
            <button class="btn-simulate">Symuluj</button>
        </div>
    `;
    
    // Dodaj przed sekcją porad
    const tipsSection = document.querySelector('.gaming-tips');
    if (tipsSection) {
        tipsSection.parentNode.insertBefore(simulator, tipsSection);
    }
    
    // Styl
    const style = document.createElement('style');
    style.textContent = `
        .fps-simulator {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin: 40px 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .simulator-content h3 {
            color: #1a1a2e;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .simulator-controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .control-group label {
            font-weight: 600;
            color: #1a1a2e;
        }
        
        .control-group select {
            padding: 10px 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .control-group select:focus {
            outline: none;
            border-color: #4cc9f0;
        }
        
        .simulator-result {
            text-align: center;
            margin: 25px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .fps-display {
            font-size: 3rem;
            font-weight: bold;
            color: #4cc9f0;
            margin: 15px 0;
        }
        
        .fps-status {
            font-size: 0.9rem;
            color: #666;
        }
        
        .btn-simulate {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #4cc9f0, #4361ee);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-simulate:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(67, 97, 238, 0.3);
        }
    `;
    
    document.head.appendChild(style);
    
    // Logika symulatora
    const btnSimulate = simulator.querySelector('.btn-simulate');
    const fpsResult = document.getElementById('fps-result');
    const fpsStatus = document.getElementById('fps-status');
    
    btnSimulate.addEventListener('click', function() {
        const resolution = document.getElementById('sim-resolution').value;
        const settings = document.getElementById('sim-settings').value;
        const gpu = document.getElementById('sim-gpu').value;
        
        // Prosta symulacja FPS
        let baseFps = 100;
        
        // Modyfikatory rozdzielczości
        if (resolution === '1080') baseFps *= 1;
        if (resolution === '1440') baseFps *= 0.65;
        if (resolution === '2160') baseFps *= 0.35;
        
        // Modyfikatory ustawień
        if (settings === 'low') baseFps *= 1.5;
        if (settings === 'medium') baseFps *= 1;
        if (settings === 'high') baseFps *= 0.8;
        if (settings === 'ultra') baseFps *= 0.65;
        if (settings === 'rt') baseFps *= 0.4;
        
        // Modyfikatory GPU
        const gpuMultipliers = {
            '4060': 0.7, '4070': 1, '4080': 1.4, '4090': 2,
            '7600': 0.65, '7800': 1.1, '7900': 1.5
        };
        baseFps *= (gpuMultipliers[gpu] || 1);
        
        const finalFps = Math.round(baseFps);
        fpsResult.textContent = `${finalFps} FPS`;
        
        // Status
        if (finalFps >= 144) {
            fpsStatus.textContent = "✅ Płynna rozgrywka na monitorach 144Hz+";
            fpsResult.style.color = '#4CAF50';
        } else if (finalFps >= 60) {
            fpsStatus.textContent = "✅ Wystarczająco dla płynnej rozgrywki";
            fpsResult.style.color = '#4cc9f0';
        } else if (finalFps >= 30) {
            fpsStatus.textContent = "⚠️ Granicznie płynnie, rozważ obniżenie ustawień";
            fpsResult.style.color = '#FF9800';
        } else {
            fpsStatus.textContent = "❌ Za mało FPS, konieczne obniżenie ustawień";
            fpsResult.style.color = '#F44336';
        }
        
        // Animacja
        fpsResult.style.transform = 'scale(1.1)';
        setTimeout(() => {
            fpsResult.style.transform = 'scale(1)';
        }, 300);
    });
}

// Inicjalizacja symulatora po załadowaniu
setTimeout(() => {
    createFpsSimulator();
}, 1000);