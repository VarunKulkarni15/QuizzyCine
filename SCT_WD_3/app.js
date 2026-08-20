// 0. Environment Variables (Loaded securely via Vite)
let apiKeyIndex = 0;
const GROQ_API_KEYS = [
    import.meta.env.VITE_GROQ_API_KEY_1,
    import.meta.env.VITE_GROQ_API_KEY_2,
    import.meta.env.VITE_GROQ_API_KEY_3,
    import.meta.env.VITE_GROQ_API_KEY_4,
    import.meta.env.VITE_GROQ_API_KEY_5,
    import.meta.env.VITE_GROQ_API_KEY_6,
    import.meta.env.VITE_GROQ_API_KEY_7
];
const OMDB_API_KEYS = [
    import.meta.env.VITE_OMDB_API_KEY_1,
    import.meta.env.VITE_OMDB_API_KEY_2,
    import.meta.env.VITE_OMDB_API_KEY_3
];
let omdbKeyIndex = 0;
function getOmdbKey() {
    const key = OMDB_API_KEYS[omdbKeyIndex];
    omdbKeyIndex = (omdbKeyIndex + 1) % OMDB_API_KEYS.length;
    return key;
}

// 1. Expanded Default Movies
const defaultDashboardMovies = [
    { title: "The Matrix", poster: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg" },
    { title: "Inception", poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg" },
    { title: "Interstellar", poster: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg" },
    { title: "The Dark Knight", poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg" },
    { title: "Pulp Fiction", poster: "https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_QL75_UY562_CR3,0,380,562_.jpg" },
    { title: "Fight Club", poster: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg" },
    { title: "Forrest Gump", poster: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg" },
    { title: "The Godfather", poster: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY562_CR8,0,380,562_.jpg" },
    { title: "Avatar", poster: "https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NjItMDJlYTRlNGJiZjcyXkEyXkFqcGc@._V1_SX300.jpg" },
    { title: "Gladiator", poster: "https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1ZmJiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg" },
    { title: "Jurassic Park", poster: "https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_SX300.jpg" },
    { title: "Titanic", poster: "https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_QL75_UX380_CR0,2,380,562_.jpg" }
];

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 40;
let totalQuestionsToAsk = 5; // Default

// Custom SVG Fallback for Missing/Broken Posters
const FALLBACK_POSTER = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="#2b2422"/><path d="M110 170 h80 v60 h-80 z" fill="none" stroke="#4a3e3b" stroke-width="6" stroke-linejoin="round"/><circle cx="150" cy="200" r="15" fill="none" stroke="#4a3e3b" stroke-width="6"/><path d="M125 170 l15 -20 h20 l15 20" fill="none" stroke="#4a3e3b" stroke-width="6" stroke-linejoin="round"/><text x="50%" y="270" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#a89f9d" font-weight="bold" letter-spacing="1">POSTER UNAVAILABLE</text></svg>`);

// Selected Movie State
let selectedMovieTitle = "";
let selectedMoviePoster = "";

// Global function to request Push Notifications
window.requestPushNotification = function() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
        return;
    }
    
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            new Notification("Subscribed to QuizzyCine!", {
                body: "You will now receive updates about new movie trivia and features.",
                icon: "cat_mascot.webp"
            });
        }
    });
};

// Global function to accept cookies
window.acceptCookies = function() {
    localStorage.setItem('quizzycine_cookie_consent', 'true');
    document.getElementById('cookie-banner').classList.remove('show');
    
    // Prompt for notifications immediately after accepting cookies
    setTimeout(() => {
        window.requestPushNotification();
    }, 500);
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    
    // Check cookie consent
    if (!localStorage.getItem('quizzycine_cookie_consent')) {
        setTimeout(() => {
            document.getElementById('cookie-banner').classList.add('show');
        }, 1000);
    }

    // Block right-click on all images
    document.addEventListener('contextmenu', e => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });

    // Close menus on outside click
    document.addEventListener('click', e => {
        const navMenu = document.getElementById('nav-menu');
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const aboutTooltip = document.getElementById('about-tooltip');
        const aboutBtn = document.querySelector('.about-btn');

        if (navMenu && navMenu.classList.contains('show') && !navMenu.contains(e.target) && (!hamburgerBtn || !hamburgerBtn.contains(e.target))) {
            navMenu.classList.remove('show');
        }
        if (aboutTooltip && !aboutTooltip.classList.contains('hidden') && !aboutTooltip.contains(e.target) && (!aboutBtn || !aboutBtn.contains(e.target))) {
            aboutTooltip.classList.add('hidden');
        }
    });

    loadDefaultMovies();

// Expose functions to the global window object for HTML onclick events
window.startQuiz = startQuiz;
window.changeCount = changeCount;
window.validateCount = validateCount;
window.selectAnswer = selectAnswer;
window.resetGame = resetGame;
window.toggleAbout = toggleAbout;
window.toggleMenu = toggleMenu;
window.showScreen = showScreen;
    setupLiveSearch();
});

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    // Hide creator-header during the game so it doesn't overlap on mobile!
    const header = document.querySelector('.creator-header');
    if (header) {
        if (screenId === 'game-screen') {
            header.style.display = 'none';
        } else {
            header.style.display = 'block';
        }
    }
}

