// JavaScript dla strony procesory.html - ROZSZERZONY

document.addEventListener('DOMContentLoaded', function() {
    console.log('Strona procesory załadowana');
    
    // Inicjalizacja symulatora
    setupCpuSimulator();
    
    // Inicjalizacja zakładek
    setupModelTabs();
    
    // Inicjalizacja benchmarków
    setupBenchmarkChart();
    
    // Dodatkowe efekty
    setupModelCardsEffects();
});

function setupCpuSimulator() {
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budget-value');
    const simulateBtn = document.getElementById('simulate-cpu');
    const usageSelect = document.getElementById('usage-type');
    const resultDiv = document.getElementById('simulation-result');
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    // Baza danych procesorów
    const cpuDatabase = [
        // Intel - Biuro
        { name: "Intel Core i3-13100", price: 550, manufacturer: "intel", usage: ["office"], cores: 4, threads: 8, freq: "3.4-4.5 GHz", cache: "12 MB", tdp: "60W" },
        { name: "Intel Core i5-13400", price: 900, manufacturer: "intel", usage: ["office", "gaming"], cores: 10, threads: 16, freq: "2.5-4.6 GHz", cache: "20 MB", tdp: "65W" },
        
        // Intel - Gaming
        { name: "Intel Core i5-13600K", price: 1250, manufacturer: "intel", usage: ["gaming", "creative"], cores: 14, threads: 20, freq: "3.5-5.1 GHz", cache: "24 MB", tdp: "125W" },
        { name: "Intel Core i7-13700K", price: 1850, manufacturer: "intel", usage: ["gaming", "creative", "streaming"], cores: 16, threads: 24, freq: "3.4-5.4 GHz", cache: "30 MB", tdp: "125W" },
        { name: "Intel Core i9-13900K", price: 2500, manufacturer: "intel", usage: ["creative", "streaming", "server"], cores: 24, threads: 32, freq: "3.0-5.8 GHz", cache: "36 MB", tdp: "125W" },
        
        // AMD - Biuro
        { name: "AMD Ryzen 3 4100", price: 450, manufacturer: "amd", usage: ["office"], cores: 4, threads: 8, freq: "3.8-4.0 GHz", cache: "8 MB", tdp: "65W" },
        { name: "AMD Ryzen 5 5600G", price: 700, manufacturer: "amd", usage: ["office", "gaming"], cores: 6, threads: 12, freq: "3.9-4.4 GHz", cache: "19 MB", tdp: "65W" },
        
        // AMD - Gaming
        { name: "AMD Ryzen 5 7600X", price: 1100, manufacturer: "amd", usage: ["gaming", "creative"], cores: 6, threads: 12, freq: "4.7-5.3 GHz", cache: "32 MB", tdp: "105W" },
        { name: "AMD Ryzen 7 7700X", price: 1600, manufacturer: "amd", usage: ["gaming", "creative", "streaming"], cores: 8, threads: 16, freq: "4.5-5.4 GHz", cache: "32 MB", tdp: "105W" },
        { name: "AMD Ryzen 7 7800X3D", price: 1900, manufacturer: "amd", usage: ["gaming"], cores: 8, threads: 16, freq: "4.2-5.0 GHz", cache: "96 MB", tdp: "120W" },
        { name: "AMD Ryzen 9 7900X", price: 2200, manufacturer: "amd", usage: ["creative", "streaming", "server"], cores: 12, threads: 24, freq: "4.7-5.6 GHz", cache: "64 MB", tdp: "170W" },
        
        // Budżetowe
        { name: "Intel Pentium Gold G7400", price: 350, manufacturer: "intel", usage: ["office"], cores: 2, threads: 4, freq: "3.7 GHz", cache: "6 MB", tdp: "46W" },
        { name: "AMD Athlon Gold 3150G", price: 400, manufacturer: "amd", usage: ["office"], cores: 4, threads: 4, freq: "3.5-3.9 GHz", cache: "4 MB", tdp: "35W" },
        
        // Professional/Server
        { name: "AMD Ryzen Threadripper PRO 5995WX", price: 25000, manufacturer: "amd", usage: ["server"], cores: 64, threads: 128, freq: "2.7-4.5 GHz", cache: "256 MB", tdp: "280W" }
    ];
    
    // Aktualizacja wartości budżetu
    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener('input', function() {
            budgetValue.textContent = `${this.value} zł`;
        });
    }
    
    // Obsługa przycisków toggle
    let selectedManufacturer = "both";
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedManufacturer = this.getAttribute('data-value');
        });
    });
    
    // Obsługa przycisku symulacji
    if (simulateBtn) {
        simulateBtn.addEventListener('click', function() {
            const usage = usageSelect.value;
            const budget = parseInt(budgetSlider.value);
            
            // Filtrowanie procesorów
            let filteredCpus = cpuDatabase.filter(cpu => {
                // Sprawdzenie przeznaczenia
                const matchesUsage = cpu.usage.includes(usage);
                
                // Sprawdzenie budżetu (±20%)
                const budgetMin = budget * 0.8;
                const budgetMax = budget * 1.2;
                const matchesBudget = cpu.price >= budgetMin && cpu.price <= budgetMax;
                
                // Sprawdzenie producenta
                const matchesManufacturer = selectedManufacturer === "both" || cpu.manufacturer === selectedManufacturer;
                
                return matchesUsage && matchesBudget && matchesManufacturer;
            });
            
            // Jeśli brak wyników, rozszerzamy kryteria budżetu
            if (filteredCpus.length === 0) {
                filteredCpus = cpuDatabase.filter(cpu => {
                    const matchesUsage = cpu.usage.includes(usage);
                    const matchesManufacturer = selectedManufacturer === "both" || cpu.manufacturer === selectedManufacturer;
                    return matchesUsage && matchesManufacturer;
                });
                
                // Sortujemy po różnicy ceny od budżetu
                filteredCpus.sort((a, b) => Math.abs(a.price - budget) - Math.abs(b.price - budget));
            }
            
            // Wyświetlamy wynik
            if (filteredCpus.length > 0) {
                const bestCpu = filteredCpus[0];
                displayCpuResult(bestCpu, budget);
            } else {
                displayNoResult(usage, budget);
            }
            
            // Animacja przycisku
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Funkcja wyświetlająca wynik
    function displayCpuResult(cpu, budget) {
        const priceDiff = cpu.price - budget;
        let priceComment = "";
        
        if (priceDiff > 0) {
            priceComment = `(${priceDiff} zł ponad budżet)`;
        } else if (priceDiff < 0) {
            priceComment = `(${Math.abs(priceDiff)} zł poniżej budżetu)`;
        } else {
            priceComment = "(dokładnie w budżecie)";
        }
        
        resultDiv.innerHTML = `
            <div class="result-content">
                <div class="recommended-cpu">
                    <h4>Rekomendowany procesor:</h4>
                    <div class="cpu-name">${cpu.name}</div>
                    <div class="cpu-details">
                        <div class="detail-item">
                            <div class="label">Cena</div>
                            <div class="value">${cpu.price} zł</div>
                            <div class="subtext">${priceComment}</div>
                        </div>
                        <div class="detail-item">
                            <div class="label">Rdzenie/Wątki</div>
                            <div class="value">${cpu.cores}/${cpu.threads}</div>
                        </div>
                        <div class="detail-item">
                            <div class="label">Taktowanie</div>
                            <div class="value">${cpu.freq}</div>
                        </div>
                        <div class="detail-item">
                            <div class="label">Cache</div>
                            <div class="value">${cpu.cache}</div>
                        </div>
                    </div>
                    <p class="cpu-recommendation-text">
                        Ten procesor jest optymalnym wyborem dla Twoich potrzeb. 
                        ${getCpuDescription(cpu.name)}
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                        <button class="btn-simulate small" onclick="addToComparison('${cpu.name}')">
                            <i class="fas fa-plus"></i> Dodaj do porównania
                        </button>
                        <button class="btn-simulate small secondary" onclick="showMoreDetails('${cpu.name}')">
                            <i class="fas fa-info-circle"></i> Więcej informacji
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Animacja pojawiania się
        resultDiv.style.opacity = '0';
        resultDiv.style.transform = 'translateY(20px)';
        resultDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            resultDiv.style.opacity = '1';
            resultDiv.style.transform = 'translateY(0)';
        }, 10);
    }
    
    function displayNoResult(usage, budget) {
        resultDiv.innerHTML = `
            <div class="result-content">
                <div style="text-align: center; padding: 30px;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                    <h4>Nie znaleziono procesora</h4>
                    <p>Brak procesorów spełniających wszystkie kryteria.</p>
                    <p>Spróbuj zmienić budżet lub przeznaczenie.</p>
                    <button class="btn-simulate small" onclick="resetSimulator()" style="margin-top: 20px;">
                        <i class="fas fa-redo"></i> Zresetuj filtry
                    </button>
                </div>
            </div>
        `;
    }
    
    function getCpuDescription(cpuName) {
        const descriptions = {
            "Intel Core i3-13100": "Idealny do podstawowych zadań biurowych i multimedialnych. Wspiera najnowsze technologie Intela.",
            "Intel Core i5-13600K": "Świetny wybór dla graczy i twórców treści. Doskonały stosunek ceny do wydajności.",
            "AMD Ryzen 5 7600X": "Nowoczesny procesor z architekturą Zen 4. Doskonały do gier i pracy kreatywnej.",
            "AMD Ryzen 7 7800X3D": "Najlepszy procesor do gier dzięki technologii 3D V-Cache. Bezkompromisowa wydajność."
        };
        
        return descriptions[cpuName] || "Oferuje doskonałą wydajność dla wskazanego zastosowania.";
    }
}

// Funkcje globalne dla symulatora
function addToComparison(cpuName) {
    alert(`Dodano ${cpuName} do porównania (funkcjonalność w budowie)`);
}

function showMoreDetails(cpuName) {
    alert(`Szczegóły dla ${cpuName} (funkcjonalność w budowie)`);
}

function resetSimulator() {
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budget-value');
    const usageSelect = document.getElementById('usage-type');
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    if (budgetSlider && budgetValue) {
        budgetSlider.value = 1500;
        budgetValue.textContent = "1500 zł";
    }
    
    if (usageSelect) {
        usageSelect.value = "office";
    }
    
    toggleButtons.forEach(btn => {
        if (btn.getAttribute('data-value') === 'both') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const resultDiv = document.getElementById('simulation-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="result-placeholder">
                <i class="fas fa-microchip" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                <p>Wprowadź kryteria i kliknij "Znajdź procesor"</p>
                <p style="font-size: 0.9rem; color: #aaa;">Wyświetlimy tutaj rekomendację</p>
            </div>
        `;
    }
}

function setupModelTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Usuwamy aktywną klasę ze wszystkich przycisków i zawartości
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Dodajemy aktywną klasę do klikniętego przycisku
            this.classList.add('active');
            
            // Pokazujemy odpowiednią zawartość
            const targetTab = document.getElementById(`tab-${tabId}`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

function setupBenchmarkChart() {
    const benchmarkData = [
        { name: "Intel Core i5-13600K", gaming: 92, creative: 88, value: 95 },
        { name: "AMD Ryzen 5 7600X", gaming: 90, creative: 85, value: 92 },
        { name: "Intel Core i7-13700K", gaming: 96, creative: 94, value: 90 },
        { name: "AMD Ryzen 7 7700X", gaming: 94, creative: 92, value: 88 },
        { name: "Intel Core i9-13900K", gaming: 100, creative: 100, value: 80 },
        { name: "AMD Ryzen 9 7900X", gaming: 93, creative: 98, value: 85 },
        { name: "AMD Ryzen 7 7800X3D", gaming: 105, creative: 87, value: 86 }
    ];
    
    const chartContainer = document.querySelector('.benchmark-chart');
    if (!chartContainer) return;
    
    chartContainer.innerHTML = '';
    
    benchmarkData.forEach(cpu => {
        const cpuElement = document.createElement('div');
        cpuElement.className = 'benchmark-item';
        cpuElement.innerHTML = `
            <div class="benchmark-name">
                <span>${cpu.name}</span>
                <span class="benchmark-value">${cpu.gaming}%</span>
            </div>
            <div class="benchmark-bar">
                <div class="benchmark-fill" style="width: 0%"></div>
            </div>
        `;
        chartContainer.appendChild(cpuElement);
        
        // Animacja paska po dodaniu do DOM
        setTimeout(() => {
            const fill = cpuElement.querySelector('.benchmark-fill');
            fill.style.width = `${cpu.gaming}%`;
            fill.textContent = `${cpu.gaming}%`;
        }, 100);
    });
}

function setupModelCardsEffects() {
    const modelCards = document.querySelectorAll('.model-card');
    
    modelCards.forEach((card, index) => {
        // Opóźnienie dla efektu pojawiania się
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Efekt hover dla ceny
        const priceElement = card.querySelector('.model-price');
        if (priceElement) {
            card.addEventListener('mouseenter', function() {
                priceElement.style.transform = 'scale(1.1)';
                priceElement.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                priceElement.style.transform = 'scale(1)';
            });
        }
        
        // Efekt kliknięcia (symulacja)
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.model-more')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
}