// karty-graficzne.js - JavaScript dla strony kart graficznych

document.addEventListener('DOMContentLoaded', function() {
    console.log('Strona kart graficznych załadowana');
    
    // Inicjalizacja zakładek porównania
    setupComparisonTabs();
    
    // Inicjalizacja selektora GPU
    setupGpuSelector();
    
    // Inicjalizacja FAQ
    setupFAQ();
    
    // Inicjalizacja interaktywnych elementów
    setupInteractiveCards();
});

function setupComparisonTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Usuń aktywną klasę ze wszystkich przycisków
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Dodaj aktywną klasę do klikniętego
            this.classList.add('active');
            
            // Ukryj wszystkie zawartości
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
            });
            
            // Pokaż wybraną zawartość
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
                
                // Animacja pojawiania się
                setTimeout(() => {
                    targetTab.style.opacity = '1';
                    targetTab.style.transform = 'translateY(0)';
                    targetTab.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                }, 10);
            }
            
            // Jeśli to tabela porównawcza, dodaj efekty
            if (tabId === 'comparison') {
                setTimeout(() => {
                    highlightComparisonTable();
                }, 300);
            }
        });
    });
}

function highlightComparisonTable() {
    const tableRows = document.querySelectorAll('.comparison-table tbody tr');
    
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

function setupGpuSelector() {
    const budgetOptions = document.querySelectorAll('.budget-option');
    const resolutionOptions = document.querySelectorAll('.resolution-option');
    const techOptions = document.querySelectorAll('.tech-option');
    const restartBtn = document.querySelector('.btn-restart');
    const compareBtn = document.querySelector('.btn-compare');
    
    let userSelections = {
        budget: null,
        resolution: null,
        tech: null
    };
    
    // Obsługa wyboru budżetu
    budgetOptions.forEach(option => {
        option.addEventListener('click', function() {
            const budget = this.getAttribute('data-budget');
            
            // Usuń wybór z innych opcji
            budgetOptions.forEach(opt => opt.classList.remove('selected'));
            // Zaznacz wybraną opcję
            this.classList.add('selected');
            
            userSelections.budget = budget;
            console.log('Wybrano budżet:', budget);
            
            // Przejdź do następnego kroku
            goToNextStep('step-1', 'step-2');
        });
    });
    
    // Obsługa wyboru rozdzielczości
    resolutionOptions.forEach(option => {
        option.addEventListener('click', function() {
            const resolution = this.getAttribute('data-resolution');
            
            resolutionOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            userSelections.resolution = resolution;
            console.log('Wybrano rozdzielczość:', resolution);
            
            goToNextStep('step-2', 'step-3');
        });
    });
    
    // Obsługa wyboru technologii
    techOptions.forEach(option => {
        option.addEventListener('click', function() {
            const tech = this.getAttribute('data-tech');
            
            techOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            userSelections.tech = tech;
            console.log('Wybrano technologię:', tech);
            
            // Przejdź do wyników
            goToNextStep('step-3', 'step-results');
            
            // Wyświetl rekomendację
            setTimeout(() => {
                showGpuRecommendation(userSelections);
            }, 500);
        });
    });
    
    // Restart selektora
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            resetSelector();
        });
    }
    
    // Porównanie
    if (compareBtn) {
        compareBtn.addEventListener('click', function() {
            showComparisonModal(userSelections);
        });
    }
    
    function goToNextStep(currentStepId, nextStepId) {
        const currentStep = document.getElementById(currentStepId);
        const nextStep = document.getElementById(nextStepId);
        
        if (currentStep && nextStep) {
            // Animacja wyjścia obecnego kroku
            currentStep.style.opacity = '0';
            currentStep.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
                
                // Animacja wejścia następnego kroku
                nextStep.style.opacity = '0';
                nextStep.style.transform = 'translateX(20px)';
                
                setTimeout(() => {
                    nextStep.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    nextStep.style.opacity = '1';
                    nextStep.style.transform = 'translateX(0)';
                }, 10);
            }, 300);
        }
    }
    
    function resetSelector() {
        // Reset wyborów
        userSelections = { budget: null, resolution: null, tech: null };
        
        // Reset UI
        const allOptions = document.querySelectorAll('.budget-option, .resolution-option, .tech-option');
        allOptions.forEach(opt => opt.classList.remove('selected'));
        
        const allSteps = document.querySelectorAll('.selector-step');
        allSteps.forEach(step => step.classList.remove('active'));
        
        // Wróć do pierwszego kroku
        const firstStep = document.getElementById('step-1');
        if (firstStep) {
            firstStep.classList.add('active');
            firstStep.style.opacity = '1';
            firstStep.style.transform = 'translateX(0)';
        }
    }
    
    function showGpuRecommendation(selections) {
        console.log('Generowanie rekomendacji dla:', selections);
        
        // Baza danych rekomendacji
        const recommendations = {
            // Budget: low, mid, high, ultra
            // Resolution: 1080, 1440, 4k
            // Tech: rt, stream, productivity, value
            
            'low-1080-value': {
                gpu: "RX 7600",
                brand: "AMD",
                price: "~1200 zł",
                reason: "Najlepsza wartość w segmencie budget. Doskonała do 1080p gaming.",
                performance: "1080p Ultra: 60+ FPS",
                alternatives: ["RTX 4060", "Arc A770"]
            },
            
            'mid-1440-rt': {
                gpu: "RTX 4070 Super",
                brand: "NVIDIA",
                price: "~3200 zł",
                reason: "Doskonały ray tracing, DLSS 3, idealna do 1440p gaming z RT.",
                performance: "1440p Ultra + RT: 60+ FPS",
                alternatives: ["RX 7800 XT", "RTX 4070"]
            },
            
            'high-4k-stream': {
                gpu: "RTX 4080 Super",
                brand: "NVIDIA",
                price: "~5200 zł",
                reason: "NVIDIA Encoder dla streamingu, DLSS 3.5, wydajność 4K.",
                performance: "4K Ultra: 80+ FPS",
                alternatives: ["RX 7900 XTX", "RTX 4090"]
            },
            
            'ultra-4k-rt': {
                gpu: "RTX 4090",
                brand: "NVIDIA",
                price: "~8000 zł",
                reason: "Najlepsza karta na rynku. Maksymalna wydajność 4K z RT.",
                performance: "4K Ultra + RT: 100+ FPS",
                alternatives: ["RX 7900 XTX (lepsza cena)"]
            },
            
            'mid-1440-value': {
                gpu: "RX 7800 XT",
                brand: "AMD",
                price: "~2800 zł",
                reason: "Najlepszy stosunek ceny do wydajności w 1440p. 16GB VRAM.",
                performance: "1440p Ultra: 90+ FPS",
                alternatives: ["RTX 4070", "RX 7700 XT"]
            }
        };
        
        // Generuj klucz dla rekomendacji
        const key = `${selections.budget || 'mid'}-${selections.resolution || '1440'}-${selections.tech || 'value'}`;
        const recommendation = recommendations[key] || recommendations['mid-1440-value'];
        
        // Aktualizuj wyniki
        updateRecommendationDisplay(recommendation);
    }
    
    function updateRecommendationDisplay(recommendation) {
        const resultCard = document.querySelector('.result-card');
        if (!resultCard) return;
        
        // Aktualizuj nagłówek
        const header = resultCard.querySelector('.result-header');
        const brandDiv = header.querySelector('.result-brand');
        const title = header.querySelector('h4');
        
        // Ustaw markę
        brandDiv.className = recommendation.brand === 'NVIDIA' ? 'result-brand nvidia-brand' : 'result-brand amd-brand';
        brandDiv.innerHTML = `<i class="fas fa-microchip"></i><span>${recommendation.brand}</span>`;
        
        // Ustaw tytuł
        title.textContent = recommendation.gpu;
        
        // Aktualizuj powód
        const reason = resultCard.querySelector('.result-reason p');
        if (reason) {
            reason.innerHTML = `<strong>Dlaczego ta karta:</strong> ${recommendation.reason}`;
        }
        
        // Aktualizuj specyfikacje
        const specs = resultCard.querySelectorAll('.result-spec');
        if (specs.length >= 2) {
            specs[0].querySelector('.spec-value').textContent = recommendation.price;
            specs[1].querySelector('.spec-value').textContent = recommendation.performance;
        }
        
        // Animacja
        resultCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            resultCard.style.transition = 'transform 0.3s ease';
            resultCard.style.transform = 'scale(1)';
        }, 10);
    }
    
    function showComparisonModal(selections) {
        // Tworzymy modal z porównaniem
        const modal = document.createElement('div');
        modal.className = 'comparison-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-balance-scale"></i> Porównanie alternatyw</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="comparison-alternatives">
                        <div class="alternative-card">
                            <div class="alternative-header nvidia">
                                <h4>NVIDIA RTX 4070 Super</h4>
                                <span class="alternative-price">~3200 zł</span>
                            </div>
                            <div class="alternative-pros-cons">
                                <div class="pros">
                                    <h5>Zalety:</h5>
                                    <ul>
                                        <li>Doskonały ray tracing</li>
                                        <li>DLSS 3 z Frame Generation</li>
                                        <li>NVIDIA Broadcast dla streamingu</li>
                                        <li>Niski pobór mocy</li>
                                    </ul>
                                </div>
                                <div class="cons">
                                    <h5>Wady:</h5>
                                    <ul>
                                        <li>Tylko 12GB VRAM</li>
                                        <li>Wyższa cena niż konkurencja</li>
                                        <li>FSR 3 gorszy niż DLSS 3</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="alternative-card">
                            <div class="alternative-header amd">
                                <h4>AMD RX 7800 XT</h4>
                                <span class="alternative-price">~2800 zł</span>
                            </div>
                            <div class="alternative-pros-cons">
                                <div class="pros">
                                    <h5>Zalety:</h5>
                                    <ul>
                                        <li>16GB VRAM (przyszłościowo)</li>
                                        <li>Lepsza cena</li>
                                        <li>FSR 3 działa na wszystkich GPU</li>
                                        <li>Dobra wydajność raster</li>
                                    </ul>
                                </div>
                                <div class="cons">
                                    <h5>Wady:</h5>
                                    <ul>
                                        <li>Słabszy ray tracing</li>
                                        <li>Brak Frame Generation w wielu grach</li>
                                        <li>Wyższy pobór mocy</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="comparison-verdict">
                        <h4>Werdykt:</h4>
                        <p>Jeśli <strong>ray tracing i streaming</strong> są dla Ciebie ważne - wybierz NVIDIA. Jeśli zależy Ci na <strong>cenie i przyszłym proofingu</strong> (więcej VRAM) - wybierz AMD.</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Styl
        const style = document.createElement('style');
        style.textContent = `
            .comparison-modal {
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
            
            .comparison-modal .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                padding: 30px;
                animation: slideUp 0.4s ease;
            }
            
            .comparison-alternatives {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 30px;
                margin: 25px 0;
            }
            
            .alternative-card {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 25px;
                border-top: 4px solid transparent;
            }
            
            .alternative-card:nth-child(1) {
                border-top-color: #76B900;
            }
            
            .alternative-card:nth-child(2) {
                border-top-color: #ED1C24;
            }
            
            .alternative-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid rgba(0,0,0,0.1);
            }
            
            .alternative-header.nvidia h4 {
                color: #76B900;
            }
            
            .alternative-header.amd h4 {
                color: #ED1C24;
            }
            
            .alternative-price {
                background: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-weight: bold;
                color: #1a1a2e;
            }
            
            .alternative-pros-cons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            
            .pros h5, .cons h5 {
                color: #1a1a2e;
                margin-bottom: 10px;
            }
            
            .pros ul, .cons ul {
                list-style: none;
                padding-left: 0;
            }
            
            .pros li {
                padding: 5px 0;
                padding-left: 20px;
                position: relative;
                color: #4CAF50;
            }
            
            .pros li:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #4CAF50;
                font-weight: bold;
            }
            
            .cons li {
                padding: 5px 0;
                padding-left: 20px;
                position: relative;
                color: #F44336;
            }
            
            .cons li:before {
                content: "✗";
                position: absolute;
                left: 0;
                color: #F44336;
                font-weight: bold;
            }
            
            .comparison-verdict {
                background: #f0f8ff;
                padding: 20px;
                border-radius: 8px;
                margin-top: 25px;
                border-left: 4px solid #4cc9f0;
            }
            
            .comparison-verdict h4 {
                color: #1a1a2e;
                margin-bottom: 10px;
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
            if (e.key === 'Escape' && document.querySelector('.comparison-modal')) {
                modal.remove();
                style.remove();
            }
        });
    }
}

function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Zamknij wszystkie inne
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Przełącz aktualny
            faqItem.classList.toggle('active');
            
            // Jeśli otwieramy, przewiń do pytania
            if (!isActive) {
                setTimeout(() => {
                    faqItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });
    });
}

function setupInteractiveCards() {
    // Interaktywne karty GPU
    const gpuCards = document.querySelectorAll('.gpu-card');
    
    gpuCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const performanceBar = this.querySelector('.bar-fill');
            if (performanceBar) {
                const width = performanceBar.style.width;
                performanceBar.style.width = '0%';
                
                setTimeout(() => {
                    performanceBar.style.transition = 'width 1s ease';
                    performanceBar.style.width = width;
                }, 10);
            }
        });
        
        // Kliknięcie pokazuje szczegóły
        card.addEventListener('click', function() {
            const gpuName = this.querySelector('h3').textContent;
            const brand = this.classList.contains('nvidia') ? 'NVIDIA' : 'AMD';
            
            showGpuDetails(gpuName, brand, this);
        });
    });
    
    // Karty technologii
    const techCards = document.querySelectorAll('.tech-card');
    
    techCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'rotate(15deg) scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'rotate(0) scale(1)';
            }
        });
    });
}

function showGpuDetails(gpuName, brand, cardElement) {
    // Dane szczegółowe dla kart
    const gpuDetails = {
        'RTX 4090': {
            description: "Flagiowy produkt NVIDIA. Najpotężniejsza karta graficzna na rynku konsumenckim.",
            gaming: "4K @ 120+ FPS, 8K możliwe z DLSS",
            rayTracing: "3rd Gen RT Cores - najlepsze na rynku",
            features: ["DLSS 3", "Reflex", "Broadcast", "AV1 Encoder"],
            bestFor: ["4K gaming", "Ray tracing", "Profesjonalne zastosowania"],
            power: "450W TDP, wymaga 850W+ PSU"
        },
        'RX 7900 XTX': {
            description: "Flagiowa karta AMD. Doskonały stosunek ceny do wydajności w high-end.",
            gaming: "4K @ 80-100 FPS, 1440p @ 144+ FPS",
            rayTracing: "2nd Gen Ray Accelerators - bardzo dobre",
            features: ["FSR 3", "Smart Access Memory", "AV1 Codec"],
            bestFor: ["1440p/4K gaming", "Produktywność", "Streaming"],
            power: "355W TDP, wymaga 750W+ PSU"
        },
        'RTX 4080 Super': {
            description: "Premium mid-range od NVIDIA. Doskonały wybór dla graczy 4K.",
            gaming: "4K @ 80+ FPS z DLSS, 1440p @ 144+ FPS",
            rayTracing: "Full ray tracing support",
            features: ["DLSS 3.5", "Frame Generation", "Reflex"],
            bestFor: ["4K gaming z RT", "Streaming", "VR"],
            power: "320W TDP, wymaga 750W PSU"
        },
        'RX 7800 XT': {
            description: "Najlepsza wartość w segmencie 1440p. 16GB VRAM dla przyszłych gier.",
            gaming: "1440p @ 90+ FPS, 4K @ 60 FPS",
            rayTracing: "Dobre w wspieranych grach",
            features: ["FSR 3", "16GB VRAM", "AMD Fluid Motion Frames"],
            bestFor: ["1440p gaming", "Future-proof", "Budżet 4K"],
            power: "263W TDP, wymaga 650W PSU"
        }
    };
    
    const details = gpuDetails[gpuName] || {
        description: "Szczegóły techniczne tej karty graficznej.",
        gaming: "Wydajność gamingowa zależna od zastosowań",
        rayTracing: "Wsparcie ray tracingu zależne od modelu",
        features: ["Standardowe funkcje GPU"],
        bestFor: ["Ogólne zastosowania gamingowe"],
        power: "Sprawdź specyfikację producenta"
    };
    
    // Tworzymy modal
    const modal = document.createElement('div');
    modal.className = 'gpu-details-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-brand ${brand.toLowerCase()}">
                    <i class="fas fa-microchip"></i>
                    <span>${brand}</span>
                </div>
                <h3>${gpuName}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h4><i class="fas fa-info-circle"></i> Opis</h4>
                    <p>${details.description}</p>
                </div>
                
                <div class="modal-grid">
                    <div class="modal-item">
                        <h5><i class="fas fa-gamepad"></i> Gaming</h5>
                        <p>${details.gaming}</p>
                    </div>
                    <div class="modal-item">
                        <h5><i class="fas fa-sun"></i> Ray Tracing</h5>
                        <p>${details.rayTracing}</p>
                    </div>
                    <div class="modal-item">
                        <h5><i class="fas fa-bolt"></i> Pobór mocy</h5>
                        <p>${details.power}</p>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h4><i class="fas fa-star"></i> Najlepsze dla</h4>
                    <div class="best-for-list">
                        ${details.bestFor.map(item => `<span class="best-for-tag">${item}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h4><i class="fas fa-cogs"></i> Funkcje</h4>
                    <div class="features-list">
                        ${details.features.map(feature => `<div class="feature-item">✓ ${feature}</div>`).join('')}
                    </div>
                </div>
                
                <div class="modal-note">
                    <p><i class="fas fa-lightbulb"></i> Kliknij na inne karty aby porównać różne modele.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Styl dla modala
    const style = document.createElement('style');
    style.textContent = `
        .gpu-details-modal {
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
        
        .gpu-details-modal .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 30px;
            animation: slideIn 0.4s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f8ff;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .modal-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: 600;
        }
        
        .modal-brand.nvidia {
            background: rgba(118, 185, 0, 0.1);
            color: #76B900;
        }
        
        .modal-brand.amd {
            background: rgba(237, 28, 36, 0.1);
            color: #ED1C24;
        }
        
        .modal-header h3 {
            color: #1a1a2e;
            margin: 0;
            font-size: 1.5rem;
            flex: 1;
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
        }
        
        .modal-section h4 {
            color: #1a1a2e;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .modal-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin: 25px 0;
        }
        
        .modal-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
        }
        
        .modal-item h5 {
            color: #1a1a2e;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .best-for-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .best-for-tag {
            background: #e6f7ff;
            color: #4cc9f0;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        .features-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .feature-item {
            padding: 10px 15px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 3px solid #4cc9f0;
        }
        
        .modal-note {
            background: #fff3e0;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #ff9800;
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
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
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
        if (e.key === 'Escape' && document.querySelector('.gpu-details-modal')) {
            modal.remove();
            style.remove();
        }
    });
}

// Dodatkowa funkcja - symulator obciążenia GPU
function createGpuLoadSimulator() {
    const simulator = document.createElement('div');
    simulator.className = 'gpu-load-simulator';
    simulator.innerHTML = `
        <div class="simulator-content">
            <h3><i class="fas fa-chart-line"></i> Symulator obciążenia GPU</h3>
            <div class="simulator-controls">
                <div class="control-group">
                    <label>Rozdzielczość:</label>
                    <div class="resolution-slider">
                        <span>1080p</span>
                        <input type="range" id="resolution-slider" min="1" max="3" value="2" step="1">
                        <span>4K</span>
                    </div>
                </div>
                <div class="control-group">
                    <label>Ustawienia grafiki:</label>
                    <div class="settings-slider">
                        <span>Low</span>
                        <input type="range" id="settings-slider" min="1" max="5" value="3" step="1">
                        <span>Ultra+RT</span>
                    </div>
                </div>
                <div class="control-group">
                    <label>Karta graficzna:</label>
                    <select id="load-gpu">
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
            <div class="simulator-results">
                <div class="result-meters">
                    <div class="meter">
                        <div class="meter-label">Obciążenie GPU</div>
                        <div class="meter-bar">
                            <div class="meter-fill" id="gpu-load">0%</div>
                        </div>
                    </div>
                    <div class="meter">
                        <div class="meter-label">Wykorzystanie VRAM</div>
                        <div class="meter-bar">
                            <div class="meter-fill" id="vram-usage">0%</div>
                        </div>
                    </div>
                    <div class="meter">
                        <div class="meter-label">Temperatura</div>
                        <div class="meter-bar">
                            <div class="meter-fill" id="temp-meter">0°C</div>
                        </div>
                    </div>
                </div>
                <div class="result-status" id="load-status">Gotowy do symulacji</div>
            </div>
            <button class="btn-simulate-load">Uruchom symulację</button>
        </div>
    `;
    
    // Dodaj przed FAQ
    const faqSection = document.querySelector('.gpu-faq');
    if (faqSection) {
        faqSection.parentNode.insertBefore(simulator, faqSection);
    }
    
    // Styl
    const simStyle = document.createElement('style');
    simStyle.textContent = `
        .gpu-load-simulator {
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
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .resolution-slider,
        .settings-slider {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .resolution-slider span,
        .settings-slider span {
            color: #666;
            font-size: 0.9rem;
            min-width: 60px;
        }
        
        input[type="range"] {
            flex: 1;
            height: 6px;
            -webkit-appearance: none;
            background: #e9ecef;
            border-radius: 3px;
            outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: #4cc9f0;
            border-radius: 50%;
            cursor: pointer;
        }
        
        .simulator-results {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
        }
        
        .result-meters {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .meter {
            text-align: center;
        }
        
        .meter-label {
            color: #666;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .meter-bar {
            height: 30px;
            background: #e9ecef;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .meter-fill {
            height: 100%;
            background: linear-gradient(90deg, #4cc9f0, #4361ee);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
            transition: width 2s ease;
            min-width: 60px;
        }
        
        .result-status {
            text-align: center;
            color: #666;
            font-weight: 600;
            padding: 10px;
            background: white;
            border-radius: 8px;
        }
        
        .btn-simulate-load {
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
        
        .btn-simulate-load:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(67, 97, 238, 0.3);
        }
    `;
    
    document.head.appendChild(simStyle);
    
    // Logika symulatora
    const btnSimulate = simulator.querySelector('.btn-simulate-load');
    const gpuLoad = document.getElementById('gpu-load');
    const vramUsage = document.getElementById('vram-usage');
    const tempMeter = document.getElementById('temp-meter');
    const loadStatus = document.getElementById('load-status');
    
    btnSimulate.addEventListener('click', function() {
        const resolution = parseInt(document.getElementById('resolution-slider').value);
        const settings = parseInt(document.getElementById('settings-slider').value);
        const gpu = document.getElementById('load-gpu').value;
        
        // Oblicz obciążenie
        let baseLoad = 30;
        
        // Modyfikatory
        if (resolution === 1) baseLoad += 20; // 1080p
        if (resolution === 2) baseLoad += 40; // 1440p
        if (resolution === 3) baseLoad += 60; // 4K
        
        if (settings === 1) baseLoad += 10; // Low
        if (settings === 2) baseLoad += 20; // Medium
        if (settings === 3) baseLoad += 35; // High
        if (settings === 4) baseLoad += 50; // Ultra
        if (settings === 5) baseLoad += 70; // Ultra+RT
        
        // Modyfikatory GPU
        const gpuCapacities = {
            '4060': 0.7, '4070': 0.9, '4080': 1.2, '4090': 1.5,
            '7600': 0.65, '7800': 1.0, '7900': 1.3
        };
        
        const capacity = gpuCapacities[gpu] || 1;
        const finalLoad = Math.min(100, Math.round(baseLoad / capacity));
        const vramLoad = Math.min(100, Math.round(finalLoad * 1.2));
        const temp = 30 + Math.round(finalLoad * 0.5);
        
        // Animacja liczników
        animateMeter(gpuLoad, finalLoad, '%');
        animateMeter(vramUsage, vramLoad, '%');
        animateMeter(tempMeter, temp, '°C');
        
        // Status
        if (finalLoad >= 95) {
            loadStatus.textContent = "⚠️ GPU przy maksymalnym obciążeniu - bottleneck!";
            loadStatus.style.color = '#F44336';
        } else if (finalLoad >= 80) {
            loadStatus.textContent = "⚡ Wysokie obciążenie - dobra wydajność";
            loadStatus.style.color = '#FF9800';
        } else if (finalLoad >= 60) {
            loadStatus.textContent = "✅ Optymalne obciążenie - idealne ustawienia";
            loadStatus.style.color = '#4CAF50';
        } else {
            loadStatus.textContent = "ℹ️ Niskie obciążenie - możesz zwiększyć ustawienia";
            loadStatus.style.color = '#2196F3';
        }
        
        // Animacja przycisku
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    function animateMeter(element, targetValue, unit) {
        let currentValue = parseInt(element.textContent.replace(unit, '')) || 0;
        const duration = 2000;
        const steps = 40;
        const increment = (targetValue - currentValue) / steps;
        const stepTime = duration / steps;
        
        let step = 0;
        
        const animate = () => {
            if (step < steps) {
                currentValue += increment;
                element.style.width = `${currentValue}%`;
                element.textContent = `${Math.round(currentValue)}${unit}`;
                step++;
                setTimeout(animate, stepTime);
            } else {
                element.style.width = `${targetValue}%`;
                element.textContent = `${targetValue}${unit}`;
            }
        };
        
        animate();
    }
}

// Dodaj symulator po załadowaniu
setTimeout(() => {
    createGpuLoadSimulator();
}, 1500);