// Obsługa strony Przyszłość Technologii

let predictionChart = null;
let currentYear = 2024;
let currentTech = 'cpu';
let quizData = null;
let currentQuestion = 0;
let score = 0;

function initFuturePage() {
    console.log('Inicjalizacja strony Przyszłość Technologii');
    
    // Inicjalizacja timeline
    initTimeline();
    
    // Inicjalizacja symulacji
    initSimulation();
    
    // Inicjalizacja karuzeli ekspertów
    initExpertsCarousel();
    
    // Inicjalizacja quizu
    initQuiz();
    
    // Animacje
    initAnimations();
    
    // Obsługa przewijania
    initScrollHandlers();
}

// Inicjalizacja timeline
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Dodaj opóźnienie dla efektu kaskadowego
                const index = Array.from(timelineItems).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.2}s`;
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    timelineItems.forEach(item => {
        // Dodaj początkowy styl dla animacji
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        observer.observe(item);
    });
    
    // Dodaj klasę visible do pierwszego elementu od razu
    if (timelineItems.length > 0) {
        setTimeout(() => {
            timelineItems[0].classList.add('visible');
        }, 300);
    }
}

// Inicjalizacja symulacji
function initSimulation() {
    const yearSlider = document.getElementById('year-slider');
    const yearValue = document.getElementById('year-value');
    const techSelect = document.getElementById('tech-select');
    const resetBtn = document.getElementById('reset-filters');
    const currentSimulationSpan = document.getElementById('current-simulation');
    
    if (!yearSlider || !techSelect) return;
    
    // Dane symulacji
    const simulationData = {
        cpu: {
            name: 'Procesory',
            2024: { cores: 8, clock: '5.0 GHz', perf: '100%', power: '100W' },
            2026: { cores: 16, clock: '5.8 GHz', perf: '200%', power: '120W' },
            2028: { cores: 32, clock: '6.5 GHz', perf: '400%', power: '150W' },
            2030: { cores: 64, clock: '7.0 GHz', perf: '800%', power: '180W' },
            2032: { cores: 96, clock: '8.0 GHz', perf: '1500%', power: '200W' },
            2034: { cores: 128, clock: '9.0 GHz', perf: '2500%', power: '220W' },
            2036: { cores: 192, clock: '10.0 GHz', perf: '4000%', power: '250W' },
            2038: { cores: 256, clock: '12.0 GHz', perf: '6000%', power: '280W' },
            2040: { cores: 384, clock: '15.0 GHz', perf: '10000%', power: '300W' }
        },
        gpu: {
            name: 'Karty Graficzne',
            2024: { cores: 16384, clock: '2.5 GHz', perf: '100%', power: '300W' },
            2026: { cores: 24576, clock: '2.8 GHz', perf: '180%', power: '350W' },
            2028: { cores: 32768, clock: '3.2 GHz', perf: '300%', power: '400W' },
            2030: { cores: 49152, clock: '3.5 GHz', perf: '500%', power: '450W' },
            2032: { cores: 65536, clock: '4.0 GHz', perf: '800%', power: '500W' },
            2034: { cores: 98304, clock: '4.5 GHz', perf: '1200%', power: '550W' },
            2036: { cores: 131072, clock: '5.0 GHz', perf: '2000%', power: '600W' },
            2038: { cores: 196608, clock: '5.5 GHz', perf: '3000%', power: '650W' },
            2040: { cores: 262144, clock: '6.0 GHz', perf: '5000%', power: '700W' }
        },
        ram: {
            name: 'Pamięć RAM',
            2024: { cores: '64GB', clock: '6400 MHz', perf: '100%', power: '30W' },
            2026: { cores: '128GB', clock: '8000 MHz', perf: '200%', power: '35W' },
            2028: { cores: '256GB', clock: '10000 MHz', perf: '400%', power: '40W' },
            2030: { cores: '512GB', clock: '12000 MHz', perf: '800%', power: '45W' },
            2032: { cores: '1TB', clock: '15000 MHz', perf: '1500%', power: '50W' },
            2034: { cores: '2TB', clock: '18000 MHz', perf: '3000%', power: '55W' },
            2036: { cores: '4TB', clock: '20000 MHz', perf: '5000%', power: '60W' },
            2038: { cores: '8TB', clock: '25000 MHz', perf: '8000%', power: '65W' },
            2040: { cores: '16TB', clock: '30000 MHz', perf: '12000%', power: '70W' }
        }
    };
    
    // Aktualizacja symulacji
    const updateSimulation = () => {
        currentYear = parseInt(yearSlider.value);
        currentTech = techSelect.value;
        yearValue.textContent = currentYear;
        
        // Pobierz dane dla wybranego roku i technologii
        const data = simulationData[currentTech]?.[currentYear];
        if (!data) return;
        
        // Aktualizuj statystyki
        document.getElementById('stat-cores').textContent = data.cores;
        document.getElementById('stat-clock').textContent = data.clock;
        document.getElementById('stat-perf').textContent = data.perf;
        document.getElementById('stat-power').textContent = data.power;
        
        // Aktualizuj tytuł
        const techNames = {
            cpu: 'Procesory',
            gpu: 'Karty Graficzne',
            ram: 'Pamięć RAM',
            storage: 'Dyski SSD',
            network: 'Sieć komputerowa'
        };
        document.getElementById('sim-tech-title').textContent = 
            `${techNames[currentTech]} w ${currentYear}`;
        
        // Aktualizuj wizualizację CPU
        if (currentTech === 'cpu') {
            updateCpuVisualization(data.cores);
        }
        
        // Generuj przewidywania
        generatePredictions(currentYear, currentTech);
        
        // Aktualizuj status symulacji
        currentSimulationSpan.textContent = `${techNames[currentTech]} ${currentYear}`;
        
        // Aktualizuj wykres
        updateChart(currentTech, currentYear);
    };
    
    // Aktualizacja wizualizacji CPU
    const updateCpuVisualization = (cores) => {
        const cpuVisual = document.getElementById('cpu-visual');
        if (!cpuVisual) return;
        
        // Usuń istniejące rdzenie
        cpuVisual.innerHTML = '';
        
        // Oblicz liczbę rdzeni do wyświetlenia (maksymalnie 8 dla czytelności)
        const displayCores = Math.min(parseInt(cores), 8);
        
        // Dodaj nowe rdzenie
        for (let i = 0; i < displayCores; i++) {
            const core = document.createElement('div');
            core.className = 'cpu-core';
            core.style.cssText = `--i:${i + 1}`;
            
            cpuVisual.appendChild(core);
        }
        
        // Uruchom animację
        setTimeout(() => {
            const cores = cpuVisual.querySelectorAll('.cpu-core');
            cores.forEach((core, index) => {
                core.style.animation = `pulse 2s infinite ${index * 0.2}s`;
            });
        }, 100);
    };
    
    // Generowanie przewidywań tekstowych
    const generatePredictions = (year, tech) => {
        const predictionsContent = document.getElementById('predictions-content');
        let predictions = '';
        
        if (tech === 'cpu') {
            if (year <= 2026) {
                predictions = '<p><strong>Bliska przyszłość (2024-2026):</strong> Główny rozwój w obszarze zwiększania liczby rdzeni i optymalizacji energetycznej. Wprowadzenie 3D V-Cache na większą skalę.</p>';
            } else if (year <= 2030) {
                predictions = '<p><strong>Średnioterminowa przyszłość (2026-2030):</strong> Masowe wprowadzenie procesorów z akceleratorami AI. Integracja pamięci 3D Stacked bezpośrednio na chipie.</p>';
            } else {
                predictions = '<p><strong>Długoterminowa przyszłość (2030+):</strong> Procesory oparte na nowych materiałach (graphene, photonic). Hybrydowe układy klasyczne-kwantowe dla specjalistycznych zadań.</p>';
            }
        } else if (tech === 'gpu') {
            if (year <= 2026) {
                predictions = '<p><strong>Bliska przyszłość (2024-2026):</strong> Ray tracing staje się standardem. AI upscaling (DLSS/FSR) osiąga jakość natywnego renderowania.</p>';
            } else if (year <= 2030) {
                predictions = '<p><strong>Średnioterminowa przyszłość (2026-2030):</strong> Path tracing w czasie rzeczywistym dla wszystkich gier. GPU stają się centrami obliczeń AI.</p>';
            } else {
                predictions = '<p><strong>Długoterminowa przyszłość (2030+):</strong> Fotorealistyczny rendering w czasie rzeczywistym. Bezpośrednia integracja z wyświetlaczami siatkówkowymi.</p>';
            }
        } else if (tech === 'ram') {
            if (year <= 2026) {
                predictions = '<p><strong>Bliska przyszłość (2024-2026):</strong> DDR5 staje się standardem, DDR6 debiutuje. Wzrost prędkości do 8000+ MHz.</p>';
            } else if (year <= 2030) {
                predictions = '<p><strong>Średnioterminowa przyszłość (2026-2030):</strong> Pamięć 3D Stacked z bezpośrednim dostępem dla CPU/GPU. Pojemności terabajtowe.</p>';
            } else {
                predictions = '<p><strong>Długoterminowa przyszłość (2030+):</strong> Pamięci oparte na nowych technologiach (MRAM, FeRAM). Integracja z procesorami w package.</p>';
            }
        }
        
        predictionsContent.innerHTML = predictions;
    };
    
    // Aktualizacja wykresu
    const updateChart = (tech, year) => {
        const ctx = document.getElementById('predictionChart');
        if (!ctx) return;
        
        // Dane dla wykresu
        const years = [];
        const performance = [];
        const efficiency = [];
        
        // Generuj dane historyczne i prognozowane
        for (let y = 2020; y <= 2040; y += 2) {
            years.push(y.toString());
            
            if (y <= year) {
                // Dane historyczne/prognozowane
                performance.push(Math.pow(1.15, (y - 2020) / 2) * 100); // 15% wzrost co 2 lata
                efficiency.push(Math.pow(1.08, (y - 2020) / 2) * 100); // 8% wzrost efektywności
            } else {
                // Prognozy (bardziej konserwatywne)
                performance.push(Math.pow(1.12, (y - 2020) / 2) * 100);
                efficiency.push(Math.pow(1.06, (y - 2020) / 2) * 100);
            }
        }
        
        // Normalizuj dane do 100% dla 2024
        const baseIndex = years.indexOf('2024');
        const basePerformance = performance[baseIndex];
        const baseEfficiency = efficiency[baseIndex];
        
        const normalizedPerformance = performance.map(p => (p / basePerformance * 100).toFixed(0));
        const normalizedEfficiency = efficiency.map(e => (e / baseEfficiency * 100).toFixed(0));
        
        // Zniszcz istniejący wykres jeśli istnieje
        if (predictionChart) {
            predictionChart.destroy();
        }
        
        // Stwórz nowy wykres
        predictionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Wydajność (%)',
                        data: normalizedPerformance,
                        borderColor: '#4cc9f0',
                        backgroundColor: 'rgba(76, 201, 240, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Efektywność (%)',
                        data: normalizedEfficiency,
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Prognoza rozwoju wydajności i efektywności'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Wzrost względem 2024 (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Rok'
                        }
                    }
                }
            }
        });
    };
    
    // Resetowanie filtrów
    const resetFilters = () => {
        yearSlider.value = 2024;
        techSelect.value = 'cpu';
        updateSimulation();
        
        // Dodaj animację potwierdzenia
        resetBtn.innerHTML = '<i class="fas fa-check"></i> Filtry zresetowane';
        resetBtn.style.background = '#2ecc71';
        resetBtn.style.color = 'white';
        resetBtn.style.borderColor = '#2ecc71';
        
        setTimeout(() => {
            resetBtn.innerHTML = '<i class="fas fa-redo"></i> Resetuj filtry';
            resetBtn.style.background = '#f8f9fa';
            resetBtn.style.color = '#1a1a2e';
            resetBtn.style.borderColor = '#ddd';
        }, 2000);
    };
    
    // Obsługa zdarzeń
    yearSlider.addEventListener('input', updateSimulation);
    techSelect.addEventListener('change', updateSimulation);
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // Inicjalizuj z domyślnymi wartościami
    updateSimulation();
}

// Inicjalizacja karuzeli ekspertów - NAJPROSTSZE ROZWIĄZANIE
function initExpertsCarousel() {
    const expertCards = document.querySelectorAll('.expert-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const currentExpertSpan = document.getElementById('current-expert');
    const totalExpertsSpan = document.getElementById('total-experts');
    
    if (!expertCards.length) return;
    
    let currentIndex = 0;
    totalExpertsSpan.textContent = expertCards.length;
    
    // Ustaw początkowe stany - NAJPROSTSZE
    expertCards.forEach((card, index) => {
        card.style.display = 'none';
        if (index === 0) {
            card.classList.add('active');
            card.style.display = 'block';
        } else {
            card.classList.remove('active');
        }
    });
    
    const showExpert = (index) => {
        // Ukryj aktualną kartę
        expertCards[currentIndex].style.display = 'none';
        expertCards[currentIndex].classList.remove('active');
        
        // Pokaż nową kartę
        expertCards[index].style.display = 'block';
        expertCards[index].classList.add('active');
        
        // Aktualizuj kropki
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Aktualizuj numer eksperta
        currentExpertSpan.textContent = index + 1;
        currentIndex = index;
    };
    
    // Obsługa przycisków
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = expertCards.length - 1;
            showExpert(newIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let newIndex = (currentIndex + 1) % expertCards.length;
            showExpert(newIndex);
        });
    }
    
    // Obsługa kropek
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentIndex) {
                showExpert(index);
            }
        });
    });
    
    // Automatyczne przewijanie
    let autoScrollInterval = setInterval(() => {
        let newIndex = (currentIndex + 1) % expertCards.length;
        showExpert(newIndex);
    }, 8000);
    
    // Zatrzymaj auto-scroll przy najechaniu
    const carousel = document.querySelector('.experts-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(() => {
                let newIndex = (currentIndex + 1) % expertCards.length;
                showExpert(newIndex);
            }, 8000);
        });
    }
}

// Inicjalizacja quizu
function initQuiz() {
    // Dane quizu
    quizData = [
        {
            question: "Kiedy według ekspertów komputery kwantowe staną się dostępne dla konsumentów?",
            answers: [
                { text: "2025", correct: false, explanation: "Zbyt optymistycznie. Komputery kwantowe w 2025 będą wciąż w fazie laboratoryjnej." },
                { text: "2030", correct: false, explanation: "Możliwe pierwsze komercyjne zastosowania, ale nie dla konsumentów." },
                { text: "2035-2040", correct: true, explanation: "Według większości ekspertów to realistyczny termin na komputery kwantowe dla zaawansowanych użytkowników." },
                { text: "Nigdy", correct: false, explanation: "Technologia rozwija się szybko, komputery kwantowe są nieuniknione." }
            ]
        },
        {
            question: "Która technologia będzie dominująca w pamięciach RAM w 2030 roku?",
            answers: [
                { text: "DDR6 3D Stacked", correct: true, explanation: "DDR6 z 3D stacking zapewni najwyższą wydajność i gęstość." },
                { text: "DDR5", correct: false, explanation: "DDR5 będzie już przestarzała w 2030 roku." },
                { text: "Optical RAM", correct: false, explanation: "Pamięci optyczne pojawią się później." },
                { text: "HBM4", correct: false, explanation: "HBM4 będzie używane głównie w kartach graficznych, nie w pamięciach głównych." }
            ]
        },
        {
            question: "Jak wzrośnie wydajność kart graficznych do 2030 w porównaniu do 2024?",
            answers: [
                { text: "2x", correct: false, explanation: "Zbyt konserwatywnie. Rozwój GPU jest szybszy." },
                { text: "5x", correct: true, explanation: "Średnia prognoza ekspertów to 5-krotny wzrost wydajności." },
                { text: "10x", correct: false, explanation: "Możliwe dla specyficznych zadań AI, nie dla ogólnej wydajności gamingowej." },
                { text: "20x", correct: false, explanation: "Nierealistyczne dla ogólnej wydajności do 2030 roku." }
            ]
        },
        {
            question: "Która firma prowadzi w rozwoju chiplet technology?",
            answers: [
                { text: "Intel", correct: false, explanation: "Intel rozwija tę technologię, ale AMD ma przewagę." },
                { text: "NVIDIA", correct: false, explanation: "NVIDIA skupia się na dużych monolitycznych chipach." },
                { text: "AMD", correct: true, explanation: "AMD jest pionierem i liderem w technologii chiplet." },
                { text: "Apple", correct: false, explanation: "Apple używa innego podejścia (SoC)." }
            ]
        },
        {
            question: "Co będzie głównym źródłem energii dla centrów danych w 2035?",
            answers: [
                { text: "Energia jądrowa", correct: false, explanation: "Może być ważnym źródłem, ale nie dominującym." },
                { text: "Energia odnawialna", correct: true, explanation: "Według prognoz 80% centrów danych będzie zasilanych energią odnawialną." },
                { text: "Energia węglowa", correct: false, explanation: "Będzie stopniowo wycofywana." },
                { text: "Energia gazowa", correct: false, explanation: "Będzie uzupełniającym źródłem." }
            ]
        }
    ];
    
    const quizContainer = document.getElementById('quiz-container');
    const quizResults = document.getElementById('quiz-results');
    const quizNextBtn = document.getElementById('quiz-next');
    const quizRestartBtn = document.getElementById('quiz-restart');
    const quizShareBtn = document.getElementById('quiz-share');
    const quizHelpBtn = document.getElementById('quiz-help');
    const closeHelpBtn = document.querySelector('.close-help');
    const quizHelpModal = document.getElementById('quiz-help-modal');
    const answersContainer = document.getElementById('quiz-answers');
    const questionElement = document.getElementById('quiz-question');
    const feedbackElement = document.getElementById('quiz-feedback');
    const progressFill = document.getElementById('quiz-progress');
    const currentQuestionSpan = document.getElementById('quiz-current');
    const quizScoreSpan = document.getElementById('quiz-score');
    const quizResultText = document.getElementById('quiz-result-text');
    
    let selectedAnswer = null;
    let startTime = null;
    let userAnswers = [];
    
    // Załaduj pierwsze pytanie
    loadQuestion(currentQuestion);
    startTime = new Date();
    
    // Obsługa wyboru odpowiedzi
    answersContainer.addEventListener('click', (e) => {
        const answerOption = e.target.closest('.answer-option');
        if (!answerOption) return;
        
        // Odznacz poprzednią odpowiedź
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Zaznacz nową odpowiedź
        answerOption.classList.add('selected');
        const answerIndex = Array.from(answerOption.parentNode.children).indexOf(answerOption);
        selectedAnswer = quizData[currentQuestion].answers[answerIndex].correct;
        
        // Zapisz odpowiedź użytkownika
        userAnswers[currentQuestion] = {
            question: quizData[currentQuestion].question,
            selected: answerIndex,
            correct: selectedAnswer
        };
        
        // Pokaż informację zwrotną
        showFeedback(selectedAnswer, quizData[currentQuestion].answers[answerIndex].explanation);
        
        // Odblokuj przycisk "Następne"
        quizNextBtn.disabled = false;
    });
    
    // Obsługa przycisku "Następne"
    quizNextBtn.addEventListener('click', () => {
        if (selectedAnswer === true) {
            score++;
        }
        
        currentQuestion++;
        
        if (currentQuestion < quizData.length) {
            loadQuestion(currentQuestion);
            quizNextBtn.disabled = true;
            selectedAnswer = null;
            feedbackElement.style.display = 'none';
            feedbackElement.className = 'quiz-feedback';
        } else {
            showResults();
        }
    });
    
    // Obsługa przycisku "Restart"
    if (quizRestartBtn) {
        quizRestartBtn.addEventListener('click', restartQuiz);
    }
    
    // Obsługa przycisku "Udostępnij"
    if (quizShareBtn) {
        quizShareBtn.addEventListener('click', shareResults);
    }
    
    // Obsługa przycisku "Pomoc"
    if (quizHelpBtn) {
        quizHelpBtn.addEventListener('click', () => {
            quizHelpModal.style.display = 'flex';
        });
    }
    
    // Obsługa przycisku "Zamknij pomoc"
    if (closeHelpBtn) {
        closeHelpBtn.addEventListener('click', () => {
            quizHelpModal.style.display = 'none';
        });
    }
    
    // Ładowanie pytania
    function loadQuestion(index) {
        const question = quizData[index];
        
        // Aktualizuj pytanie
        questionElement.innerHTML = `<h3>${question.question}</h3>`;
        
        // Aktualizuj odpowiedzi
        answersContainer.innerHTML = '';
        question.answers.forEach((answer, i) => {
            const answerOption = document.createElement('div');
            answerOption.className = 'answer-option';
            
            const letters = ['A', 'B', 'C', 'D'];
            answerOption.innerHTML = `
                <span class="answer-letter">${letters[i]}</span>
                <span class="answer-text">${answer.text}</span>
            `;
            
            answersContainer.appendChild(answerOption);
        });
        
        // Aktualizuj postęp
        currentQuestionSpan.textContent = index + 1;
        progressFill.style.width = `${((index + 1) / quizData.length) * 100}%`;
    }
    
    // Pokazywanie informacji zwrotnej
    function showFeedback(isCorrect, explanation) {
        feedbackElement.textContent = isCorrect 
            ? `Dobrze! ${explanation}` 
            : `Niestety, to nieprawidłowa odpowiedź. ${explanation}`;
        
        feedbackElement.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackElement.style.display = 'block';
        
        // Podświetl prawidłową odpowiedź jeśli wybrano złą
        if (!isCorrect) {
            const answerOptions = document.querySelectorAll('.answer-option');
            quizData[currentQuestion].answers.forEach((answer, i) => {
                if (answer.correct) {
                    answerOptions[i].classList.add('correct');
                }
            });
        }
    }
    
    // Pokazywanie wyników
    function showResults() {
        quizContainer.style.display = 'none';
        quizResults.style.display = 'block';
        
        quizScoreSpan.textContent = score;
        
        // Tekst wynikowy w zależności od wyniku
        let resultText = '';
        if (score === 5) {
            resultText = 'Wspaniale! Jesteś ekspertem od przyszłości technologii! Doskonale orientujesz się w nadchodzących trendach.';
        } else if (score >= 3) {
            resultText = 'Dobrze! Znasz się na przyszłości technologii. Kilka dodatkowych lektur i będziesz ekspertem!';
        } else {
            resultText = 'Warto śledzić nowinki technologiczne! Przeczytaj nasze artykuły, aby poszerzyć wiedzę o przyszłości technologii.';
        }
        
        quizResultText.textContent = resultText;
        
        // Pokazuj przycisk "Zacznij od nowa" tylko po zakończeniu quizu
        if (quizRestartBtn) {
            quizRestartBtn.style.display = 'inline-block';
        }
    }
    
    // Restart quizu
    function restartQuiz() {
        currentQuestion = 0;
        score = 0;
        selectedAnswer = null;
        userAnswers = [];
        startTime = new Date();
        
        quizContainer.style.display = 'block';
        quizResults.style.display = 'none';
        quizNextBtn.disabled = true;
        feedbackElement.style.display = 'none';
        
        loadQuestion(currentQuestion);
        
        // Ukryj przycisk "Zacznij od nowa" podczas quizu
        if (quizRestartBtn) {
            quizRestartBtn.style.display = 'none';
        }
    }
    
    // Udostępnianie wyników
    function shareResults() {
        const shareText = `Uzyskałem ${score}/5 w quizie o przyszłości technologii na Świecie Komputerów!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Mój wynik w quizie o przyszłości technologii',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText + ' ' + window.location.href)
                .then(() => {
                    alert('Wynik skopiowany do schowka! Możesz go teraz udostępnić.');
                })
                .catch(err => {
                    console.error('Błąd kopiowania:', err);
                });
        }
    }
    
    // Ukryj przycisk "Zacznij od nowa" na początku
    if (quizRestartBtn) {
        quizRestartBtn.style.display = 'none';
    }
}

