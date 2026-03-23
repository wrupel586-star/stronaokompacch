// Obsługa strony Porady

function initAdvicePage() {
    console.log('Inicjalizacja strony Porady');
    
    // Obsługa akordeonów
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Zamknij wszystkie akordeony
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Otwórz kliknięty, jeśli był zamknięty
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
    
    // Obsługa kategorii
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterAdviceByCategory(category);
        });
    });
    
    // Kalkulator zasilacza
    setupPSUCalculator();
    
    // Kalkulator budżetu
    setupBudgetCalculator();
    
    // Animacja elementów
    animateAdviceElements();
    
    // Obsługa przewijania do kategorii
    setupCategoryScroll();
}

// Filtrowanie porad po kategorii
function filterAdviceByCategory(category) {
    const accordionItems = document.querySelectorAll('.accordion-item');
    let foundItem = null;
    
    // Znajdź pierwszy element z odpowiednią kategorią (w prawdziwej aplikacji byłoby to oznaczone)
    accordionItems.forEach((item, index) => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        
        if (category === 'building' && title.includes('budować')) {
            foundItem = item;
        } else if (category === 'optimization' && title.includes('temperaturę')) {
            foundItem = item;
        } else if (category === 'troubleshooting' && index === 2) { // przykładowo
            foundItem = item;
        }
    });
    
    // Zamknij wszystkie akordeony
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Otwórz znaleziony akordeon
    if (foundItem) {
        foundItem.classList.add('active');
        foundItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Dodaj efekt wizualny
        foundItem.style.animation = 'highlight 1.5s ease';
        setTimeout(() => {
            foundItem.style.animation = '';
        }, 1500);
    }
    
    // Dodaj animację dla przycisku
    const activeCard = document.querySelector(`.category-card[data-category="${category}"]`);
    if (activeCard) {
        activeCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            activeCard.style.transform = '';
        }, 300);
    }
}

// Kalkulator zasilacza
function setupPSUCalculator() {
    const calculateBtn = document.getElementById('calculate-psu');
    const cpuSelect = document.getElementById('calc-cpu');
    const gpuSelect = document.getElementById('calc-gpu');
    const drivesInput = document.getElementById('calc-drives');
    const resultSpan = document.getElementById('psu-result');
    const recommendationSpan = document.getElementById('psu-recommendation');
    
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', function() {
        // Pobierz wartości
        const cpuWattage = parseInt(cpuSelect.value);
        const gpuWattage = parseInt(gpuSelect.value);
        const drivesCount = parseInt(drivesInput.value);
        
        // Oblicz moc
        const baseWattage = cpuWattage + gpuWattage;
        const drivesWattage = drivesCount * 10; // 10W na dysk
        const otherWattage = 100; // Płyta główna, RAM, wentylatory
        
        const totalWattage = baseWattage + drivesWattage + otherWattage;
        
        // Dodaj 20% headroom
        const recommendedWattage = Math.ceil(totalWattage * 1.2 / 50) * 50; // Zaokrąglij do 50W
        
        // Aktualizuj wynik
        resultSpan.textContent = `${totalWattage}W`;
        recommendationSpan.textContent = `${recommendedWattage}W 80+ Gold`;
        
        // Efekt wizualny
        resultSpan.style.transform = 'scale(1.2)';
        resultSpan.style.color = '#4cc9f0';
        
        setTimeout(() => {
            resultSpan.style.transform = 'scale(1)';
            resultSpan.style.color = '#1a1a2e';
        }, 500);
        
        // Zapisz w localStorage
        localStorage.setItem('psu_calculation', JSON.stringify({
            cpu: cpuWattage,
            gpu: gpuWattage,
            drives: drivesCount,
            total: totalWattage,
            recommended: recommendedWattage,
            date: new Date().toISOString()
        }));
    });
    
    // Załaduj ostatnie obliczenie
    const lastCalculation = localStorage.getItem('psu_calculation');
    if (lastCalculation) {
        try {
            const data = JSON.parse(lastCalculation);
            resultSpan.textContent = `${data.total}W`;
            recommendationSpan.textContent = `${data.recommended}W 80+ Gold`;
        } catch(e) {
            console.log('Błąd ładowania zapisanych obliczeń:', e);
        }
    }
}

