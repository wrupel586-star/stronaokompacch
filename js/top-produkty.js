// Obsługa strony Top Produkty

function initTopProductsPage() {
    console.log('Inicjalizacja strony Top Produkty');
    
    // Obsługa przełączania kategorii
    const categoryTabs = document.querySelectorAll('.category-tab');
    const rankingTables = document.querySelectorAll('.ranking-table');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Usuń klasę active ze wszystkich przycisków
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Dodaj klasę active do klikniętego przycisku
            this.classList.add('active');
            
            // Pobierz kategorię z data-category
            const category = this.getAttribute('data-category');
            
            // Ukryj wszystkie tabele
            rankingTables.forEach(table => {
                table.classList.remove('active');
            });
            
            // Pokaż odpowiednią tabelę
            const targetTable = document.getElementById(`table-${category}`);
            if (targetTable) {
                targetTable.classList.add('active');
                
                // Dodaj efekt animacji
                targetTable.style.opacity = '0';
                targetTable.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    targetTable.style.opacity = '1';
                    targetTable.style.transform = 'translateY(0)';
                }, 10);
            }
        });
    });
    
    // Obsługa filtrów w tabelach
    const filters = document.querySelectorAll('.table-filter select');
    filters.forEach(filter => {
        filter.addEventListener('change', function() {
            const filterValue = this.value;
            const tableId = this.id.replace('filter-', '');
            const tableRows = document.querySelectorAll(`#table-${tableId} tbody tr`);
            
            tableRows.forEach(row => {
                let shouldShow = true;
                
                // Logika filtrowania dla różnych tabel
                if (tableId === 'cpu') {
                    if (filterValue === 'gaming') {
                        const isGaming = row.querySelector('.gaming-tag');
                        shouldShow = isGaming !== null;
                    } else if (filterValue === 'productivity') {
                        const isProductivity = row.querySelector('.productivity-tag');
                        shouldShow = isProductivity !== null;
                    } else if (filterValue === 'budget') {
                        const isBudget = row.querySelector('.budget-tag');
                        shouldShow = isBudget !== null;
                    }
                } else if (tableId === 'gpu') {
                    if (filterValue === 'nvidia') {
                        shouldShow = row.querySelector('.brand-nvidia') !== null;
                    } else if (filterValue === 'amd') {
                        shouldShow = row.querySelector('.brand-amd') !== null;
                    }
                }
                
                // Pokaż/ukryj wiersz
                row.style.display = shouldShow ? '' : 'none';
                
                // Animacja pojawienia się
                if (shouldShow) {
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(-10px)';
                    row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    setTimeout(() => {
                        row.style.opacity = '1';
                        row.style.transform = 'translateX(0)';
                    }, 100 * parseInt(row.querySelector('.rank-badge').textContent));
                }
            });
        });
    });
    
    // Obsługa porównania cen
    setupPriceComparison();
    
    // Animacja wierszy tabel
    animateTableRows();
    
    // Obsługa kliknięć w produkty
    setupProductDetails();
}

// Funkcja do obsługi porównania cen
function setupPriceComparison() {
    const componentSelect = document.getElementById('price-component');
    const sortSelect = document.getElementById('price-sort');
    
    if (componentSelect && sortSelect) {
        const updatePrices = () => {
            const component = componentSelect.value;
            const sortBy = sortSelect.value;
            
            // Tutaj w rzeczywistej aplikacji pobieralibyśmy dane z API
            // Na potrzeby demo, symulujemy zmianę cen
            
            const priceRows = document.querySelectorAll('.price-table tbody tr');
            priceRows.forEach(row => {
                // Symulacja różnych cen dla różnych sklepów
                const shops = ['X-Kom', 'Morele', 'Komputronik', 'Media Expert'];
                shops.forEach(shop => {
                    const basePrice = Math.floor(Math.random() * 1000) + 1000;
                    const variation = Math.floor(Math.random() * 200) - 100;
                    const price = Math.max(800, basePrice + variation);
                    
                    const shopCell = row.querySelector(`[data-shop="${shop}"]`);
                    if (shopCell) {
                        shopCell.textContent = `${price} zł`;
                        
                        // Resetujemy klasy
                        shopCell.classList.remove('lowest', 'highest');
                    }
                });
                
                // Znajdź najniższą i najwyższą cenę
                const shopPrices = {};
                shops.forEach(shop => {
                    const cell = row.querySelector(`[data-shop="${shop}"]`);
                    if (cell) {
                        const price = parseInt(cell.textContent);
                        shopPrices[shop] = price;
                    }
                });
                
                const prices = Object.values(shopPrices);
                const lowest = Math.min(...prices);
                const highest = Math.max(...prices);
                
                // Oznacz najniższą i najwyższą cenę
                Object.entries(shopPrices).forEach(([shop, price]) => {
                    const cell = row.querySelector(`[data-shop="${shop}"]`);
                    if (cell) {
                        if (price === lowest) {
                            cell.classList.add('lowest');
                        } else if (price === highest) {
                            cell.classList.add('highest');
                        }
                    }
                });
                
                // Oblicz różnicę
                const differenceCell = row.querySelector('.price-difference');
                if (differenceCell && prices.length > 1) {
                    const difference = highest - lowest;
                    differenceCell.textContent = `${difference} zł`;
                    
                    if (difference > 200) {
                        differenceCell.className = 'price-difference negative';
                    } else {
                        differenceCell.className = 'price-difference positive';
                    }
                }
            });
        };
        
        componentSelect.addEventListener('change', updatePrices);
        sortSelect.addEventListener('change', updatePrices);
        
        // Inicjalizuj ceny
        setTimeout(updatePrices, 1000);
    }
}