function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('show');
}

function toggleAbout() {
    document.getElementById('about-tooltip').classList.toggle('hidden');
}

async function fetchOmdb(title, extraParams = "", retryCount = 0) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${getOmdbKey()}&t=${encodeURIComponent(title)}${extraParams}`);
        const data = await response.json();
        if (data.Response === "False" && data.Error && data.Error.toLowerCase().includes("limit") && retryCount < OMDB_API_KEYS.length) {
            return await fetchOmdb(title, extraParams, retryCount + 1);
        }
        return data;
    } catch (err) {
        if (retryCount < OMDB_API_KEYS.length) {
            return await fetchOmdb(title, extraParams, retryCount + 1);
        }
        throw err;
    }
}

async function fetchOmdbSearch(query, retryCount = 0) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${getOmdbKey()}&s=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.Response === "False" && data.Error && data.Error.toLowerCase().includes("limit") && retryCount < OMDB_API_KEYS.length) {
            return await fetchOmdbSearch(query, retryCount + 1);
        }
        return data;
    } catch (err) {
        if (retryCount < OMDB_API_KEYS.length) {
            return await fetchOmdbSearch(query, retryCount + 1);
        }
        throw err;
    }
}

function loadDefaultMovies() {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = ""; 

    // Shuffle and pick to keep it fresh
    let shuffledMovies = [...defaultDashboardMovies];
    for (let i = shuffledMovies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledMovies[i], shuffledMovies[j]] = [shuffledMovies[j], shuffledMovies[i]];
    }

    // Instantly append them! Zero API calls!
    shuffledMovies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" onerror="this.onerror=null; this.src='${FALLBACK_POSTER}';">
            <h3>${movie.title}</h3>
        `;
        card.onclick = () => openSetupScreen(movie.title, movie.poster);
        movieGrid.appendChild(card);
    });
}

// 2. Live Search Functionality
function setupLiveSearch() {
    const searchInput = document.getElementById('movie-search');
    const resultsPanel = document.getElementById('search-results-panel');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 3) {
            resultsPanel.classList.add('hidden');
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                const data = await fetchOmdbSearch(query);
                
                resultsPanel.innerHTML = "";
                resultsPanel.classList.remove('hidden');

                if (data.Response === "True") {
                    // Only show first 5 results
                    data.Search.slice(0, 5).forEach(movie => {
                        const item = document.createElement('div');
                        item.className = 'search-result-item';
                        const poster = movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;
                        item.innerHTML = `
                            <img src="${poster}" alt="Poster" onerror="this.onerror=null; this.src='${FALLBACK_POSTER}';">
                            <div class="details">
                                <h4>${movie.Title}</h4>
                                <span>${movie.Year}</span>
                            </div>
                        `;
                        item.onclick = () => {
                            searchInput.value = '';
                            resultsPanel.classList.remove('hidden');
                            openSetupScreen(movie.Title, poster);
                        };
                        resultsPanel.appendChild(item);
                    });
                } else {
                    resultsPanel.innerHTML = '<div class="no-results">No movies found...</div>';
                }
            } catch (err) {
                console.error(err);
            }
        }, 300); // 300ms debounce
    });

    // Close panel if clicked outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsPanel.contains(e.target)) {
            resultsPanel.classList.add('hidden');
        }
    });
}

