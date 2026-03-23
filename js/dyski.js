// JavaScript dla strony dyski.html

document.addEventListener('DOMContentLoaded', function() {
    console.log('Strona dysków załadowana');
    
    // Inicjalizacja kalkulatora pojemności
    setupStorageCalculator();
    
    // Inicjalizacja zakładek rekomendacji
    setupRecommendationTabs();
    
    // Inicjalizacja efektów interaktywnych
    setupInteractiveElements();
    
    // Automatyczne obliczenie przy załadowaniu
    setTimeout(() => {
        calculateStorageNeeds();
    }, 500);
});

function setupStorageCalculator() {
    const usageSelect = document.getElementById('storage-usage');
    const futureProofSlider = document.getElementById('future-proof');
    const futureProofValue = document.getElementById('future-proof-value');
    const osSelect = document.getElementById('os-type');
    const calculateBtn = document.getElementById('calculate-storage');
    const storageValue = document.querySelector('.storage-value');
    
    // Aktualizacja wartości suwaka future-proof
    if (futureProofSlider && futureProofValue) {
        futureProofSlider.addEventListener('input', function() {
            futureProofValue.textContent = `${this.value} lata`;
        });
    }
    
    // Obliczanie potrzebnej pojemności
    function calculateStorageNeeds() {
        const usage = usageSelect.value;
        const futureYears = parseInt(futureProofSlider.value);
        const osType = osSelect.value;
        
        // Zliczanie zaznaczonych gier
        const gameCheckboxes = document.querySelectorAll('input[name="game"]:checked');
        let gamesStorage = 0;
        
        gameCheckboxes.forEach(checkbox => {
            switch(checkbox.value) {
                case 'indie':
                    gamesStorage += 50; // 5 gier po 10GB
                    break;
                case 'aaa':
                    gamesStorage += 300; // 3 gry po 100GB
                    break;
                case 'modern':
                    gamesStorage += 400; // 2 gry po 200GB
                    break;
                case 'library':
                    gamesStorage += 1000; // Duża biblioteka
                    break;
            }
        });
        
        // Zliczanie multimediów
        const mediaCheckboxes = document.querySelectorAll('input[name="media"]:checked');
        let mediaStorage = 0;
        
        mediaCheckboxes.forEach(checkbox => {
            switch(checkbox.value) {
                case 'photos':
                    mediaStorage += 50;
                    break;
                case 'music':
                    mediaStorage += 100;
                    break;
                case 'movies':
                    mediaStorage += 500;
                    break;
                case '4k':
                    mediaStorage += 1000;
                    break;
            }
        });
        
        // Pamięć na system operacyjny
        let osStorage = 0;
        switch(osType) {
            case 'windows':
                osStorage = 64;
                break;
            case 'linux':
                osStorage = 20;
                break;
            case 'dual':
                osStorage = 100;
                break;
        }
        
        // Podstawowe zapotrzebowanie w zależności od użycia
        let baseStorage = 0;
        switch(usage) {
            case 'basic':
                baseStorage = 256; // 256GB
                break;
            case 'gaming':
                baseStorage = 512; // 512GB
                break;
            case 'creative':
                baseStorage = 1000; // 1TB
                break;
            case 'workstation':
                baseStorage = 2000; // 2TB
                break;
            case 'server':
                baseStorage = 4000; // 4TB
                break;
        }
        
        // Future-proofing (20% więcej na każdy rok)
        const futureMultiplier = 1 + (futureYears * 0.2);
        
        // Obliczanie całkowitego zapotrzebowania
        let totalStorage = (baseStorage + gamesStorage + mediaStorage + osStorage) * futureMultiplier;
        
        // Zaokrąglanie do standardowych wartości
        const standardValues = [128, 256, 512, 1000, 2000, 4000, 8000, 16000];
        let recommendedStorage = standardValues[0];
        
        for (let value of standardValues) {
            if (value >= totalStorage) {
                recommendedStorage = value;
                break;
            }
        }
        
        // Aktualizacja wyników z animacją
        animateStorageResult(recommendedStorage, storageValue);
        
        // Aktualizacja rekomendacji konfiguracji
        updateConfigurationRecommendation(recommendedStorage, usage);
        
        return recommendedStorage;
    }
    
    function animateStorageResult(targetValue, element) {
        const currentText = element.textContent;
        const currentValue = parseFloat(currentText) || 1;
        const isTB = currentText.includes('TB');
        const targetValueTB = targetValue >= 1000 ? targetValue / 1000 : targetValue;
        
        // Jeśli już pokazujemy w TB a mamy mniej niż 1TB, pokaż w GB
        const displayValue = targetValue >= 1000 ? (targetValue / 1000) : targetValue;
        const unit = targetValue >= 1000 ? 'TB' : 'GB';
        
        const duration = 1000;
        const steps = 20;
        const stepValue = (displayValue - currentValue) / steps;
        const stepTime = duration / steps;
        
        let currentStep = 0;
        
        const animate = () => {
            if (currentStep < steps) {
                const newValue = (currentValue + (stepValue * currentStep)).toFixed(1);
                element.textContent = `${parseFloat(newValue)} ${unit}`;
                currentStep++;
                setTimeout(animate, stepTime);
            } else {
                element.textContent = `${displayValue} ${unit}`;
            }
        };
        
        animate();
    }
    
    function updateConfigurationRecommendation(totalStorageGB, usage) {
        const configOptions = document.querySelectorAll('.config-option');
        
        // Obliczanie rozkładu pojemności
        let nvmeSize = 0;
        let ssdSize = 0;
        let hddSize = 0;
        
        if (totalStorageGB <= 512) {
            // Mała konfiguracja: tylko NVMe
            nvmeSize = totalStorageGB;
            ssdSize = 0;
            hddSize = 0;
        } else if (totalStorageGB <= 2000) {
            // Średnia konfiguracja: NVMe + SSD
            nvmeSize = 500;
            ssdSize = totalStorageGB - nvmeSize;
            hddSize = 0;
        } else {
            // Duża konfiguracja: NVMe + SSD + HDD
            nvmeSize = 1000;
            ssdSize = 1000;
            hddSize = totalStorageGB - nvmeSize - ssdSize;
            
            // Jeśli HDD mniej niż 1TB, dodaj do SSD
            if (hddSize < 1000) {
                ssdSize += hddSize;
                hddSize = 0;
            }
        }
        
        // Dla serwerów: więcej HDD
        if (usage === 'server') {
            nvmeSize = 250;
            ssdSize = 250;
            hddSize = totalStorageGB - nvmeSize - ssdSize;
        }
        
        // Zaokrąglanie do standardowych wartości
        const roundToStandard = (size) => {
            const standards = [120, 128, 240, 250, 256, 480, 500, 512, 960, 1000, 2000, 4000, 8000];
            for (let standard of standards) {
                if (standard >= size) return standard;
            }
            return Math.ceil(size / 1000) * 1000;
        };
        
        nvmeSize = roundToStandard(nvmeSize);
        ssdSize = roundToStandard(ssdSize);
        hddSize = roundToStandard(hddSize);
        
        // Formatowanie do czytelnej postaci
        const formatSize = (size) => {
            if (size >= 1000) return `${size / 1000} TB`;
            return `${size} GB`;
        };
        
        // Aktualizacja widoku
        if (configOptions.length >= 3) {
            // NVMe
            if (nvmeSize > 0) {
                configOptions[0].querySelector('.config-size').textContent = formatSize(nvmeSize);
                configOptions[0].style.display = 'grid';
            } else {
                configOptions[0].style.display = 'none';
            }
            
            // SSD
            if (ssdSize > 0) {
                configOptions[1].querySelector('.config-size').textContent = formatSize(ssdSize);
                configOptions[1].style.display = 'grid';
            } else {
                configOptions[1].style.display = 'none';
            }
            
            // HDD
            if (hddSize > 0) {
                configOptions[2].querySelector('.config-size').textContent = formatSize(hddSize);
                configOptions[2].style.display = 'grid';
            } else {
                configOptions[2].style.display = 'none';
            }
        }
    }
    
    // Obsługa przycisku obliczania
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculateStorageNeeds();
            
            // Animacja przycisku
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Automatyczne przeliczanie przy zmianie opcji
    const inputs = [usageSelect, futureProofSlider, osSelect];
    inputs.forEach(input => {
        input.addEventListener('change', calculateStorageNeeds);
    });
    
    // Obsługa checkboxów
    const gameCheckboxes = document.querySelectorAll('input[name="game"]');
    const mediaCheckboxes = document.querySelectorAll('input[name="media"]');
    
    gameCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateStorageNeeds);
    });
    
    mediaCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateStorageNeeds);
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
    // Efekty dla kart typów dysków
    const typeCards = document.querySelectorAll('.type-card');
    typeCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Efekt hover dla nagłówka
        const header = card.querySelector('.type-header');
        if (header) {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.type-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(10deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.type-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0)';
                }
            });
        }
    });
    
    // Efekty dla kart formatów
    const formatCards = document.querySelectorAll('.format-card');
    formatCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
        
        // Efekt hover dla ikony
        const icon = card.querySelector('.format-icon');
        if (icon) {
            card.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1)';
            });
        }
    });
    
    // Efekty dla kart modeli dysków
    const storageCards = document.querySelectorAll('.storage-model-card');
    storageCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Efekt dla nagłówka
        const header = card.querySelector('.model-header');
        if (header) {
            card.addEventListener('mouseenter', function() {
                header.style.background = 'linear-gradient(135deg, #4361ee, #4cc9f0)';
            });
            
            card.addEventListener('mouseleave', function() {
                header.style.background = 'linear-gradient(135deg, #4cc9f0, #4361ee)';
            });
        }
        
        // Efekt dla typu dysku
        const type = card.querySelector('.model-type');
        if (type) {
            card.addEventListener('mouseenter', function() {
                type.style.transform = 'scale(1.2)';
                type.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                type.style.transform = 'scale(1)';
            });
        }
    });
    
    // Animacja pasków prędkości
    animateSpeedBars();
    
    // Interaktywna tabela prędkości
    setupSpeedChartInteractions();
}

