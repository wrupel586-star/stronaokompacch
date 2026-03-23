// PLIK: js/plyty-glowne.js - NAPRAWIONY

document.addEventListener('DOMContentLoaded', function() {
    console.log('Strona płyt głównych załadowana - DEBUG');
    
    // Sprawdźmy czy elementy istnieją
    checkElements();
    
    // Inicjalizacja konfiguratora
    setupMotherboardConfigurator();
    
    // Inicjalizacja zakładek chipsets
    setupChipsetTabs();
    
    // Inicjalizacja efektów interaktywnych
    setupInteractiveElements();
    
    // Inicjalizacja przewodnika wizualnego
    setupVisualGuide();
});

function checkElements() {
    console.log('=== SPRAWDZANIE ELEMENTÓW ===');
    console.log('CPU Select:', document.getElementById('cpu-select'));
    console.log('Format options:', document.querySelectorAll('input[name="format"]').length);
    console.log('Reset button:', document.getElementById('reset-config'));
    console.log('Results grid:', document.querySelector('.mb-results-grid'));
    console.log('Initial message:', document.querySelector('.initial-message'));
}

function setupMotherboardConfigurator() {
    console.log('=== INICJALIZACJA KONFIGURATORA ===');
    
    const cpuSelect = document.getElementById('cpu-select');
    const formatOptions = document.querySelectorAll('input[name="format"]');
    const requirementCheckboxes = document.querySelectorAll('input[name="req"]');
    const resetBtn = document.getElementById('reset-config');
    const resultsGrid = document.querySelector('.mb-results-grid');
    const initialMessage = document.querySelector('.initial-message');
    
    if (!cpuSelect) {
        console.error('Brak elementu cpu-select!');
        return;
    }
    
    if (!resultsGrid) {
        console.error('Brak elementu .mb-results-grid!');
        return;
    }
    
    console.log('Znaleziono elementy:', {
        cpuSelect: true,
        formatOptions: formatOptions.length,
        requirementCheckboxes: requirementCheckboxes.length,
        resetBtn: !!resetBtn,
        resultsGrid: true,
        initialMessage: !!initialMessage
    });
    
    // Baza danych płyt głównych - ZMIENIŁEM WARTOŚCI SOCKET
    const motherboardDatabase = [
        // Intel ATX
        {
            name: "ASUS ROG Strix Z790-E Gaming",
            chipset: "Z790",
            format: "atx",
            socket: "intel-1700", // ZMIENIONE: było "intel-1700"
            ramType: "DDR5",
            features: ["wifi", "rgb", "multiple-gpu", "many-m2"],
            price: 1800,
            specs: {
                pcieSlots: "3× PCIe 5.0",
                m2Slots: "4× M.2",
                usb: "USB 3.2 Gen 2x2",
                ethernet: "2.5GbE + Wi-Fi 6E"
            }
        },
        {
            name: "MSI MAG B760 Tomahawk",
            chipset: "B760",
            format: "atx",
            socket: "intel-1700", // ZMIENIONE
            ramType: "DDR5",
            features: ["multiple-gpu", "many-m2"],
            price: 850,
            specs: {
                pcieSlots: "2× PCIe 4.0",
                m2Slots: "3× M.2",
                usb: "USB 3.2 Gen 2",
                ethernet: "2.5GbE"
            }
        },
        // Intel Micro-ATX
        {
            name: "ASUS TUF Gaming B760M-PLUS",
            chipset: "B760",
            format: "micro-atx",
            socket: "intel-1700", // ZMIENIONE
            ramType: "DDR5",
            features: ["wifi", "rgb"],
            price: 750,
            specs: {
                pcieSlots: "2× PCIe 4.0",
                m2Slots: "2× M.2",
                usb: "USB 3.2 Gen 2",
                ethernet: "2.5GbE"
            }
        },
        // Intel Mini-ITX
        {
            name: "ASUS ROG Strix Z790-I Gaming",
            chipset: "Z790",
            format: "mini-itx",
            socket: "intel-1700", // ZMIENIONE
            ramType: "DDR5",
            features: ["wifi", "rgb", "many-m2"],
            price: 1600,
            specs: {
                pcieSlots: "1× PCIe 5.0",
                m2Slots: "2× M.2",
                usb: "USB 3.2 Gen 2x2",
                ethernet: "2.5GbE + Wi-Fi 6E"
            }
        },
        // AMD ATX
        {
            name: "ASUS ROG Crosshair X670E Hero",
            chipset: "X670E",
            format: "atx",
            socket: "amd-am5",
            ramType: "DDR5",
            features: ["wifi", "rgb", "thunderbolt", "10g", "multiple-gpu", "many-m2"],
            price: 2500,
            specs: {
                pcieSlots: "3× PCIe 5.0",
                m2Slots: "4× M.2",
                usb: "USB4",
                ethernet: "10GbE + Wi-Fi 6E"
            }
        },
        {
            name: "Gigabyte B650 AORUS Elite AX",
            chipset: "B650",
            format: "atx",
            socket: "amd-am5",
            ramType: "DDR5",
            features: ["wifi", "rgb", "many-m2"],
            price: 1100,
            specs: {
                pcieSlots: "2× PCIe 4.0",
                m2Slots: "3× M.2",
                usb: "USB 3.2 Gen 2",
                ethernet: "2.5GbE + Wi-Fi 6"
            }
        }
    ];
    
    // Funkcja aktualizująca status kompatybilności
    function updateCompatibilityStatus() {
        const cpuValue = cpuSelect.value;
        const formatValue = getSelectedFormat();
        
        console.log('Update status - CPU:', cpuValue, 'Format:', formatValue);
        
        // Znajdź elementy statusu
        const cpuCompat = document.getElementById('cpu-compat');
        const formatCompat = document.getElementById('format-compat');
        const ramCompat = document.getElementById('ram-compat');
        
        if (!cpuCompat || !formatCompat || !ramCompat) {
            console.error('Brak elementów statusu kompatybilności!');
            return;
        }
        
        // Aktualizacja statusu CPU
        if (cpuValue) {
            cpuCompat.textContent = cpuValue;
            cpuCompat.className = 'compat-status compatible';
        } else {
            cpuCompat.textContent = 'Nie wybrano';
            cpuCompat.className = 'compat-status';
        }
        
        // Aktualizacja statusu formatu
        if (formatValue) {
            const formatNames = {
                'atx': 'ATX',
                'micro-atx': 'Micro-ATX',
                'mini-itx': 'Mini-ITX'
            };
            formatCompat.textContent = formatNames[formatValue] || formatValue;
            formatCompat.className = 'compat-status compatible';
        } else {
            formatCompat.textContent = 'Nie wybrano';
            formatCompat.className = 'compat-status';
        }
        
        // Aktualizacja statusu RAM (w zależności od CPU)
        if (cpuValue) {
            if (cpuValue.includes('am5') || cpuValue.includes('1700')) {
                ramCompat.textContent = 'DDR5';
            } else {
                ramCompat.textContent = 'DDR4';
            }
            ramCompat.className = 'compat-status compatible';
        }
    }
    
    // Funkcja pobierająca wybrany format - NAPRAWIONA
    function getSelectedFormat() {
        console.log('Szukam wybranego formatu...');
        
        // Sprawdzamy radio buttons
        for (let option of formatOptions) {
            console.log('Option:', option.value, 'checked:', option.checked);
            if (option.checked) {
                console.log('Znaleziono wybrany format:', option.value);
                return option.value;
            }
        }
        
        // Sprawdzamy też karty formatów z klasą selected
        const selectedCard = document.querySelector('.format-card.selected');
        if (selectedCard) {
            console.log('Znaleziono kartę z klasą selected');
            const input = selectedCard.closest('label')?.querySelector('input[name="format"]');
            if (input && input.checked) {
                console.log('Format z karty:', input.value);
                return input.value;
            }
        }
        
        console.log('Nie znaleziono wybranego formatu');
        return null;
    }
    
    // Funkcja pobierająca wybrane wymagania
    function getSelectedRequirements() {
        const selected = [];
        requirementCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selected.push(checkbox.value);
                console.log('Wybrano wymaganie:', checkbox.value);
            }
        });
        return selected;
    }
    
    // Funkcja filtrująca płyty główne
    function filterMotherboards() {
        console.log('=== ROZPOCZĘCIE FILTROWANIA ===');
        
        const cpuValue = cpuSelect.value;
        const formatValue = getSelectedFormat();
        const requirements = getSelectedRequirements();
        
        console.log('Wartości filtrowania:', {
            cpu: cpuValue,
            format: formatValue,
            requirements: requirements
        });
        
        // Jeśli brakuje podstawowych wyborów
        if (!cpuValue || !formatValue) {
            console.log('Brakuje wyboru CPU lub formatu');
            showInitialMessage();
            return;
        }
        
        // Filtrowanie
        const filtered = motherboardDatabase.filter(mb => {
            console.log('Sprawdzam płytę:', mb.name);
            console.log('  Socket:', mb.socket, 'CPU:', cpuValue);
            console.log('  Format:', mb.format, 'Wybrany:', formatValue);
            
            // Sprawdzenie socketu CPU
            if (mb.socket !== cpuValue) {
                console.log('  ❌ Niezgodny socket');
                return false;
            }
            
            // Sprawdzenie formatu
            if (mb.format !== formatValue) {
                console.log('  ❌ Niezgodny format');
                return false;
            }
            
            // Sprawdzenie wymagań
            if (requirements.length > 0) {
                for (let req of requirements) {
                    if (!mb.features.includes(req)) {
                        console.log('  ❌ Brakuje funkcji:', req);
                        return false;
                    }
                }
            }
            
            console.log('  ✅ Płyta pasuje!');
            return true;
        });
        
        console.log('Znaleziono pasujących płyt:', filtered.length);
        
        if (filtered.length === 0) {
            console.log('Brak dokładnych dopasowań');
            showNoResultsMessage();
        } else {
            console.log('Wyświetlam wyniki');
            displayMotherboardResults(filtered);
        }
        
        updateCompatibilityStatus();
    }
    
    // Funkcja wyświetlająca wyniki
    function displayMotherboardResults(motherboards) {
        console.log('Wyświetlam', motherboards.length, 'wyników');
        
        // Ukrywamy początkową wiadomość
        if (initialMessage) {
            initialMessage.style.display = 'none';
        }
        
        // Pokazujemy siatkę wyników
        if (resultsGrid) {
            resultsGrid.style.display = 'grid';
            resultsGrid.innerHTML = '';
            
            // Sortowanie od najtańszej
            motherboards.sort((a, b) => a.price - b.price);
            
            // Tworzenie kart wyników
            motherboards.forEach((mb, index) => {
                const card = createMotherboardCard(mb);
                resultsGrid.appendChild(card);
                
                // Animacja pojawiania się
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    }
    
    // Funkcja tworząca kartę płyty głównej
    function createMotherboardCard(motherboard) {
        const card = document.createElement('div');
        card.className = 'mb-result-card';
        
        // Formatowanie ceny
        const formattedPrice = motherboard.price.toLocaleString('pl-PL') + ' zł';
        
        // Mapowanie funkcji na ikony
        const featureIcons = {
            'wifi': '<i class="fas fa-wifi" title="Wi-Fi"></i>',
            'rgb': '<i class="fas fa-palette" title="RGB"></i>',
            'thunderbolt': '<i class="fas fa-bolt" title="Thunderbolt"></i>',
            '10g': '<i class="fas fa-network-wired" title="10Gb Ethernet"></i>',
            'multiple-gpu': '<i class="fas fa-expand-alt" title="Wiele GPU"></i>',
            'many-m2': '<i class="fas fa-hdd" title="Wiele M.2"></i>'
        };
        
        // Tworzenie HTML dla funkcji
        let featuresHTML = '';
        motherboard.features.forEach(feature => {
            if (featureIcons[feature]) {
                featuresHTML += featureIcons[feature] + ' ';
            }
        });
        
        card.innerHTML = `
            <div class="mb-result-header">
                <h4>${motherboard.name}</h4>
                <div class="mb-result-chipset">${motherboard.chipset}</div>
            </div>
            <div class="mb-result-specs">
                <div class="mb-result-spec">
                    <span class="spec-label">Format:</span>
                    <span class="spec-value">${motherboard.format.toUpperCase()}</span>
                </div>
                <div class="mb-result-spec">
                    <span class="spec-label">RAM:</span>
                    <span class="spec-value">${motherboard.ramType}</span>
                </div>
                <div class="mb-result-spec">
                    <span class="spec-label">Funkcje:</span>
                    <span class="spec-value">${featuresHTML || 'Brak'}</span>
                </div>
            </div>
            <div class="mb-result-price">${formattedPrice}</div>
        `;
        
        // Kliknięcie pokazuje więcej informacji
        card.addEventListener('click', function() {
            console.log('Kliknięto płytę:', motherboard.name);
            showMotherboardDetails(motherboard);
        });
        
        return card;
    }
    
    // Funkcja pokazująca początkową wiadomość
    function showInitialMessage() {
        console.log('Pokazuję początkową wiadomość');
        
        if (initialMessage) {
            initialMessage.style.display = 'flex';
        }
        
        if (resultsGrid) {
            resultsGrid.style.display = 'none';
            resultsGrid.innerHTML = '';
        }
        
        updateCompatibilityStatus();
    }
    
    // Funkcja pokazująca komunikat o braku wyników
    function showNoResultsMessage() {
        console.log('Pokazuję komunikat o braku wyników');
        
        if (resultsGrid) {
            resultsGrid.style.display = 'block';
            resultsGrid.innerHTML = `
                <div class="no-results-message">
                    <i class="fas fa-search"></i>
                    <h4>Nie znaleziono pasujących płyt głównych</h4>
                    <p>Spróbuj zmienić kryteria wyszukiwania.</p>
                </div>
            `;
        }
    }
    
    // Funkcja resetująca konfigurator
    function resetConfigurator() {
        console.log('Resetowanie konfiguratora');
        
        // Reset CPU
        cpuSelect.value = '';
        
        // Reset format
        formatOptions.forEach(option => {
            option.checked = false;
            const card = option.closest('label')?.querySelector('.format-card');
            if (card) {
                card.classList.remove('selected');
            }
        });
        
        // Reset wymagań
        requirementCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset kroków
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        showInitialMessage();
    }
    
    // DODAJEMY EVENT LISTENERS - BARDZO WAŻNE!
    console.log('Dodawanie event listeners...');
    
    // Event dla select CPU
    cpuSelect.addEventListener('change', function() {
        console.log('Zmiana CPU:', this.value);
        
        // Aktywacja kroku 2
        const step2 = document.querySelector('.step:nth-child(2)');
        if (step2) {
            step2.classList.add('active');
        }
        
        filterMotherboards();
    });
    
    // Event dla formatów
    formatOptions.forEach(option => {
        option.addEventListener('change', function() {
            console.log('Zmiana formatu:', this.value);
            
            // Aktualizacja wizualna kart
            document.querySelectorAll('.format-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            const card = this.closest('label')?.querySelector('.format-card');
            if (card) {
                card.classList.add('selected');
            }
            
            // Aktywacja kroku 3
            const step3 = document.querySelector('.step:nth-child(3)');
            if (step3) {
                step3.classList.add('active');
            }
            
            filterMotherboards();
        });
    });
    
    // Event dla wymagań
    requirementCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterMotherboards);
    });
    
    // Event dla reset
    if (resetBtn) {
        resetBtn.addEventListener('click', resetConfigurator);
    }
    
    // Inicjalizacja początkowa
    console.log('Konfigurator zainicjalizowany');
    showInitialMessage();
    
    // TEST: Automatyczne wywołanie po załadowaniu (opcjonalnie)
    setTimeout(() => {
        console.log('=== TEST AUTOMATYCZNY ===');
        console.log('Możesz odkomentować poniższe linie do testów:');
        // cpuSelect.value = 'intel-1700';
        // document.querySelector('input[value="atx"]').checked = true;
        // document.querySelector('input[value="atx"]').dispatchEvent(new Event('change'));
    }, 1000);
}

// Pozostałe funkcje pozostają bez zmian...
    
    // Funkcja pokazująca początkową wiadomość - POPRAWIONA
    function showInitialMessage() {
        console.log('Pokazuję początkową wiadomość');
        if (initialMessage) {
            initialMessage.style.display = 'flex';
        }
        if (resultsGrid) {
            resultsGrid.style.display = 'none';
        }
        
        // Usuwamy ewentualną informację o podobnych wynikach
        const similarInfo = document.querySelector('.similar-results-info');
        if (similarInfo) similarInfo.remove();
        
        updateCompatibilityStatus();
    }
    
    // Inicjalizacja początkowa
    console.log('Inicjalizacja początkowa konfiguratora');
    showInitialMessage();
    
    // Eksport funkcji resetującej do globalnego scope
    window.resetConfigurator = resetConfigurator;
    
    // Dodajmy też testowe wywołanie po załadowaniu
    setTimeout(() => {
        console.log('Testowe wywołanie po załadowaniu strony');
        // Możemy zasymulować wybór dla testów
        // cpuSelect.value = 'intel-1700';
        // filterMotherboards();
    }, 1000);
