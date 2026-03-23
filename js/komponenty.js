// JavaScript dla strony komponenty.html

document.addEventListener('DOMContentLoaded', function() {
    console.log('Strona komponenty załadowana');
    
    // Sprawdzanie kompatybilności
    const checkButton = document.getElementById('check-compatibility');
    const cpuSelect = document.getElementById('cpu-select');
    const mbSelect = document.getElementById('mb-select');
    const resultDiv = document.getElementById('compatibility-result');
    
    if (checkButton) {
        checkButton.addEventListener('click', function() {
            const cpuValue = cpuSelect.value;
            const mbValue = mbSelect.value;
            
            // Resetujemy wynik
            resultDiv.className = 'result-message';
            resultDiv.textContent = '';
            resultDiv.style.display = 'none';
            
            // Walidacja
            if (!cpuValue || !mbValue) {
                showResult('Proszę wybrać zarówno procesor jak i płytę główną', 'warning');
                return;
            }
            
            // Logika kompatybilności
            let message = '';
            let type = '';
            
            if ((cpuValue === 'intel' && mbValue === 'intel-mb') || 
                (cpuValue === 'amd' && mbValue === 'amd-mb')) {
                message = '✓ Komponenty są kompatybilne! Możesz przejść do zakupów.';
                type = 'success';
                
                // Dodajemy efekt wizualny dla kart
                highlightCompatibleComponents();
            } else {
                message = '✗ Procesor i płyta główna nie są kompatybilne. Procesor Intel wymaga płyty z socketem Intel, a AMD z socketem AMD.';
                type = 'error';
            }
            
            showResult(message, type);
            
            // Dodajemy animację do przycisku
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    function showResult(message, type) {
        resultDiv.textContent = message;
        resultDiv.classList.add(type);
        resultDiv.style.display = 'block';
        
        // Animacja pojawiania się
        resultDiv.style.opacity = '0';
        resultDiv.style.transform = 'translateY(-10px)';
        resultDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            resultDiv.style.opacity = '1';
            resultDiv.style.transform = 'translateY(0)';
        }, 10);
    }
    
    function highlightCompatibleComponents() {
        // Podświetlamy karty komponentów
        const cards = document.querySelectorAll('.component-card');
        cards.forEach(card => {
            card.style.boxShadow = '0 0 0 2px #4cc9f0';
            card.style.transition = 'box-shadow 0.5s ease';
            
            // Resetujemy po 3 sekundach
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 3000);
        });
    }
    
    // Efekt hover dla kart komponentów z opóźnieniem
    const componentCards = document.querySelectorAll('.component-card');
    componentCards.forEach((card, index) => {
        // Dodajemy opóźnienie dla efektu pojawiania się
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Dodatkowy efekt przy najechaniu
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.component-icon');
            if (icon) {
                icon.style.transform = 'rotate(15deg) scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.component-icon');
            if (icon) {
                icon.style.transform = 'rotate(0) scale(1)';
            }
        });
    });
    

});