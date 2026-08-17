// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

const timerPill = document.getElementById('timer-pill');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');

const btnLeft = document.getElementById('btn-left'); // Lap / Reset
const btnRight = document.getElementById('btn-right'); // Start / Stop

const statsContainer = document.getElementById('stats-container');
const statFastest = document.getElementById('stat-fastest');
const statSlowest = document.getElementById('stat-slowest');
const statAverage = document.getElementById('stat-average');

const lapsTbody = document.getElementById('laps-tbody');

// State Variables
let isRunning = false;
let startTime = 0;
let elapsedTime = 0; // Total time elapsed when paused
let animationFrameId = null;

// Laps Tracking
let laps = []; // Array of objects: { number, split, total }
let lastLapTimestamp = 0;

// Initialize
btnLeft.disabled = true;

// -----------------------------------------
// Theme Toggle Logic
// -----------------------------------------
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Toggle icons
    if (body.classList.contains('dark-mode')) {
        iconMoon.classList.remove('hidden');
        iconSun.classList.add('hidden');
    } else {
        iconMoon.classList.add('hidden');
        iconSun.classList.remove('hidden');
    }
});

// -----------------------------------------
// Core Timing Engine
// -----------------------------------------
function updateTimer(timestamp) {
    if (!isRunning) return;

    const currentTotalTime = elapsedTime + (performance.now() - startTime);
    displayTime(currentTotalTime);
    
    animationFrameId = requestAnimationFrame(updateTimer);
}

function displayTime(timeInMs) {
    const totalMilliseconds = Math.floor(timeInMs);
    const mm = Math.floor((totalMilliseconds % 1000) / 10);
    const ss = Math.floor((totalMilliseconds / 1000) % 60);
    const min = Math.floor((totalMilliseconds / (1000 * 60)) % 60);

    minutesDisplay.textContent = min.toString().padStart(2, '0');
    secondsDisplay.textContent = ss.toString().padStart(2, '0');
    millisecondsDisplay.textContent = mm.toString().padStart(2, '0');
}

// -----------------------------------------
// Control Logic
// -----------------------------------------
function toggleStartStop() {
    if (isRunning) {
        // STOP
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
        elapsedTime += performance.now() - startTime;

        // UI Updates
        timerPill.classList.remove('running');
        btnRight.textContent = 'Resume';
        btnRight.className = 'control-btn btn-primary start';
        
        btnLeft.textContent = 'Reset';
    } else {
        // START
        isRunning = true;
        startTime = performance.now();
        
        if (elapsedTime === 0 && laps.length === 0) {
            lastLapTimestamp = 0;
        }

        animationFrameId = requestAnimationFrame(updateTimer);

        // UI Updates
        timerPill.classList.add('running');
        btnRight.textContent = 'Stop';
        btnRight.className = 'control-btn btn-primary stop';
        
        btnLeft.disabled = false;
        btnLeft.textContent = 'Lap';
    }
}

function handleLeftButton() {
    if (isRunning) {
        recordLap();
    } else {
        resetTimer();
    }
}

function resetTimer() {
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
    elapsedTime = 0;
    startTime = 0;
    laps = [];
    lastLapTimestamp = 0;

    // Reset Display
    displayTime(0);
    lapsTbody.innerHTML = '';
    statsContainer.classList.add('hidden');
    timerPill.classList.remove('running');

    // Reset UI Buttons
    btnLeft.textContent = 'Lap';
    btnLeft.disabled = true;
    
    btnRight.textContent = 'Start';
    btnRight.className = 'control-btn btn-primary start';
}

// -----------------------------------------
// Lap & Statistics Logic
// -----------------------------------------
function recordLap() {
    const currentTotalTime = elapsedTime + (performance.now() - startTime);
    const lapSplit = currentTotalTime - lastLapTimestamp;
    
    laps.unshift({
        number: laps.length + 1,
        split: lapSplit,
        total: currentTotalTime
    });
    
    lastLapTimestamp = currentTotalTime;
    renderLapsAndStats();
}

function renderLapsAndStats() {
    lapsTbody.innerHTML = '';

    if (laps.length > 0) {
        statsContainer.classList.remove('hidden');
    }

    let fastestIndex = -1;
    let slowestIndex = -1;
    let minSplit = Infinity;
    let maxSplit = -Infinity;
    let sumSplit = 0;

    // Calculate Stats
    laps.forEach((lap, idx) => {
        sumSplit += lap.split;
        if (laps.length > 1) { // Only highlight if >1 lap
            if (lap.split < minSplit) {
                minSplit = lap.split;
                fastestIndex = idx;
            }
            if (lap.split > maxSplit) {
                maxSplit = lap.split;
                slowestIndex = idx;
            }
        }
    });

    // Update Statistics Bar
    if (laps.length > 0) {
        statAverage.textContent = formatTime(sumSplit / laps.length);
        statFastest.textContent = minSplit !== Infinity ? formatTime(minSplit) : '--:--.--';
        statSlowest.textContent = maxSplit !== -Infinity ? formatTime(maxSplit) : '--:--.--';
    }

    // Render Table
    laps.forEach((lap, index) => {
        const tr = document.createElement('tr');
        
        if (index === fastestIndex) tr.classList.add('fastest');
        if (index === slowestIndex) tr.classList.add('slowest');

        tr.innerHTML = `
            <td>${lap.number.toString().padStart(2, '0')}</td>
            <td>${formatTime(lap.split)}</td>
            <td>${formatTime(lap.total)}</td>
        `;
        lapsTbody.appendChild(tr);
    });
}

function formatTime(timeInMs) {
    if (isNaN(timeInMs)) return '--:--.--';
    
    const totalMilliseconds = Math.floor(timeInMs);
    const mm = Math.floor((totalMilliseconds % 1000) / 10);
    const ss = Math.floor((totalMilliseconds / 1000) % 60);
    const min = Math.floor((totalMilliseconds / (1000 * 60)) % 60);

    const strMin = min.toString().padStart(2, '0');
    const strSec = ss.toString().padStart(2, '0');
    const strMs = mm.toString().padStart(2, '0');

    return `${strMin}:${strSec}.${strMs}`;
}

// -----------------------------------------
// Event Listeners
// -----------------------------------------
btnRight.addEventListener('click', toggleStartStop);
btnLeft.addEventListener('click', handleLeftButton);

document.addEventListener('keydown', (e) => {
    // Avoid triggering if user is focused on an input (not applicable here, but good practice)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Space') {
        e.preventDefault();
        toggleStartStop();
    }
    
    if (e.code === 'KeyL' || e.key === 'l') {
        if (isRunning) recordLap();
    }
    
    if (e.code === 'KeyR' || e.key === 'r') {
        if (!isRunning && elapsedTime > 0) resetTimer();
    }
});
