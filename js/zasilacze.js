// JavaScript dla strony zasilacze.html

document.addEventListener('DOMContentLoaded', function() {
    console.log('Strona zasilaczy załadowana');
    
    // Inicjalizacja kalkulatora mocy
    setupPowerCalculator();
    
    // Inicjalizacja zakładek rekomendacji
    setupRecommendationTabs();
    
    // Inicjalizacja efektów interaktywnych
    setupInteractiveElements();
});

function setupPowerCalculator() {
    const cpuSelect = document.getElementById('cpu-power');
    const gpuSelect = document.getElementById('gpu-power');
    const ramSlider = document.getElementById('ram-count');
    const ramValue = document.getElementById('ram-value');
    const ssdSlider = document.getElementById('ssd-count');
    const ssdValue = document.getElementById('ssd-value');
    const hddSlider = document.getElementById('hdd-count');
    const hddValue = document.getElementById('hdd-value');
    const fansSlider = document.getElementById('fans-count');
    const fansValue = document.getElementById('fans-value');
    const overclockCheckbox = document.getElementById('overclock');
    const calculateBtn = document.getElementById('calculate-power');
    const powerValue = document.querySelector('.power-value');
    const recValue = document.querySelector('.rec-value');
    const efficiencyBadges = document.querySelectorAll('.efficiency-badge');
    
    // Aktualizacja wartości suwaków
    const sliders = [
        { slider: ramSlider, value: ramValue, text: 'moduły' },
        { slider: ssdSlider, value: ssdValue, text: 'dyski' },
        { slider: hddSlider, value: hddValue, text: 'dyski' },
        { slider: fansSlider, value: fansValue, text: 'wentylatory' }
    ];
    
    sliders.forEach(item => {
        if (item.slider && item.value) {
            item.slider.addEventListener('input', function() {
                item.value.textContent = `${this.value} ${item.text}`;
            });
        }
    });
    
    // Obsługa znaczników efektywności
    efficiencyBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            efficiencyBadges.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Obliczanie mocy
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            // Pobieranie wartości z formularza
            const cpuPower = parseInt(cpuSelect.value) || 95;
            const gpuPower = parseInt(gpuSelect.value) || 150;
            const ramCount = parseInt(ramSlider.value) || 2;
            const ssdCount = parseInt(ssdSlider.value) || 1;
            const hddCount = parseInt(hddSlider.value) || 0;
            const fansCount = parseInt(fansSlider.value) || 3;
            const overclock = overclockCheckbox.checked;
            
            // Obliczenia mocy dla komponentów
            let totalPower = 0;
            
            // CPU
            totalPower += cpuPower;
            
            // GPU
            totalPower += gpuPower;
            
            // RAM (5W na moduł)
            totalPower += ramCount * 5;
            
            // SSD (5W na dysk)
            totalPower += ssdCount * 5;
            
            // HDD (10W na dysk)
            totalPower += hddCount * 10;
            
            // Wentylatory (3W na wentylator)
            totalPower += fansCount * 3;
            
            // Płyta główna, USB itp. (50-100W)
            totalPower += 80;
            
            // Overclocking (+20% mocy CPU i GPU)
            if (overclock) {
                totalPower += (cpuPower + gpuPower) * 0.2;
            }
            
            // Zaokrąglenie do najbliższej 10
            totalPower = Math.ceil(totalPower / 10) * 10;
            
            // Rekomendowana moc (zapas 20%)
            const recommendedPower = Math.ceil(totalPower * 1.2 / 50) * 50;
            
            // Wyświetlenie wyników z animacją
            animatePowerResult(totalPower, powerValue);
            setTimeout(() => {
                animatePowerResult(recommendedPower, recValue);
            }, 500);
            
            // Animacja przycisku
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

function animatePowerResult(targetValue, element) {
    const currentValue = parseInt(element.textContent) || 0;
    const difference = targetValue - currentValue;
    const duration = 1000; // 1 sekunda
    const steps = 30;
    const stepValue = difference / steps;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    
    const animate = () => {
        if (currentStep < steps) {
            const newValue = Math.round(currentValue + (stepValue * currentStep));
            element.textContent = `${newValue} W`;
            currentStep++;
            setTimeout(animate, stepTime);
        } else {
            element.textContent = `${targetValue} W`;
        }
    };
    
    animate();
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
    // Efekty dla kart poradnika
    const guideCards = document.querySelectorAll('.guide-card');
    guideCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Efekt hover dla ikon
        const icon = card.querySelector('.guide-icon');
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
    
    // Efekty dla kart modeli zasilaczy
    const psuCards = document.querySelectorAll('.psu-model-card');
    psuCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Efekt dla nagłówka
        const header = card.querySelector('.psu-model-header');
        if (header) {
            card.addEventListener('mouseenter', function() {
                header.style.background = 'linear-gradient(135deg, #4361ee, #4cc9f0)';
            });
            
            card.addEventListener('mouseleave', function() {
                header.style.background = 'linear-gradient(135deg, #4cc9f0, #4361ee)';
            });
        }
        
        // Efekt dla ceny
        const price = card.querySelector('.psu-model-price');
        if (price) {
            card.addEventListener('mouseenter', function() {
                price.style.transform = 'scale(1.1)';
                price.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                price.style.transform = 'scale(1)';
            });
        }
    });
    
    // Symulacja kliknięcia dla przycisku kalkulatora (pierwsze obliczenie)
    setTimeout(() => {
        const calculateBtn = document.getElementById('calculate-power');
        if (calculateBtn) {
            calculateBtn.click();
        }
    }, 1000);
    
    // Dodatkowe funkcje dla przewodnika
    setupGuideInteractions();
}

