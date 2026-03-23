// JavaScript dla strony pamiec-ram.html

document.addEventListener('DOMContentLoaded', function() {
    console.log('Strona pamięci RAM załadowana');
    
    // Inicjalizacja kalkulatora RAM
    setupRamCalculator();
    
    // Inicjalizacja zakładek rekomendacji
    setupRecommendationTabs();
    
    // Inicjalizacja efektów interaktywnych
    setupInteractiveElements();
    
    // Automatyczne obliczenie przy załadowaniu
    setTimeout(() => {
        calculateRamNeeds();
    }, 500);
});

function setupRamCalculator() {
    const usageSelect = document.getElementById('usage-type');
    const ramAmountSelect = document.getElementById('ram-amount');
    const futureProofSelect = document.getElementById('future-proof');
    const calculateBtn = document.getElementById('calculate-ram');
    const ramValue = document.querySelector('.ram-value');
    const speedValue = document.querySelector('.speed-value');
    
    // Obliczanie potrzeb RAM
    function calculateRamNeeds() {
        const usage = usageSelect.value;
        const currentRam = parseInt(ramAmountSelect.value);
        const futureYears = parseInt(futureProofSelect.value);
        
        // Zliczanie zaznaczonych programów
        const programCheckboxes = document.querySelectorAll('input[name="program"]:checked');
        const programCount = programCheckboxes.length;
        
        // Podstawowe zapotrzebowanie w zależności od użycia
        let baseRam = 8; // Minimalnie
        
        switch(usage) {
            case 'basic':
                baseRam = 8;
                break;
            case 'gaming':
                baseRam = 16;
                break;
            case 'creative':
                baseRam = 32;
                break;
            case 'workstation':
                baseRam = 64;
                break;
            case 'server':
                baseRam = 128;
                break;
        }
        
        // Dodatkowe RAM dla programów
        let programRam = 0;
        programCheckboxes.forEach(checkbox => {
            switch(checkbox.value) {
                case 'chrome':
                    programRam += 4;
                    break;
                case 'office':
                    programRam += 2;
                    break;
                case 'photoshop':
                    programRam += 8;
                    break;
                case 'premiere':
                    programRam += 16;
                    break;
                case 'blender':
                    programRam += 16;
                    break;
                case 'vm':
                    programRam += 32;
                    break;
            }
        });
        
        // Future-proofing
        const futureMultiplier = 1 + (futureYears * 0.15); // 15% więcej na każdy rok
        
        // Obliczanie całkowitego zapotrzebowania
        let totalRam = Math.max(baseRam, programRam) * futureMultiplier;
        
        // Zaokrąglanie do standardowych wartości
        const standardValues = [8, 16, 32, 64, 128];
        let recommendedRam = standardValues[0];
        
        for (let value of standardValues) {
            if (value >= totalRam) {
                recommendedRam = value;
                break;
            }
        }
        
        // Jeśli użytkownik ma już więcej niż rekomendowane, sugeruję upgrade tylko jeśli potrzebuje
        if (currentRam >= recommendedRam && currentRam < 128) {
            recommendedRam = currentRam * 2; // Podwojenie obecnej ilości
            // Ale nie więcej niż 128GB
            recommendedRam = Math.min(recommendedRam, 128);
        }
        
        // Wybór prędkości RAM
        let recommendedSpeed = '3200 MHz';
        if (recommendedRam >= 64) {
            recommendedSpeed = '3600 MHz';
        }
        if (usage === 'server') {
            recommendedSpeed = '2666 MHz ECC';
        }
        
        // Aktualizacja wyników z animacją
        animateRamResult(recommendedRam, ramValue);
        setTimeout(() => {
            speedValue.textContent = recommendedSpeed;
            speedValue.style.opacity = '0';
            speedValue.style.transform = 'scale(0.8)';
            speedValue.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                speedValue.style.opacity = '1';
                speedValue.style.transform = 'scale(1)';
            }, 50);
        }, 500);
        
        // Aktualizacja listy rekomendacji
        updateRecommendationList(recommendedRam);
        
        return recommendedRam;
    }
    
    function animateRamResult(targetValue, element) {
        const currentText = element.textContent;
        const currentValue = parseInt(currentText) || 8;
        
        if (currentValue === targetValue) return;
        
        const duration = 1000;
        const steps = 20;
        const stepValue = (targetValue - currentValue) / steps;
        const stepTime = duration / steps;
        
        let currentStep = 0;
        
        const animate = () => {
            if (currentStep < steps) {
                const newValue = Math.round(currentValue + (stepValue * currentStep));
                element.textContent = `${newValue} GB`;
                currentStep++;
                setTimeout(animate, stepTime);
            } else {
                element.textContent = `${targetValue} GB`;
            }
        };
        
        animate();
    }
    
    function updateRecommendationList(recommendedRam) {
        const recList = document.querySelector('.rec-list');
        const standardValues = [8, 16, 32, 64, 128];
        let minRam = Math.max(8, recommendedRam / 2);
        let optimalRam = Math.min(recommendedRam * 1.5, 128);
        
        // Znajdź najbliższe standardowe wartości
        minRam = standardValues.find(val => val >= minRam) || 8;
        optimalRam = standardValues.find(val => val >= optimalRam) || 128;
        
        recList.innerHTML = `
            <li><i class="fas fa-check-circle"></i> <strong>Minimalnie:</strong> ${minRam} GB</li>
            <li><i class="fas fa-star"></i> <strong>Rekomendowane:</strong> ${recommendedRam} GB</li>
            <li><i class="fas fa-rocket"></i> <strong>Optymalnie:</strong> ${optimalRam} GB</li>
        `;
    }
    
    // Obsługa przycisku obliczania
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculateRamNeeds();
            
            // Animacja przycisku
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Automatyczne przeliczanie przy zmianie opcji
    const inputs = [usageSelect, ramAmountSelect, futureProofSelect];
    inputs.forEach(input => {
        input.addEventListener('change', calculateRamNeeds);
    });
    
    // Obsługa checkboxów programów
    const programCheckboxes = document.querySelectorAll('input[name="program"]');
    programCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateRamNeeds);
    });
}

