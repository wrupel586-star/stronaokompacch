// Główny plik JavaScript - funkcje wspólne dla wszystkich stron

// GŁÓWNA FUNKCJA INICJALIZUJĄCA
function initPage() {
    // Obsługa menu mobilnego
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Zamknij menu po kliknięciu na link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // Obsługa formularza newslettera
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (validateEmail(email)) {
                // Symulacja wysłania formularza
                alert(`Dziękujemy za zapisanie się do newslettera na adres: ${email}`);
                emailInput.value = '';
            } else {
                alert('Proszę podać poprawny adres e-mail.');
            }
        });
    }
    
    // Aktualizacja roku w stopce
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        const yearText = yearElement.innerHTML;
        if (yearText.includes('2023')) {
            yearElement.innerHTML = yearText.replace('2023', currentYear);
        } else if (yearText.includes('2024')) {
            yearElement.innerHTML = yearText.replace('2024', currentYear);
        }
    }
    
    // ANIMACJA KART - WYWOŁAJ Z OPÓŹNIENIEM
    setTimeout(() => {
        animateCardsOnScroll();
    }, 300);
    
    // Inne funkcje
    setupGalleryHover();
    setupParallaxEffect();
    setupReadMoreButtons();
    
    // Licznik odwiedzin dla całej witryny
    initVisitCounter();
}

// Walidacja e-mail
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// POPRAWIONA FUNKCJA ANIMACJI KART - DZIAŁA NA WSZYSTKICH KARTACH
function animateCardsOnScroll() {
    console.log('=== ANIMACJA KART - ROZPOCZĘCIE ===');
    
    // SZEROKI SELEKTOR - WSZYSTKIE MOŻLIWE KARTY
    const selectors = [
        '.feature-card', 
        '.product-card', 
        '.history-card',
        '.component-card', 
        '.gaming-card', 
        '.info-card',
        '.card', 
        '.article-card', 
        '.tech-card',
        '.fact-card',
        '.gallery-item',
        '.fact-card',
        '.history-card',
        '[class*="card"]', // Wszystkie elementy z "card" w nazwie klasy
        '.features-grid > div', // Divy w siatce features
        '.gallery-grid > div' // Divy w siatce galerii
    ];
    
    // Zbieramy WSZYSTKIE elementy ze wszystkich selektorów
    let allCards = [];
    selectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            console.log(`Selektor "${selector}": znaleziono ${elements.length} elementów`);
            elements.forEach(el => {
                if (!allCards.includes(el)) {
                    allCards.push(el);
                }
            });
        } catch(e) {
            console.log(`Błąd selektora "${selector}":`, e.message);
        }
    });
    
    // Jeśli nie znaleźliśmy kart standardowymi selektorami, szukamy po strukturze
    if (allCards.length === 0) {
        console.log('Szukanie kart po strukturze HTML...');
        // Szukamy divów, które wyglądają jak karty (mają obrazek i tekst)
        const allDivs = document.querySelectorAll('main div, section div');
        allDivs.forEach(div => {
            // Sprawdzamy czy div ma przynajmniej obrazek lub nagłówek
            const hasImg = div.querySelector('img');
            const hasHeading = div.querySelector('h2, h3, h4');
            const hasContent = div.textContent.trim().length > 50;
            
            if ((hasImg || hasHeading) && hasContent && div.offsetWidth > 0) {
                const rect = div.getBoundingClientRect();
                if (rect.width > 100 && rect.height > 100) { // Rozsądny rozmiar
                    allCards.push(div);
                    div.classList.add('auto-detected-card'); // Dodajemy klasę
                }
            }
        });
    }
    
    console.log(`Łącznie znaleziono ${allCards.length} elementów do animacji`);
    
    if (allCards.length === 0) {
        console.log('Nie znaleziono żadnych elementów do animacji');
        return;
    }
    
    // Resetujemy wszystkie style dla animacji
    allCards.forEach((card, index) => {
        // Dodajemy unikalny identyfikator
        if (!card.id) {
            card.id = `animated-card-${index}`;
        }
        
        // Resetujemy style CSS
        card.style.willChange = 'opacity, transform';
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        
        // Różne opóźnienia dla efektu kaskadowego
        const delay = (index % 5) * 0.1; // Maksymalnie 0.4s opóźnienia
        card.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, 
                                 transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`;
        
        // Dodajemy klasę dla łatwiejszego debugowania
        card.classList.add('js-animated');
        
        console.log(`Przygotowano kartę #${card.id} (opóźnienie: ${delay}s)`);
    });
    
    // Konfiguracja Intersection Observer
    const observerOptions = {
        threshold: 0.15, // Kiedy 15% karty jest widoczne
        rootMargin: '0px 0px -50px 0px' // Obserwuj 50px przed wejściem w viewport
    };
    
    let animatedCount = 0;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animatedCount++;
                console.log(`Animacja karty #${entry.target.id} (${animatedCount}/${allCards.length})`);
                
                // Uruchamiamy animację
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Usuwamy obserwację po animacji
                setTimeout(() => {
                    observer.unobserve(entry.target);
                    entry.target.classList.add('js-animated-complete');
                    console.log(`Zakończono animację karty #${entry.target.id}`);
                }, 800);
            }
        });
    }, observerOptions);
    
    // Rozpoczynamy obserwację wszystkich kart
    allCards.forEach(card => {
        observer.observe(card);
    });
    
    // Alternatywnie: animuj wszystkie karty po załadowaniu strony (opcjonalnie)
    setTimeout(() => {
        const remainingCards = allCards.filter(card => !card.classList.contains('js-animated-complete'));
        if (remainingCards.length > 0 && remainingCards.length === allCards.length) {
            console.log('Wymuszanie animacji po timeout...');
            remainingCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.classList.add('js-animated-complete');
                }, index * 100);
            });
        }
    }, 2000); // 2 sekundy timeout
}