// Kalkulator budżetu
function setupBudgetCalculator() {
    const budgetSlider = document.getElementById('budget-slider');
    const budgetValue = document.getElementById('budget-value');
    const budgetSuggestions = document.getElementById('budget-suggestions');
    
    if (!budgetSlider) return;
    
    // Aktualizuj wartości procentowe
    const updateBudgetPercentages = (budget) => {
        // Domyślne wartości procentowe
        const percentages = {
            cpu: 30,
            gpu: 40,
            ram: 10,
            storage: 10,
            other: 10
        };
        
        // Dostosuj dla różnych budżetów
        if (budget < 3000) {
            percentages.cpu = 25;
            percentages.gpu = 35;
            percentages.ram = 15;
            percentages.storage = 15;
            percentages.other = 10;
        } else if (budget > 8000) {
            percentages.cpu = 25;
            percentages.gpu = 45;
            percentages.ram = 10;
            percentages.storage = 10;
            percentages.other = 10;
        }
        
        // Aktualizuj wartości w UI
        document.getElementById('budget-cpu').textContent = `${percentages.cpu}%`;
        document.getElementById('budget-gpu').textContent = `${percentages.gpu}%`;
        document.getElementById('budget-ram').textContent = `${percentages.ram}%`;
        document.getElementById('budget-storage').textContent = `${percentages.storage}%`;
        document.getElementById('budget-other').textContent = `${percentages.other}%`;
        
        // Aktualizuj paski
        document.querySelectorAll('.budget-fill')[0].style.width = `${percentages.cpu}%`;
        document.querySelectorAll('.budget-fill')[1].style.width = `${percentages.gpu}%`;
        document.querySelectorAll('.budget-fill')[2].style.width = `${percentages.ram}%`;
        document.querySelectorAll('.budget-fill')[3].style.width = `${percentages.storage}%`;
        document.querySelectorAll('.budget-fill')[4].style.width = `${percentages.other}%`;
        
        return percentages;
    };
    
    // Generuj sugestie komponentów
    const generateSuggestions = (budget, percentages) => {
        const cpuBudget = (budget * percentages.cpu / 100);
        const gpuBudget = (budget * percentages.gpu / 100);
        const ramBudget = (budget * percentages.ram / 100);
        const storageBudget = (budget * percentages.storage / 100);
        const otherBudget = (budget * percentages.other / 100);
        
        let suggestionsHTML = '';
        
        // Sugestie CPU
        if (cpuBudget < 600) {
            suggestionsHTML += '<div class="suggestion"><strong>CPU:</strong> AMD Ryzen 5 5600/Intel i3-13100</div>';
        } else if (cpuBudget < 1000) {
            suggestionsHTML += '<div class="suggestion"><strong>CPU:</strong> AMD Ryzen 5 7600/Intel i5-13400</div>';
        } else if (cpuBudget < 1500) {
            suggestionsHTML += '<div class="suggestion"><strong>CPU:</strong> AMD Ryzen 7 7700/Intel i7-13700</div>';
        } else {
            suggestionsHTML += '<div class="suggestion"><strong>CPU:</strong> AMD Ryzen 7 7800X3D/Intel i9-14900K</div>';
        }
        
        // Sugestie GPU
        if (gpuBudget < 1500) {
            suggestionsHTML += '<div class="suggestion"><strong>GPU:</strong> NVIDIA RTX 4060/AMD RX 7600</div>';
        } else if (gpuBudget < 2500) {
            suggestionsHTML += '<div class="suggestion"><strong>GPU:</strong> NVIDIA RTX 4070/AMD RX 7700 XT</div>';
        } else if (gpuBudget < 4000) {
            suggestionsHTML += '<div class="suggestion"><strong>GPU:</strong> NVIDIA RTX 4070 Ti Super/AMD RX 7800 XT</div>';
        } else {
            suggestionsHTML += '<div class="suggestion"><strong>GPU:</strong> NVIDIA RTX 4080 Super/AMD RX 7900 XTX</div>';
        }
        
        // Sugestie RAM
        suggestionsHTML += `<div class="suggestion"><strong>RAM:</strong> 32GB DDR5 ${ramBudget < 400 ? '5600MHz' : '6000MHz+'}</div>`;
        
        // Sugestie dysku
        if (storageBudget < 300) {
            suggestionsHTML += '<div class="suggestion"><strong>Dysk:</strong> 1TB NVMe PCIe 4.0</div>';
        } else if (storageBudget < 500) {
            suggestionsHTML += '<div class="suggestion"><strong>Dysk:</strong> 2TB NVMe PCIe 4.0</div>';
        } else {
            suggestionsHTML += '<div class="suggestion"><strong>Dysk:</strong> 2TB+ NVMe PCIe 4.0 + HDD 4TB</div>';
        }
        
        // Inne
        suggestionsHTML += `<div class="suggestion"><strong>Inne:</strong> Zasilacz + Obudowa + Chłodzenie</div>`;
        
        return suggestionsHTML;
    };
    
    // Obsługa zmiany suwaka
    budgetSlider.addEventListener('input', function() {
        const budget = parseInt(this.value);
        budgetValue.textContent = budget;
        
        const percentages = updateBudgetPercentages(budget);
        const suggestions = generateSuggestions(budget, percentages);
        
        budgetSuggestions.innerHTML = suggestions;
        
        // Efekt wizualny
        budgetValue.style.transform = 'scale(1.2)';
        budgetValue.style.color = '#4cc9f0';
        
        setTimeout(() => {
            budgetValue.style.transform = 'scale(1)';
            budgetValue.style.color = '#1a1a2e';
        }, 300);
    });
    
    // Inicjalizuj z domyślnymi wartościami
    const initialBudget = parseInt(budgetSlider.value);
    budgetValue.textContent = initialBudget;
    const percentages = updateBudgetPercentages(initialBudget);
    budgetSuggestions.innerHTML = generateSuggestions(initialBudget, percentages);
}