// Animacja wierszy tabel
function animateTableRows() {
    const tableRows = document.querySelectorAll('.product-table tbody tr');
    
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 100 * index);
    });
}

// Obsługa szczegółów produktu
function setupProductDetails() {
    const productRows = document.querySelectorAll('.product-row');
    
    productRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Unikamy otwierania szczegółów przy kliknięciu na linki
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            const productName = this.querySelector('strong').textContent;
            const rating = this.querySelector('.rating')?.textContent || 'Brak oceny';
            const rank = this.querySelector('.rank-badge').textContent;
            
            // W rzeczywistej aplikacji tutaj byłoby przekierowanie do strony produktu
            // lub otwarcie modalu z szczegółami
            console.log(`Kliknięto produkt: ${productName} (miejsce: ${rank}, ocena: ${rating})`);
            
            // Możesz dodać modal z szczegółami produktu:
            // openProductModal(this);
        });
    });
}

// Funkcja do sortowania tabel (opcjonalnie)
function sortTable(tableId, columnIndex, ascending = true) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent;
        const bValue = b.cells[columnIndex].textContent;
        
        // Próba parsowania liczb
        const aNum = parseFloat(aValue.replace(/[^\d.-]/g, ''));
        const bNum = parseFloat(bValue.replace(/[^\d.-]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return ascending ? aNum - bNum : bNum - aNum;
        }
        
        // Sortowanie tekstowe
        return ascending 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
    });
    
    // Usuń istniejące wiersze
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    
    // Dodaj posortowane wiersze
    rows.forEach(row => tbody.appendChild(row));
}

// Funkcja do obsługi responsywności tabel
function setupTableResponsiveness() {
    function adjustTableLayout() {
        const tables = document.querySelectorAll('.product-table');
        
        if (window.innerWidth < 768) {
            tables.forEach(table => {
                // Możesz dodać logikę przekształcania tabel na karty dla małych ekranów
                if (!table.classList.contains('mobile-transformed')) {
                    table.classList.add('mobile-transformed');
                    // Tutaj dodaj kod do przekształcenia tabeli
                }
            });
        }
    }
    
    // Sprawdzaj przy załadowaniu i zmianie rozmiaru
    adjustTableLayout();
    window.addEventListener('resize', adjustTableLayout);
}

// Funkcja do generowania wykresów (opcjonalnie)
function generateProductCharts() {
    // W rzeczywistej aplikacji tutaj można dodać wykresy
    // np. porównanie cen, wydajności itp.
    console.log('Miejsce na wykresy porównawcze produktów');
    
    // Przykład użycia Canvas/Chart.js:
    // const ctx = document.getElementById('productChart').getContext('2d');
    // new Chart(ctx, { type: 'bar', data: {...}, options: {...} });
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function() {
    initTopProductsPage();
    
    // Dodaj animację dla pasków ocen
    setTimeout(() => {
        const scoreBars = document.querySelectorAll('.score-bar');
        scoreBars.forEach(bar => {
            const originalWidth = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = originalWidth;
            }, 100);
        });
    }, 500);
    
    // Dodaj obsługę responsywności
    setupTableResponsiveness();
});

// Obsługa pełnego załadowania strony
window.addEventListener('load', function() {
    console.log('Strona Top Produkty w pełni załadowana');
    
    // Możesz dodać wykresy po załadowaniu
    // generateProductCharts();
});