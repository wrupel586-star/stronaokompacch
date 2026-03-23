// JavaScript dla strony galeria.html - UPROSZCZONY I POPRAWIONY

document.addEventListener('DOMContentLoaded', function() {
    console.log('Galeria załadowana');
    
    // Inicjalizacja filtrów
    setupGalleryFilters();
    
    // Inicjalizacja modalu
    setupGalleryModal();
    
    // Inicjalizacja systemu polubień
    setupLikeSystem();
    
    // Załaduj zapisane polubienia
    loadLikesFromStorage();
});

function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Usuwamy aktywną klasę ze wszystkich przycisków
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Dodajemy aktywną klasę do klikniętego przycisku
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filtrujemy galerię
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function setupGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const closeBtn = modal.querySelector('.close-modal');
    
    if (!modal) {
        console.error('Modal nie znaleziony!');
        return;
    }
    
    // Dane dla 5 przykładowych konstrukcji
    const galleryData = [
        {
            id: 1,
            title: "Gaming PC z chłodzeniem wodnym",
            category: "gaming",
            likes: 156,
            description: "Wydajny komputer gamingowy z customowym chłodzeniem wodnym. Zbudowany dla płynnej rozgrywki w 4K. System został zoptymalizowany pod kątem niskich temperatur i cichej pracy.",
            specs: [
                "Procesor: Intel Core i9-14900K",
                "Karta graficzna: NVIDIA RTX 4080 Super",
                "RAM: 32GB DDR5 6000MHz CL30",
                "Dysk: 2TB NVMe PCIe 4.0 Samsung 990 Pro",
                "Chłodzenie: Custom loop EKWB",
                "Obudowa: Lian Li O11 Dynamic EVO",
                "Zasilacz: Corsair RM1000x 1000W",
                "Prompt dla AI: 'high end gaming PC with custom water cooling, RGB lighting, glass side panel, professional photography, studio lighting, detailed components visible'"
            ],
            author: "TechMaster",
            date: "15.03.2024",
            views: 1247
        },
        {
            id: 2,
            title: "Stacja robocza do renderowania 3D",
            category: "workstation",
            likes: 89,
            description: "Profesjonalna stacja robocza przeznaczona do renderowania 3D i animacji. Wyposażona w najwydajniejsze komponenty dla twórców treści.",
            specs: [
                "Procesor: AMD Ryzen 9 7950X",
                "Karta graficzna: NVIDIA RTX 4090",
                "RAM: 64GB DDR5 6400MHz",
                "Dyski: 4TB NVMe PCIe 5.0",
                "Chłodzenie: Noctua NH-D15",
                "Obudowa: Fractal Design Meshify 2",
                "Monitor: 2x Dell UltraSharp 32\" 4K",
                "Prompt dla AI: 'professional 3D rendering workstation, clean setup, dual monitors, powerful components, minimalistic design, office environment'"
            ],
            author: "3D_Artist",
            date: "22.02.2024",
            views: 892
        },
        {
            id: 3,
            title: "Kompaktowy Mini-ITX Build",
            category: "sff",
            likes: 203,
            description: "Mały ale potężny komputer w formacie Mini-ITX. Idealny do gier i pracy w ograniczonej przestrzeni. Zachowuje wydajność pełnowymiarowego PC.",
            specs: [
                "Procesor: AMD Ryzen 7 7800X3D",
                "Karta graficzna: NVIDIA RTX 4070 Super",
                "RAM: 32GB DDR5 6000MHz",
                "Dysk: 2TB NVMe PCIe 4.0",
                "Obudowa: Fractal Design Terra",
                "Zasilacz: Corsair SF750 750W",
                "Wymiary: 218 × 155 × 325 mm",
                "Prompt dla AI: 'small form factor mini ITX PC build, compact design, wooden case accents, portable gaming PC, clean desk setup'"
            ],
            author: "SFF_Enthusiast",
            date: "10.03.2024",
            views: 1567
        },
        {
            id: 4,
            title: "RGB Gaming Setup",
            category: "rgb",
            likes: 312,
            description: "Ekstremalne podświetlenie RGB zsynchronizowane we wszystkich komponentach. Każdy element świeci w harmonii z resztą setupu.",
            specs: [
                "Procesor: Intel Core i7-14700K",
                "Karta graficzna: ASUS ROG Strix RTX 4070 Ti",
                "RAM: 32GB DDR5 6000MHz RGB",
                "Dyski: 2TB NVMe + 4TB SSD",
                "Wentylatory: 9x Lian Li UNI Fan SL-INF",
                "Obudowa: Lian Li O11 Dynamic XL",
                "Kontroler: Razer Chroma ARGB",
                "Prompt dla AI: 'RGB gaming setup with synchronized lighting, purple and blue color scheme, clean cable management, multiple monitors, gaming peripherals'"
            ],
            author: "RGB_King",
            date: "05.03.2024",
            views: 2341
        },
        {
            id: 5,
            title: "Retro Gaming PC",
            category: "custom",
            likes: 127,
            description: "Unikalna konstrukcja inspirowana retro komputerami. Obudowa została ręcznie zmodyfikowana z zachowaniem nowoczesnych komponentów wewnątrz.",
            specs: [
                "Procesor: AMD Ryzen 5 7600X",
                "Karta graficzna: AMD RX 7800 XT",
                "RAM: 32GB DDR5 5600MHz",
                "Dysk: 2TB NVMe PCIe 4.0",
                "Obudowa: Custom retro mod",
                "Styl: Lat 90-te inspirowany",
                "Kolory: Beżowy i brązowy",
                "Prompt dla AI: 'retro style gaming PC, beige and brown colors, vintage computer aesthetic, modern components inside old case, nostalgic gaming setup'"
            ],
            author: "RetroModder",
            date: "18.02.2024",
            views: 987
        }
    ];
    
    // Obsługa kliknięcia "Zobacz szczegóły" dla istniejących elementów
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details') || e.target.closest('.view-details')) {
            e.preventDefault();
            e.stopPropagation();
            
            // Znajdź najbliższy element galerii
            const galleryItem = e.target.closest('.gallery-item');
            if (!galleryItem) return;
            
            // Pobierz indeks z atrybutu data-id
            const itemId = galleryItem.getAttribute('data-id');
            if (!itemId) return;
            
            // Znajdź dane dla tego ID
            const data = galleryData.find(item => item.id == itemId);
            if (data) {
                openModal(data, galleryItem);
            }
        }
        
        // Obsługa kliknięcia na całą kartę galerii
        if (e.target.closest('.gallery-item') && !e.target.closest('.view-details')) {
            const galleryItem = e.target.closest('.gallery-item');
            const itemId = galleryItem.getAttribute('data-id');
            if (!itemId) return;
            
            const data = galleryData.find(item => item.id == itemId);
            if (data) {
                openModal(data, galleryItem);
            }
        }
    });
    
    // Otwieranie modala - POPRAWIONE ANIMACJE
    function openModal(data, galleryItem) {
        console.log('Otwieram modal dla:', data.title);
        
        // Najpierw ukryj modal (reset)
        modal.style.display = 'none';
        modal.classList.remove('active');
        
        // Ustaw dane
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalCategory').textContent = getCategoryDisplayName(data.category);
        
        // Pobierz zapisane polubienia
        const savedLikes = getLikesForItem(data.id);
        document.getElementById('modalLikes').innerHTML = `<i class="fas fa-heart"></i> ${savedLikes}`;
        
        document.getElementById('modalDescription').textContent = data.description;
        
        // Specyfikacje
        const specsContainer = document.getElementById('modalSpecs');
        specsContainer.innerHTML = data.specs.map(spec => 
            `<div class="spec-item"><i class="fas fa-check"></i> ${spec}</div>`
        ).join('');
        
        // Obrazek - używamy tego z karty
        const img = galleryItem.querySelector('img');
        if (img) {
            const modalImg = document.getElementById('modalImg');
            modalImg.src = img.src;
            modalImg.alt = data.title;
            
            // Zapobiegaj ładowaniu nowego obrazka jeśli to ten sam
            if (modalImg.complete) {
                showModalWithAnimation();
            } else {
                modalImg.onload = showModalWithAnimation;
            }
        } else {
            showModalWithAnimation();
        }
        
        // Ustaw przycisk like
        setupModalLikeButton(data.id, savedLikes);
        
        // Zapisz wyświetlenie
        incrementViews(data.id);
    }
    
    // Pokaz modal z płynną animacją
    function showModalWithAnimation() {
        // Reset animacji
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        
        // Pokaż modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Opóźnienie dla płynnej animacji
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
            modal.classList.add('active');
        }, 10);
    }
    
    // Konfiguracja przycisku like w modal
    function setupModalLikeButton(itemId, currentLikes) {
        const likeBtn = modal.querySelector('.btn-like');
        
        if (!likeBtn) return;
        
        // Sprawdź czy użytkownik już polubił
        if (hasUserLikedItem(itemId)) {
            likeBtn.innerHTML = '<i class="fas fa-heart"></i> Już polubione';
            likeBtn.classList.add('liked');
            likeBtn.disabled = true;
        } else {
            likeBtn.innerHTML = '<i class="fas fa-heart"></i> Polub';
            likeBtn.classList.remove('liked');
            likeBtn.disabled = false;
            
            // Usuń stare event listeners i dodaj nowy
            const newLikeBtn = likeBtn.cloneNode(true);
            likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
            
            newLikeBtn.addEventListener('click', function() {
                handleModalLike(itemId, currentLikes);
            });
        }
    }
    
    // Obsługa like w modal
    function handleModalLike(itemId, currentLikes) {
        if (hasUserLikedItem(itemId)) {
            showNotification('Już polubiłeś tę konstrukcję!', 'info');
            return;
        }
        
        // Zwiększ licznik
        const newLikes = currentLikes + 1;
        saveLikeForItem(itemId, newLikes);
        
        // Aktualizuj wyświetlanie
        document.getElementById('modalLikes').innerHTML = `<i class="fas fa-heart"></i> ${newLikes}`;
        
        // Aktualizuj przycisk
        const likeBtn = modal.querySelector('.btn-like');
        likeBtn.innerHTML = '<i class="fas fa-heart"></i> Już polubione';
        likeBtn.classList.add('liked');
        likeBtn.disabled = true;
        
        // Aktualizuj licznik na karcie
        updateGalleryItemLikes(itemId, newLikes);
        
        // Pokaż potwierdzenie
        showNotification('Dziękujemy za polubienie!', 'success');
    }
    
    // Zamykanie modala z animacją
    function closeModal() {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    // Event listeners dla zamknięcia
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Obsługa przycisku share
    const shareBtn = modal.querySelector('.btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const title = document.getElementById('modalTitle').textContent;
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: 'Zobacz tę niesamowitą konstrukcję komputerową!',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Skopiowano!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    }
    
    // Pomocnicza funkcja do wyświetlania nazw kategorii
    function getCategoryDisplayName(category) {
        const categories = {
            'gaming': 'Gaming',
            'workstation': 'Stacja robocza',
            'sff': 'Mini PC',
            'rgb': 'RGB Build',
            'custom': 'Custom'
        };
        return categories[category] || category;
    }
}

