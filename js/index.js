// JavaScript dla strony głównej - UPROSZCZONY

document.addEventListener('DOMContentLoaded', function() {
    // Wszystkie główne funkcje są już w main.js
    
    // Dodatkowe funkcje specyficzne tylko dla strony głównej
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Dodajemy efekt pojawiania się treści hero po załadowaniu
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Inicjalizacja licznika odwiedzin
    initVisitCounter();
});

// Funkcja licznika odwiedzin
function initVisitCounter() {
    const visitCounter = document.getElementById('visit-counter');
    if (visitCounter) {
        let visits = localStorage.getItem('pageVisits') || 0;
        visits = parseInt(visits) + 1;
        localStorage.setItem('pageVisits', visits);
        visitCounter.textContent = visits;
        
        // Dodajmy animację do licznika
        visitCounter.style.display = 'inline-block';
        visitCounter.style.transform = 'scale(1.2)';
        visitCounter.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            visitCounter.style.transform = 'scale(1)';
        }, 300);
    }
}