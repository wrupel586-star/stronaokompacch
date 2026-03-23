// Inicjalizacja animacji na wszystkich stronach

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICJALIZACJA STRONY ===');
    
    // Inicjalizacja po krótkim opóźnieniu
    setTimeout(initializeAnimations, 100);
});

function initializeAnimations() {
    console.log('Inicjalizacja animacji...');
    
    // 1. Animacja dla sekcji
    animateSections();
    
    // 2. Animacja dla kart
    if (typeof animateCardsOnScroll === 'function') {
        animateCardsOnScroll();
    } else {
        console.error('Funkcja animateCardsOnScroll nie została załadowana!');
        fallbackAnimation();
    }
    
    // 3. Inne efekty
    addScrollEffects();
}

function animateSections() {
    const sections = document.querySelectorAll('main > section, main > div > section');
    
    sections.forEach((section, index) => {
        // Dodajemy klasę dla animacji
        section.classList.add('animate-on-scroll');
        
        // Dodajemy opóźnienie kaskadowe
        if (index > 0) {
            section.classList.add(`delay-${Math.min(index, 4)}`);
        }
        
        // Obserwacja dla sekcji
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(section);
    });
}

function fallbackAnimation() {
    console.log('Używanie zapasowej animacji...');
    
    // Prosta animacja bez Intersection Observer
    const elements = document.querySelectorAll('.feature-card, .gallery-item, .history-card, .fact-card');
    
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

function addScrollEffects() {
    // Efekt parallax dla nagłówków
    const heroElements = document.querySelectorAll('.hero, .page-hero');
    
    heroElements.forEach(hero => {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.transform = `translateY(${rate}px)`;
        });
    });
    
    // Płynne przewijanie dla anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Eksport funkcji dla głównego skryptu
if (typeof window !== 'undefined') {
    window.initializeAnimations = initializeAnimations;
    window.fallbackAnimation = fallbackAnimation;
}