// SYSTEM POLUBIEŃ - UPROSZCZONY
function setupLikeSystem() {
    // Polubienia na kartach galerii
    document.addEventListener('click', function(e) {
        const likeElement = e.target.closest('.gallery-likes');
        if (likeElement && !e.target.closest('.view-details')) {
            e.preventDefault();
            e.stopPropagation();
            
            const galleryItem = likeElement.closest('.gallery-item');
            const itemId = galleryItem.getAttribute('data-id');
            
            if (itemId) {
                handleGalleryLike(itemId, likeElement);
            }
        }
    });
}

function handleGalleryLike(itemId, likeElement) {
    // Sprawdź czy już polubiono
    if (hasUserLikedItem(itemId)) {
        showNotification('Już polubiłeś tę konstrukcję!', 'info');
        return;
    }
    
    // Pobierz aktualne polubienia
    let currentLikes = parseInt(likeElement.textContent.match(/\d+/)[0]) || 0;
    const newLikes = currentLikes + 1;
    
    // Zapisz
    saveLikeForItem(itemId, newLikes);
    
    // Aktualizuj wyświetlanie
    likeElement.innerHTML = `<i class="fas fa-heart"></i> ${newLikes}`;
    
    // Animacja
    likeElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        likeElement.style.transform = 'scale(1)';
    }, 300);
    
    showNotification('Polubiono konstrukcję!', 'success');
}