function setupGuideInteractions() {
    // Podświetlanie poziomów efektywności
    const efficiencyLevels = document.querySelectorAll('.level');
    efficiencyLevels.forEach(level => {
        level.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        level.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Tooltip dla zabezpieczeń
    const protectionItems = document.querySelectorAll('.guide-card:nth-child(3) li');
    protectionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const text = this.textContent;
            const abbr = text.split(' (')[0];
            
            // Pobieramy pełną nazwę zabezpieczenia
            const fullNames = {
                'OVP': 'Over Voltage Protection - Zabezpieczenie przed zbyt wysokim napięciem',
                'UVP': 'Under Voltage Protection - Zabezpieczenie przed zbyt niskim napięciem',
                'OCP': 'Over Current Protection - Zabezpieczenie przed zbyt wysokim prądem',
                'OPP': 'Over Power Protection - Zabezpieczenie przed przeciążeniem mocy',
                'SCP': 'Short Circuit Protection - Zabezpieczenie przed zwarciem'
            };
            
            if (fullNames[abbr]) {
                // Tworzymy tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'protection-tooltip';
                tooltip.textContent = fullNames[abbr];
                tooltip.style.position = 'absolute';
                tooltip.style.background = '#1a1a2e';
                tooltip.style.color = 'white';
                tooltip.style.padding = '10px';
                tooltip.style.borderRadius = '6px';
                tooltip.style.fontSize = '0.9rem';
                tooltip.style.zIndex = '1000';
                tooltip.style.maxWidth = '250px';
                tooltip.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                
                // Pozycjonowanie
                const rect = this.getBoundingClientRect();
                tooltip.style.top = `${rect.top - 50}px`;
                tooltip.style.left = `${rect.left}px`;
                
                document.body.appendChild(tooltip);
                
                // Usuwamy tooltip po wyjściu myszki
                this.addEventListener('mouseleave', function() {
                    tooltip.remove();
                }, { once: true });
            }
        });
    });
}

// Dodatkowa funkcja - symulacja porównania
function comparePSUModels() {
    const selectedCards = document.querySelectorAll('.psu-model-card.selected');
    
    if (selectedCards.length < 2) {
        alert('Wybierz przynajmniej 2 modele do porównania (kliknij na karty)');
        return;
    }
    
    // Symulacja okna porównania
    const comparisonWindow = document.createElement('div');
    comparisonWindow.className = 'comparison-modal';
    comparisonWindow.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Porównanie zasilaczy</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="comparison-table">
                <table>
                    <thead>
                        <tr>
                            <th>Parametr</th>
                            ${Array.from(selectedCards).map(card => 
                                `<th>${card.querySelector('h3').textContent}</th>`
                            ).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Dane będą dodane dynamicznie -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Styl dla modala
    const style = document.createElement('style');
    style.textContent = `
        .comparison-modal {
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
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            padding: 30px;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
        }
        
        .comparison-table table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .comparison-table th, .comparison-table td {
            padding: 12px;
            border: 1px solid #ddd;
            text-align: center;
        }
        
        .comparison-table th {
            background: #f8f9fa;
            font-weight: 600;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(comparisonWindow);
    
    // Obsługa zamknięcia modala
    comparisonWindow.querySelector('.close-modal').addEventListener('click', function() {
        comparisonWindow.remove();
        style.remove();
    });
    
    // Kliknięcie poza modalem zamyka go
    comparisonWindow.addEventListener('click', function(e) {
        if (e.target === this) {
            comparisonWindow.remove();
            style.remove();
        }
    });
}

// Dodajemy możliwość wyboru kart do porównania
document.addEventListener('click', function(e) {
    const psuCard = e.target.closest('.psu-model-card');
    if (psuCard) {
        psuCard.classList.toggle('selected');
        
        // Wizualna wskazówka wyboru
        if (psuCard.classList.contains('selected')) {
            psuCard.style.boxShadow = '0 0 0 3px #4cc9f0';
        } else {
            psuCard.style.boxShadow = '';
        }
    }
});