// FUNKCJA DLA EFEKTU HOVER W GALERIACH
function setupGalleryHover() {
    const galleryItems = document.querySelectorAll('.gallery-item, .image-container, .photo-item, .gallery-grid img');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.05)';
                img.style.transition = 'transform 0.4s ease';
            } else if (this.tagName === 'IMG') {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.4s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            } else if (this.tagName === 'IMG') {
                this.style.transform = 'scale(1)';
            }
        });
    });
}

// FUNKCJA DLA EFEKTU PARALLAX
function setupParallaxEffect() {
    const heroSection = document.querySelector('.hero, .page-hero, .parallax-section');
    
    if (heroSection && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            heroSection.style.backgroundPosition = `center ${rate}px`;
        });
    }
}

// FUNKCJA DO OBSŁUGI PRZYCISKÓW "CZYTAJ WIĘCEJ"
function setupReadMoreButtons() {
    const readMoreButtons = document.querySelectorAll('.read-more, .feature-link, .btn-more');
    
    readMoreButtons.forEach(button => {
        // Jeśli przycisk ma href, to działa normalnie
        if (button.getAttribute('href') && button.getAttribute('href') !== '#') {
            return;
        }
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.classList.toggle('expanded');
                    this.textContent = targetElement.classList.contains('expanded') 
                        ? 'Czytaj mniej' 
                        : 'Czytaj więcej';
                }
            }
        });
    });
}

// FUNKCJA LICZNIKA ODWIEDZIN
function initVisitCounter() {
    const visitCounter = document.getElementById('visit-counter');
    if (visitCounter) {
        let visits = localStorage.getItem('siteVisits') || 0;
        visits = parseInt(visits) + 1;
        localStorage.setItem('siteVisits', visits);
        visitCounter.textContent = visits;
        
        // Animacja licznika
        visitCounter.style.display = 'inline-block';
        visitCounter.style.transform = 'scale(1.3)';
        visitCounter.style.color = '#4cc9f0';
        visitCounter.style.transition = 'transform 0.3s ease, color 0.3s ease';
        
        setTimeout(() => {
            visitCounter.style.transform = 'scale(1)';
            visitCounter.style.color = '#4cc9f0';
        }, 500);
    }
}

// MODAL ZDJĘCIOWY
function setupImageModal() {
    // Tworzymy modal tylko jeśli istnieją zdjęcia
    const images = document.querySelectorAll('.gallery-item img, .image-container img, .gallery-grid img');
    if (images.length === 0) return;
    
    // Sprawdzamy czy modal już istnieje
    if (document.querySelector('.image-modal')) return;
    
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img src="" alt="">
            <div class="modal-caption"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Dodajemy style CSS dla modalu
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .image-modal.active {
            opacity: 1;
        }
        
        .modal-content {
            max-width: 90%;
            max-height: 90%;
            position: relative;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        
        .image-modal.active .modal-content {
            transform: scale(1);
        }
        
        .modal-content img {
            max-width: 100%;
            max-height: 80vh;
            display: block;
            border-radius: 5px;
        }
        
        .modal-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 35px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: #4cc9f0;
        }
        
        .modal-caption {
            color: white;
            text-align: center;
            padding: 10px;
            font-size: 1.1rem;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 0 0 5px 5px;
        }
        
        .clickable-image {
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        .clickable-image:hover {
            transform: scale(1.02);
        }
    `;
    document.head.appendChild(modalStyle);
    
    // Dodajemy obsługę kliknięcia na zdjęcia
    images.forEach(img => {
        img.classList.add('clickable-image');
        img.addEventListener('click', function() {
            const modalImg = modal.querySelector('img');
            const caption = modal.querySelector('.modal-caption');
            
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            caption.textContent = this.alt || 'Brak opisu';
            
            modal.style.display = 'flex';
            // Małe opóźnienie dla animacji
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        });
    });
    
    // Zamykanie modala
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC zamyka modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// OBSŁUGA ZAŁADOWANIA STRONY
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM załadowany - inicjalizacja strony');
    initPage();
    setupImageModal();
});

// OBSŁUGA PEŁNEGO ZAŁADOWANIA STRONY
window.addEventListener('load', function() {
    console.log('Strona w pełni załadowana - ponowna inicjalizacja animacji');
    // Ponownie inicjalizujemy animacje kart
    setTimeout(() => {
        animateCardsOnScroll();
    }, 500);
});

// Obsługa zmiany rozmiaru okna
window.addEventListener('resize', function() {
    // Przywróć normalne pozycje kart po zmianie rozmiaru
    const cards = document.querySelectorAll('.animated-card');
    cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
});