function setupRecommendationTabs() {
    const tabButtons = document.querySelectorAll('.rec-tab-btn');
    const tabContents = document.querySelectorAll('.rec-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Usuwamy aktywną klasę ze wszystkich przycisków i zawartości
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Dodajemy aktywną klasę do klikniętego przycisku
            this.classList.add('active');
            
            // Pokazujemy odpowiednią zawartość
            const targetTab = document.getElementById(`rec-${category}`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

function setupInteractiveElements() {
    // Efekty dla kart typów RAM
    const typeCards = document.querySelectorAll('.type-card');
    typeCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Efekt hover dla ikon
        const icon = card.querySelector('.type-icon');
        if (icon) {
            card.addEventListener('mouseenter', function() {
                icon.style.transform = 'rotate(15deg) scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                icon.style.transform = 'rotate(0) scale(1)';
            });
        }
    });
    
    // Efekty dla kart timingów
    const timingCards = document.querySelectorAll('.timing-card');
    timingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const timingValue = this.querySelector('h3');
            if (timingValue) {
                timingValue.style.color = '#4361ee';
                timingValue.style.transition = 'color 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const timingValue = this.querySelector('h3');
            if (timingValue) {
                timingValue.style.color = '#4cc9f0';
            }
        });
    });
    
    // Efekty dla kart modeli RAM
    const ramCards = document.querySelectorAll('.ram-model-card');
    ramCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Efekt dla nagłówka
        const header = card.querySelector('.ram-model-header');
        if (header) {
            card.addEventListener('mouseenter', function() {
                header.style.background = 'linear-gradient(135deg, #4361ee, #4cc9f0)';
            });
            
            card.addEventListener('mouseleave', function() {
                header.style.background = 'linear-gradient(135deg, #4cc9f0, #4361ee)';
            });
        }
        
        // Efekt dla konfiguracji
        const config = card.querySelector('.ram-config');
        if (config) {
            card.addEventListener('mouseenter', function() {
                config.style.transform = 'scale(1.2)';
                config.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                config.style.transform = 'scale(1)';
            });
        }
    });
    
    // Interaktywna tabela timingów
    const tableRows = document.querySelectorAll('.timings-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f0f8ff';
            this.style.transition = 'background-color 0.3s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
        
        // Kliknięcie w wiersz pokazuje więcej informacji
        row.addEventListener('click', function() {
            const cells = this.querySelectorAll('td');
            if (cells.length >= 4) {
                const speed = cells[0].textContent;
                const timing = cells[1].textContent;
                const recommendation = cells[2].textContent;
                
                showTimingDetails(speed, timing, recommendation);
            }
        });
    });
}

function showTimingDetails(speed, timing, recommendation) {
    // Tworzymy modal z informacjami
    const modal = document.createElement('div');
    modal.className = 'timing-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Szczegóły timingów</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="detail-item">
                    <strong>Prędkość:</strong> ${speed}
                </div>
                <div class="detail-item">
                    <strong>Timing:</strong> ${timing}
                </div>
                <div class="detail-item">
                    <strong>Rekomendacja:</strong> ${recommendation}
                </div>
                <div class="performance-info">
                    <h4>Wpływ na wydajność:</h4>
                    <p>Niższe wartości CL oznaczają mniejsze opóźnienia, co przekłada się na lepszą wydajność w aplikacjach wrażliwych na opóźnienia (gaming, aplikacje biurowe).</p>
                    <p>Wyższe taktowanie kompensuje wyższe opóźnienia w aplikacjach wymagających dużej przepustowości (renderowanie, kompilacja).</p>
                </div>
            </div>
        </div>
    `;
    
    // Styl dla modala
    const style = document.createElement('style');
    style.textContent = `
        .timing-details-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .timing-details-modal .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            padding: 30px;
            position: relative;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f8ff;
        }
        
        .modal-header h3 {
            color: #1a1a2e;
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            line-height: 1;
        }
        
        .detail-item {
            margin-bottom: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        
        .detail-item strong {
            color: #1a1a2e;
        }
        
        .performance-info {
            margin-top: 20px;
            padding: 15px;
            background: #f0f8ff;
            border-radius: 8px;
        }
        
        .performance-info h4 {
            color: #1a1a2e;
            margin-bottom: 10px;
        }
        
        .performance-info p {
            color: #666;
            line-height: 1.5;
            margin-bottom: 10px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Obsługa zamknięcia modala
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
        style.remove();
    });
    
    // Kliknięcie poza modalem zamyka go
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            modal.remove();
            style.remove();
        }
    });
}