// Inicjalizacja animacji
function initAnimations() {
    // Animacja pojawiania się elementów podczas scrollowania
    const animatedElements = document.querySelectorAll('.tech-card, .comparison-table, .simulation-card, .simulation-predictions');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // Animacja pasków postępu
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.tech-card .progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }, 1000);
}

// Obsługa przewijania
function initScrollHandlers() {
    // Obsługa linków w stopce
    const footerLinks = document.querySelectorAll('footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'roadmap') {
                document.querySelector('.roadmap-section').scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'technologies') {
                document.querySelector('.technologies-section').scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'simulation') {
                document.querySelector('.simulation-section').scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'experts') {
                document.querySelector('.experts-section').scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'quiz') {
                document.querySelector('.quiz-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function() {
    initFuturePage();
    
    // Dodaj obsługę kliknięcia poza modalem pomocy
    const quizHelpModal = document.getElementById('quiz-help-modal');
    if (quizHelpModal) {
        quizHelpModal.addEventListener('click', (e) => {
            if (e.target === quizHelpModal) {
                quizHelpModal.style.display = 'none';
            }
        });
    }
    
    // Dodaj obsługę klawisza ESC dla modalu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const quizHelpModal = document.getElementById('quiz-help-modal');
            if (quizHelpModal && quizHelpModal.style.display === 'flex') {
                quizHelpModal.style.display = 'none';
            }
        }
    });
});

// Obsługa zmiany rozmiaru okna
window.addEventListener('resize', function() {
    // Resetuj wykres jeśli istnieje
    if (predictionChart) {
        predictionChart.resize();
    }
});