function animateSpeedBars() {
    const speedBars = document.querySelectorAll('.speed-bar');
    
    // Resetujemy szerokości do 0
    speedBars.forEach(bar => {
        const originalWidth = bar.style.width;
        bar.style.width = '0%';
        
        // Animacja z opóźnieniem
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-out';
            bar.style.width = originalWidth;
        }, 300);
    });
}

function setupSpeedChartInteractions() {
    const speedCategories = document.querySelectorAll('.speed-category');
    
    speedCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            const speedBar = this.querySelector('.speed-bar');
            if (speedBar) {
                speedBar.style.filter = 'brightness(1.2)';
                speedBar.style.transition = 'filter 0.3s ease';
            }
        });
        
        category.addEventListener('mouseleave', function() {
            const speedBar = this.querySelector('.speed-bar');
            if (speedBar) {
                speedBar.style.filter = 'brightness(1)';
            }
        });
        
        // Kliknięcie pokazuje więcej informacji
        category.addEventListener('click', function() {
            const categoryName = this.querySelector('.category-name').textContent;
            const speedValue = this.querySelector('.speed-value').textContent;
            
            showSpeedDetails(categoryName, speedValue);
        });
    });
}

function showSpeedDetails(category, speed) {
    // Tworzymy modal z informacjami
    const modal = document.createElement('div');
    modal.className = 'speed-details-modal';
    
    let details = '';
    let realWorldExamples = '';
    
    switch(category) {
        case 'HDD (7200 RPM)':
            details = 'Tradycyjny dysk talerzowy. Mechaniczne części, wolniejszy ale tańszy.';
            realWorldExamples = '• Ładowanie systemu: 30-60 sekund<br>• Kopiowanie pliku 10GB: ~1.5 minuty<br>• Ładowanie gry: 1-2 minuty';
            break;
        case 'SSD SATA':
            details = 'Dysk półprzewodnikowy z interfejsem SATA III. Ograniczony przepustowością interfejsu.';
            realWorldExamples = '• Ładowanie systemu: 10-20 sekund<br>• Kopiowanie pliku 10GB: ~20 sekund<br>• Ładowanie gry: 30-60 sekund';
            break;
        case 'NVMe PCIe 3.0':
            details = 'Najszybszy typ dysku z interfejsem PCIe 3.0 x4. Bezpośrednie podłączenie do płyty głównej.';
            realWorldExamples = '• Ładowanie systemu: 5-10 sekund<br>• Kopiowanie pliku 10GB: ~3 sekundy<br>• Ładowanie gry: 10-30 sekund';
            break;
        case 'NVMe PCIe 4.0':
            details = 'Najnowsza generacja NVMe z PCIe 4.0. Podwójna przepustowość względem PCIe 3.0.';
            realWorldExamples = '• Ładowanie systemu: 3-7 sekund<br>• Kopiowanie pliku 10GB: ~1.5 sekundy<br>• Ładowanie gry: 5-20 sekund';
            break;
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${category}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="speed-display">
                    <div class="speed-label">Prędkość odczytu:</div>
                    <div class="speed-number">${speed}</div>
                </div>
                <div class="details-section">
                    <h4>Opis:</h4>
                    <p>${details}</p>
                </div>
                <div class="real-world-section">
                    <h4>Przykłady w praktyce:</h4>
                    <p>${realWorldExamples}</p>
                </div>
                <div class="recommendation-section">
                    <h4>Zalecany użytek:</h4>
                    <p>${getRecommendedUse(category)}</p>
                </div>
            </div>
        </div>
    `;
    
    // Styl dla modala
    const style = document.createElement('style');
    style.textContent = `
        .speed-details-modal {
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
        
        .speed-details-modal .modal-content {
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
        
        .speed-display {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .speed-label {
            font-size: 1rem;
            color: #666;
            margin-bottom: 5px;
        }
        
        .speed-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #4cc9f0;
        }
        
        .details-section,
        .real-world-section,
        .recommendation-section {
            margin: 20px 0;
        }
        
        .details-section h4,
        .real-world-section h4,
        .recommendation-section h4 {
            color: #1a1a2e;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .details-section p,
        .recommendation-section p {
            color: #666;
            line-height: 1.5;
        }
        
        .real-world-section p {
            color: #666;
            line-height: 1.8;
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

function getRecommendedUse(category) {
    switch(category) {
        case 'HDD (7200 RPM)':
            return 'Archiwizacja danych, backup, NAS, przechowywanie multimediów, gdzie prędkość nie jest kluczowa.';
        case 'SSD SATA':
            return 'System operacyjny, podstawowe aplikacje, gry, gdzie potrzebna jest dobra prędkość w rozsądnej cenie.';
        case 'NVMe PCIe 3.0':
            return 'Gaming, aplikacje profesjonalne, edycja wideo, gdzie potrzebna jest wysoka wydajność.';
        case 'NVMe PCIe 4.0':
            return 'Zaawansowane stacje robocze, profesjonalna edycja 4K/8K, obliczenia naukowe, gaming competitive.';
        default:
            return 'Ogólne zastosowania komputerowe.';
    }
}

// Dodatkowa funkcja - symulacja testu prędkości dysku
function simulateDiskSpeedTest(diskType) {
    const testModal = document.createElement('div');
    testModal.className = 'disk-test-modal';
    
    let testData = {
        name: diskType,
        readSpeed: 0,
        writeSpeed: 0,
        accessTime: 0
    };
    
    // Ustawianie danych testowych w zależności od typu dysku
    switch(diskType) {
        case 'HDD':
            testData.readSpeed = 150;
            testData.writeSpeed = 140;
            testData.accessTime = 12;
            break;
        case 'SSD SATA':
            testData.readSpeed = 520;
            testData.writeSpeed = 480;
            testData.accessTime = 0.1;
            break;
        case 'NVMe PCIe 3.0':
            testData.readSpeed = 3500;
            testData.writeSpeed = 3000;
            testData.accessTime = 0.05;
            break;
        case 'NVMe PCIe 4.0':
            testData.readSpeed = 7000;
            testData.writeSpeed = 5000;
            testData.accessTime = 0.03;
            break;
    }
    
    testModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Test prędkości: ${testData.name}</h3>
                <button class="close-test-modal">&times;</button>
            </div>
            <div class="test-progress">
                <div class="progress-stage" id="stage1">
                    <div class="stage-name">Test odczytu sekwencyjnego</div>
                    <div class="stage-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-value">0 MB/s</div>
                    </div>
                </div>
                <div class="progress-stage" id="stage2">
                    <div class="stage-name">Test zapisu sekwencyjnego</div>
                    <div class="stage-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-value">0 MB/s</div>
                    </div>
                </div>
                <div class="progress-stage" id="stage3">
                    <div class="stage-name">Test czasu dostępu</div>
                    <div class="stage-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-value">0 ms</div>
                    </div>
                </div>
            </div>
            <div class="test-results" style="display: none;">
                <h4>Wyniki testu:</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span>Odczyt sekwencyjny:</span>
                        <span class="result-value">${testData.readSpeed} MB/s</span>
                    </div>
                    <div class="result-item">
                        <span>Zapis sekwencyjny:</span>
                        <span class="result-value">${testData.writeSpeed} MB/s</span>
                    </div>
                    <div class="result-item">
                        <span>Czas dostępu:</span>
                        <span class="result-value">${testData.accessTime} ms</span>
                    </div>
                    <div class="result-item">
                        <span>Ocena ogólna:</span>
                        <span class="result-value">${calculateDiskScore(testData)}/10</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Styl dla modala testowego
    const testStyle = document.createElement('style');
    testStyle.textContent = `
        .disk-test-modal {
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
        }
        
        .disk-test-modal .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            padding: 30px;
        }
        
        .test-progress {
            margin: 30px 0;
        }
        
        .progress-stage {
            margin-bottom: 25px;
        }
        
        .stage-name {
            margin-bottom: 10px;
            font-weight: 600;
            color: #1a1a2e;
        }
        
        .stage-progress {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .progress-bar {
            flex: 1;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4cc9f0, #4361ee);
            border-radius: 10px;
            width: 0%;
            transition: width 2s ease-out;
        }
        
        .progress-value {
            min-width: 80px;
            font-weight: bold;
            color: #4cc9f0;
        }
        
        .test-results {
            animation: fadeIn 0.5s ease;
        }
        
        .result-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
            margin-top: 20px;
        }
        
        .result-item {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        
        .result-value {
            font-weight: bold;
            color: #4cc9f0;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(testStyle);
    document.body.appendChild(testModal);
    
    // Obsługa zamknięcia
    testModal.querySelector('.close-test-modal').addEventListener('click', function() {
        testModal.remove();
        testStyle.remove();
    });
    
    // Uruchomienie symulacji testu
    setTimeout(() => {
        runSpeedTestSimulation(testData, testModal);
    }, 500);
}

function runSpeedTestSimulation(testData, modal) {
    const stage1 = modal.querySelector('#stage1 .progress-fill');
    const stage1Value = modal.querySelector('#stage1 .progress-value');
    const stage2 = modal.querySelector('#stage2 .progress-fill');
    const stage2Value = modal.querySelector('#stage2 .progress-value');
    const stage3 = modal.querySelector('#stage3 .progress-fill');
    const stage3Value = modal.querySelector('#stage3 .progress-value');
    const resultsDiv = modal.querySelector('.test-results');
    
    // Etap 1: Test odczytu
    setTimeout(() => {
        stage1.style.width = '100%';
        animateValue(stage1Value, 0, testData.readSpeed, ' MB/s', 2000);
        
        // Etap 2: Test zapisu
        setTimeout(() => {
            stage2.style.width = '100%';
            animateValue(stage2Value, 0, testData.writeSpeed, ' MB/s', 2000);
            
            // Etap 3: Czas dostępu
            setTimeout(() => {
                stage3.style.width = '100%';
                animateValue(stage3Value, 0, testData.accessTime, ' ms', 1000);
                
                // Pokazanie wyników
                setTimeout(() => {
                    resultsDiv.style.display = 'block';
                }, 500);
            }, 2500);
        }, 2500);
    }, 500);
}

function animateValue(element, start, end, unit, duration) {
    const steps = 50;
    const stepValue = (end - start) / steps;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    
    const animate = () => {
        if (currentStep < steps) {
            const currentValue = start + (stepValue * currentStep);
            element.textContent = unit === ' ms' 
                ? currentValue.toFixed(2) + unit 
                : Math.round(currentValue) + unit;
            currentStep++;
            setTimeout(animate, stepTime);
        } else {
            element.textContent = unit === ' ms' 
                ? end.toFixed(2) + unit 
                : end + unit;
        }
    };
    
    animate();
}

function calculateDiskScore(testData) {
    // Prosty algorytm oceny dysku
    let score = 0;
    
    // Ocena prędkości odczytu (max 4 punkty)
    if (testData.readSpeed > 6000) score += 4;
    else if (testData.readSpeed > 3000) score += 3;
    else if (testData.readSpeed > 1000) score += 2;
    else if (testData.readSpeed > 500) score += 1;
    
    // Ocena czasu dostępu (max 3 punkty)
    if (testData.accessTime < 0.1) score += 3;
    else if (testData.accessTime < 1) score += 2;
    else if (testData.accessTime < 5) score += 1;
    
    // Bonus za nowoczesność technologii (max 3 punkty)
    if (testData.name.includes('PCIe 4.0')) score += 3;
    else if (testData.name.includes('PCIe 3.0')) score += 2;
    else if (testData.name.includes('SSD')) score += 1;
    
    return Math.min(10, score); // Maksymalnie 10 punktów
}

// Dodanie przycisków testu prędkości do kart typów dysków
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const typeCards = document.querySelectorAll('.type-card');
        
        typeCards.forEach(card => {
            const testButton = document.createElement('button');
            testButton.className = 'speed-test-btn';
            testButton.innerHTML = '<i class="fas fa-tachometer-alt"></i> Test prędkości';
            testButton.style.marginTop = '15px';
            testButton.style.padding = '8px 15px';
            testButton.style.background = 'linear-gradient(135deg, #4cc9f0, #4361ee)';
            testButton.style.color = 'white';
            testButton.style.border = 'none';
            testButton.style.borderRadius = '6px';
            testButton.style.cursor = 'pointer';
            testButton.style.fontSize = '0.9rem';
            testButton.style.transition = 'transform 0.3s';
            
            testButton.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            testButton.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            testButton.addEventListener('click', function() {
                const diskType = card.querySelector('h3').textContent;
                simulateDiskSpeedTest(diskType);
            });
            
            const recommendationDiv = card.querySelector('.type-recommendation');
            if (recommendationDiv) {
                recommendationDiv.appendChild(testButton);
            }
        });
    }, 1000);
});