// 3. Movie Setup Screen
async function openSetupScreen(title, poster) {
    selectedMovieTitle = title;
    selectedMoviePoster = poster;
    
    document.getElementById('setup-movie-title').innerText = title;
    
    const posterImg = document.getElementById('setup-movie-poster');
    posterImg.src = poster;
    posterImg.onerror = function() {
        this.onerror = null;
        this.src = FALLBACK_POSTER;
    };
    
    document.getElementById('setup-movie-plot').innerText = "Loading plot...";
    document.getElementById('setup-movie-year').innerText = "";
    document.getElementById('setup-movie-genre').innerText = "";
    document.getElementById('setup-movie-director').innerText = "";
    document.getElementById('setup-movie-writer').innerText = "";
    
    showScreen('setup-screen');

    // Fetch full details
    try {
        const data = await fetchOmdb(title, "&plot=short");
        if (data.Response === "True") {
            document.getElementById('setup-movie-year').innerText = data.Year;
            document.getElementById('setup-movie-genre').innerText = data.Genre;
            document.getElementById('setup-movie-plot').innerText = data.Plot;
            document.getElementById('setup-movie-director').innerText = data.Director;
            document.getElementById('setup-movie-writer').innerText = data.Writer;
        } else {
            document.getElementById('setup-movie-plot').innerText = "Could not load movie details.";
        }
    } catch (err) {
        document.getElementById('setup-movie-plot').innerText = "Could not load movie details.";
    }
}

// Custom Counter Logic
function changeCount(change) {
    const input = document.getElementById('question-count');
    let val = parseInt(input.value) + change;
    if (val < 1) val = 1;
    if (val > 25) val = 25;
    input.value = val;
}

function validateCount() {
    const input = document.getElementById('question-count');
    let val = parseInt(input.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 25) val = 25;
    input.value = val;
}

// 4. Local Storage History Manager
function getMovieHistory(movieTitle) {
    const history = localStorage.getItem(`quizzycine_${movieTitle}`);
    return history ? JSON.parse(history) : [];
}

function saveToMovieHistory(movieTitle, newQuestions) {
    const history = getMovieHistory(movieTitle);
    const updatedHistory = [...history, ...newQuestions.map(q => q.question)];
    localStorage.setItem(`quizzycine_${movieTitle}`, JSON.stringify(updatedHistory));
}

// Start Quiz Process
async function startQuiz() {
    // Get question count
    let count = parseInt(document.getElementById('question-count').value);
    if (isNaN(count) || count < 1) count = 5;
    if (count > 25) count = 25;
    totalQuestionsToAsk = count;

    showScreen('game-screen');
    document.getElementById('current-movie-title').innerText = selectedMovieTitle;
    document.getElementById('question-text').innerText = "AI is generating unique questions...";
    document.getElementById('options-grid').innerHTML = "";
    document.getElementById('timer-display').innerText = "Loading...";
    
    startCatAnimation();

    try {
        await generateQuestionsWithGroq(selectedMovieTitle, totalQuestionsToAsk);
        currentQuestionIndex = 0;
        score = 0;
        updateScoreDisplay();
        loadQuestion();
    } catch (error) {
        document.getElementById('question-text').innerText = "Whoops! Our AI got a bit dizzy. Please try again!";
        console.error("Quiz Error:", error);
    }
}