// Animacja elementów
function animateAdviceElements() {
    // Dodaj animacje dla kroków porad
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });
    
    // Animacja pasków benchmarków
    setTimeout(() => {
        const benchmarkBars = document.querySelectorAll('.benchmark-value');
        benchmarkBars.forEach((bar, index) => {
            bar.style.transition = 'width 1s ease';
            setTimeout(() => {
                bar.style.width = bar.style.width;
            }, index * 200);
        });
    }, 1000);
}

// Przewijanie do kategorii
function setupCategoryScroll() {
    // Obsługa kliknięć w linki stopki
    const footerLinks = document.querySelectorAll('footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            if (targetId === 'calculator' || targetId === 'budget') {
                const calculatorSection = document.querySelector('.calculator-section');
                if (calculatorSection) {
                    calculatorSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Dla innych linków spróbuj znaleźć element
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Animacja ładowania
document.addEventListener('DOMContentLoaded', function() {
    initAdvicePage();
    
    // Dodaj style dla animacji highlight
    const style = document.createElement('style');
    style.textContent = `
        @keyframes highlight {
            0% { box-shadow: 0 0 0 0 rgba(76, 201, 240, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(76, 201, 240, 0); }
            100% { box-shadow: 0 0 0 0 rgba(76, 201, 240, 0); }
        }
        
        .suggestion {
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .suggestion:last-child {
            border-bottom: none;
        }
        
        .suggestion strong {
            color: #1a1a2e;
            display: inline-block;
            min-width: 80px;
        }
    `;
    document.head.appendChild(style);
    
    // Otwórz pierwszy akordeon
    setTimeout(() => {
        const firstAccordion = document.querySelector('.accordion-item');
        if (firstAccordion) {
            firstAccordion.classList.add('active');
        }
    }, 500);
});

// Obsługa zmiany rozmiaru okna
window.addEventListener('resize', function() {
    // Resetuj animacje pasków benchmarków
    const benchmarkBars = document.querySelectorAll('.benchmark-value');
    benchmarkBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
});