// Funkcje localStorage dla polubień
function saveLikeForItem(itemId, likes) {
    let likedItems = JSON.parse(localStorage.getItem('galleryLikes') || '{}');
    likedItems[itemId] = likes;
    localStorage.setItem('galleryLikes', JSON.stringify(likedItems));
    
    // Zapisz że użytkownik polubił
    let userLikes = JSON.parse(localStorage.getItem('userGalleryLikes') || '[]');
    if (!userLikes.includes(parseInt(itemId))) {
        userLikes.push(parseInt(itemId));
        localStorage.setItem('userGalleryLikes', JSON.stringify(userLikes));
    }
}

function getLikesForItem(itemId) {
    const likedItems = JSON.parse(localStorage.getItem('galleryLikes') || '{}');
    return likedItems[itemId] || getDefaultLikes(itemId);
}

function getDefaultLikes(itemId) {
    // Domyślne wartości
    const defaultLikes = {
        1: 156,
        2: 89,
        3: 203,
        4: 312,
        5: 127
    };
    return defaultLikes[itemId] || Math.floor(Math.random() * 200) + 50;
}

function hasUserLikedItem(itemId) {
    const userLikes = JSON.parse(localStorage.getItem('userGalleryLikes') || '[]');
    return userLikes.includes(parseInt(itemId));
}