// Groq API Call
async function generateQuestionsWithGroq(movieTitle, count) {
    // Load previously asked questions to prevent repetition
    const history = getMovieHistory(movieTitle);
    let historyContext = "";
    if (history.length > 0) {
        historyContext = `DO NOT ASK THE FOLLOWING QUESTIONS, THEY HAVE ALREADY BEEN ASKED:
${history.map((q, i) => `${i+1}. ${q}`).join('\n')}`;
    }

    const prompt = `Generate exactly ${count} trivia questions about the movie "${movieTitle}". 
    
CRITICAL INSTRUCTIONS:
1. FOCUS ON DEEP LORE, PLOT EVENTS, SCENES, AND WORLD-BUILDING.
2. DO NOT ASK ABOUT ACTORS, DIRECTORS, OR REAL-WORLD CAST/CREW.
3. Keep questions VERY SHORT and concise (maximum 15 words).
4. Keep the 4 options VERY SHORT (maximum 5 words each).
5. ${historyContext}

Format the response STRICTLY as a JSON object with a single key "questions" containing an array of objects. 
Each object must have: "question" (string), "options" (array of exactly 4 separate strings), "answer" (the exact string from options that is correct).`;

    // Rotate Key!
    const keyToUse = GROQ_API_KEYS[apiKeyIndex];
    apiKeyIndex = (apiKeyIndex + 1) % GROQ_API_KEYS.length;

    // Fallback Models Array (in order of preference)
    const modelsToTry = [
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "llama-3.1-8b-instant",
        "llama3-8b-8192"
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${keyToUse}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                console.warn(`Model ${modelName} failed:`, errData);
                continue; // Try the next model
            }

            const data = await response.json();
            let jsonString = data.choices[0].message.content.trim();
            
            const parsedData = JSON.parse(jsonString);
            currentQuestions = parsedData.questions;
            
            // Save these new questions to local storage to prevent future repeats!
            saveToMovieHistory(movieTitle, currentQuestions);
            return; // Successfully fetched, exit the loop!

        } catch (error) {
            console.warn(`Error connecting to model ${modelName}:`, error);
            lastError = error;
            // Continue to next model
        }
    }

    // If we exhausted all models and none worked
    throw lastError || new Error("All Groq models failed.");
}

function loadQuestion() {
    clearInterval(timerInterval);
    
    if (currentQuestionIndex >= currentQuestions.length) {
        endQuiz();
        return;
    }

    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = `Q${currentQuestionIndex + 1}: ${q.question}`;
    
    const optionsGrid = document.getElementById('options-grid');
    optionsGrid.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectAnswer(btn, opt, q.answer);
        optionsGrid.appendChild(btn);
    });

    timeLeft = 40;
    document.getElementById('timer-display').innerText = `${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').innerText = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeOut();
        }
    }, 1000);
}

function selectAnswer(selectedBtn, selectedText, correctText) {
    clearInterval(timerInterval); 
    
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (selectedText === correctText) {
        document.getElementById('correct-sound').play().catch(e => console.log('Audio play failed', e));
        selectedBtn.classList.add('correct');
        score++;
        updateScoreDisplay();
    } else {
        document.getElementById('wrong-sound').play().catch(e => console.log('Audio play failed', e));
        selectedBtn.classList.add('wrong');
        buttons.forEach(btn => {
            if (btn.innerText === correctText) btn.classList.add('correct');
        });
    }

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 3000);
}

function timeOut() {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    const q = currentQuestions[currentQuestionIndex];
    buttons.forEach(btn => {
        if (btn.innerText === q.answer) btn.classList.add('correct');
    });

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 3000);
}

function updateScoreDisplay() {
    document.getElementById('score-display').innerText = `Score: ${score}/${totalQuestionsToAsk}`;
}

function endQuiz() {
    stopCatAnimation();
    showScreen('results-screen');
    const resultImg = document.getElementById('result-cat-image');
    if(resultImg) resultImg.src = "/cat score single image/Untitled.png";
    document.getElementById('final-score-text').innerText = `You scored ${score} out of ${totalQuestionsToAsk}!`;
}

function resetGame() {
    showScreen('selection-screen');
}


// Cat Animation Engine (Now handled natively by WebP)
function startCatAnimation() {
    // Left empty for compatibility if called elsewhere
}

function stopCatAnimation() {
    // Left empty for compatibility if called elsewhere
}