// Dodatkowa funkcja - symulacja testu wydajności
function simulateRamPerformanceTest() {
    const testResults = document.createElement('div');
    testResults.className = 'performance-test-results';
    testResults.innerHTML = `
        <h3>Symulacja testu wydajności RAM</h3>
        <div class="test-progress">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">Testowanie...</div>
        </div>
        <div class="test-results" style="display: none;">
            <div class="result-item">
                <span>Prędkość odczytu:</span>
                <span class="result-value">48000 MB/s</span>
            </div>
            <div class="result-item">
                <span>Opóźnienia:</span>
                <span class="result-value">68 ns</span>
            </div>
            <div class="result-item">
                <span>Ocena wydajności:</span>
                <span class="result-value">8.5/10</span>
            </div>
        </div>
    `;
    
    // Dodajemy przed sekcją rekomendacji
    const recommendationsSection = document.querySelector('.ram-recommendations');
    if (recommendationsSection) {
        recommendationsSection.parentNode.insertBefore(testResults, recommendationsSection);
    }
    
    // Styl dla testu
    const testStyle = document.createElement('style');
    testStyle.textContent = `
        .performance-test-results {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            margin-bottom: 40px;
            text-align: center;
        }
        
        .performance-test-results h3 {
            color: #1a1a2e;
            margin-bottom: 20px;
        }
        
        .test-progress {
            margin: 30px 0;
        }
        
        .progress-bar {
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 10px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4cc9f0, #4361ee);
            border-radius: 10px;
            width: 0%;
            transition: width 2s ease-out;
        }
        
        .progress-text {
            color: #666;
            font-size: 0.9rem;
        }
        
        .test-results {
            margin-top: 20px;
            animation: fadeIn 0.5s ease;
        }
        
        .result-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px dashed #eee;
        }
        
        .result-item:last-child {
            border-bottom: none;
        }
        
        .result-value {
            font-weight: bold;
            color: #4cc9f0;
        }
    `;
    
    document.head.appendChild(testStyle);
    
    // Symulacja progresu testu
    setTimeout(() => {
        const progressFill = testResults.querySelector('.progress-fill');
        const progressText = testResults.querySelector('.progress-text');
        const testResultsDiv = testResults.querySelector('.test-results');
        
        // Animacja paska progresu
        progressFill.style.width = '100%';
        
        // Zmiana tekstu podczas testu
        const texts = [
            'Inicjalizacja testu...',
            'Testowanie prędkości odczytu...',
            'Testowanie opóźnień...',
            'Obliczanie wyników...',
            'Test zakończony!'
        ];
        
        let textIndex = 0;
        const textInterval = setInterval(() => {
            if (textIndex < texts.length) {
                progressText.textContent = texts[textIndex];
                textIndex++;
            } else {
                clearInterval(textInterval);
                
                // Pokazanie wyników
                setTimeout(() => {
                    testResultsDiv.style.display = 'block';
                    progressText.textContent = 'Test wydajności zakończony';
                }, 500);
            }
        }, 400);
    }, 1000);
}

// Opcjonalnie: dodaj przycisk do uruchomienia testu wydajności
document.addEventListener('DOMContentLoaded', function() {
    // Dodajemy przycisk testu po załadowaniu strony
    setTimeout(() => {
        const testButton = document.createElement('button');
        testButton.className = 'btn-calc';
        testButton.innerHTML = '<i class="fas fa-running"></i> Uruchom test wydajności RAM';
        testButton.style.marginTop = '20px';
        testButton.style.width = 'auto';
        testButton.style.display = 'inline-block';
        testButton.style.padding = '12px 25px';
        
        testButton.addEventListener('click', function() {
            simulateRamPerformanceTest();
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-check"></i> Test w trakcie...';
        });
        
        // Dodajemy przycisk po kalkulatorze
        const calculatorSection = document.querySelector('.ram-calculator');
        if (calculatorSection) {
            calculatorSection.appendChild(testButton);
        }
    }, 2000);
});