function loadLikesFromStorage() {
    // Załaduj zapisane polubienia do kart
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const itemId = item.getAttribute('data-id');
        if (itemId) {
            const likes = getLikesForItem(itemId);
            const likeElement = item.querySelector('.gallery-likes');
            if (likeElement) {
                likeElement.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;
            }
        }
    });
}

function updateGalleryItemLikes(itemId, newLikes) {
    // Znajdź kartę z tym ID i zaktualizuj
    const galleryItem = document.querySelector(`.gallery-item[data-id="${itemId}"]`);
    if (galleryItem) {
        const likeElement = galleryItem.querySelector('.gallery-likes');
        if (likeElement) {
            likeElement.innerHTML = `<i class="fas fa-heart"></i> ${newLikes}`;
        }
    }
}

function incrementViews(itemId) {
    // Zwiększ licznik wyświetleń (symulacja)
    let views = JSON.parse(localStorage.getItem('galleryViews') || '{}');
    views[itemId] = (views[itemId] || 0) + 1;
    localStorage.setItem('galleryViews', JSON.stringify(views));
}

// Pomocnicza funkcja do powiadomień
function showNotification(message, type = 'info') {
    // Usuń istniejące powiadomienia
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Pokaż z animacją
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ukryj po 3 sekundach
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// USUŃ WSZYSTKIE DODANE OBRAZKI Z LOCALSTORAGE (czyszczenie buga)
localStorage.removeItem('userGalleryItems');
console.log('Wyczyściłem bugowane obrazy z localStorage');