const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GRID_SIZE = 20;
let GAME_SIZE; // Will be set in resize function

// Initialize game size first
GAME_SIZE = Math.min(window.innerWidth, window.innerHeight) - 40;
canvas.width = GAME_SIZE;
canvas.height = GAME_SIZE;

// Now initialize game variables with proper positions
let snake = [
    { x: Math.floor(GAME_SIZE/2), y: Math.floor(GAME_SIZE/2) },           // Head
    { x: Math.floor(GAME_SIZE/2) - GRID_SIZE, y: Math.floor(GAME_SIZE/2) },   // Body
    { x: Math.floor(GAME_SIZE/2) - GRID_SIZE*2, y: Math.floor(GAME_SIZE/2) }  // Tail
];

let direction = 'right';
let score = 0;
let gameSpeed = 150; // Starting slower (higher number = slower speed)
let gameLoop;

// Add these variables at the top with other game variables
let touchStartX = null;
let touchStartY = null;

// Add at the top with other variables
let highScore = localStorage.getItem('snakeHighScore') || 0;
document.getElementById('highScoreValue').textContent = highScore;
document.getElementById('currentHighScore').textContent = highScore;

// Add event listener for the new game button
document.getElementById('newGameBtn').addEventListener('click', startNewGame);

// Add at the top with other variables
let highScores = JSON.parse(localStorage.getItem('snakeHighScores')) || [];

// Add event listeners for the high scores page
document.getElementById('highScoresBtn').addEventListener('click', showHighScores);
document.getElementById('backToMenuBtn').addEventListener('click', showHomePage);

// Add at the top with other game variables
let isPaused = false;

// Add to the keyboard event listener
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        togglePause();
        return;
    }
    
    if (isPaused) return; // Don't process movement keys if paused
    
    switch(e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Add these touch event listeners after the keyboard event listener
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault(); // Prevent scrolling while playing
});

canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
    if (!touchStartX || !touchStartY) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    // Determine swipe direction based on which delta is larger
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && direction !== 'left') {
            direction = 'right';
        } else if (deltaX < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else {
        // Vertical swipe
        if (deltaY > 0 && direction !== 'up') {
            direction = 'down';
        } else if (deltaY < 0 && direction !== 'down') {
            direction = 'up';
        }
    }
    
    touchStartX = null;
    touchStartY = null;
});

// Update the drawSquare function to remove gradient
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    ctx.strokeRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
}

function updateGame() {
    // Move snake
    const head = { ...snake[0] };
    
    switch(direction) {
        case 'up':
            head.y -= GRID_SIZE;
            break;
        case 'down':
            head.y += GRID_SIZE;
            break;
        case 'left':
            head.x -= GRID_SIZE;
            break;
        case 'right':
            head.x += GRID_SIZE;
            break;
    }

    // Check collisions
    if (head.x < 0 || head.x >= GAME_SIZE || 
        head.y < 0 || head.y >= GAME_SIZE ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Update the food collision check
    if (Math.abs(head.x - food.x) < GRID_SIZE/2 && Math.abs(head.y - food.y) < GRID_SIZE/2) {
        score += 1;
        document.getElementById('scoreValue').textContent = score;
        food = generateFood();
        
        // New speed calculation based on score
        // Speed increases every 5 points, but won't go faster than 50ms
        gameSpeed = Math.max(150 - Math.floor(score/5) * 10, 50);
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, gameSpeed);
    } else {
        snake.pop();
    }

    // Draw game
    ctx.clearRect(0, 0, GAME_SIZE, GAME_SIZE);
    
    // Draw snake
    snake.forEach((segment, index) => {
        const color = index === 0 ? '#00ff00' : '#008000'; // Back to original green colors
        drawSquare(segment.x, segment.y, color);
    });

    // Draw food
    drawSquare(food.x, food.y, '#ff0000');
}

function gameOver() {
    clearInterval(gameLoop);
    hidePauseMenu();
    isPaused = false;
    
    // Check if current score is a high score
    const isHighScore = score > 0 && (
        highScores.length < 10 || score > highScores[highScores.length - 1].score
    );

    if (isHighScore) {
        // Show name input modal
        const modal = document.getElementById('nameInputModal');
        const input = document.getElementById('playerNameInput');
        modal.classList.add('active');
        input.value = '';
        input.focus();

        const submitScore = () => {
            const name = input.value.trim() || 'Anonymous';
            addHighScore(score, name);
            modal.classList.remove('active');
            showHighScores();
        };

        // Handle submit button click
        document.getElementById('submitScoreBtn').onclick = submitScore;
        
        // Handle enter key
        input.onkeypress = (e) => {
            if (e.key === 'Enter') submitScore();
        };
    } else {
        // Show game over screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE);
        
        ctx.fillStyle = '#f00';  // Keep UI in Galaga theme
        ctx.font = '48px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00f';
        ctx.shadowBlur = 10;
        ctx.fillText('GAME OVER', GAME_SIZE/2, GAME_SIZE/2);
        
        ctx.font = '24px "Press Start 2P"';
        ctx.fillText(`SCORE: ${score}`, GAME_SIZE/2, GAME_SIZE/2 + 60);
        ctx.fillText('PRESS SPACE', GAME_SIZE/2, GAME_SIZE/2 + 100);
        
        // Reset shadow
        ctx.shadowBlur = 0;

        // Add event listeners for restart
        const handleRestart = function(e) {
            if (e.type === 'touchend') {
                e.preventDefault();
            } else if (e.type === 'keydown' && e.code !== 'Space') {
                return;
            }
            
            document.removeEventListener('keydown', handleRestart);
            document.removeEventListener('touchend', handleRestart);
            showHomePage();
        };

        document.addEventListener('keydown', handleRestart);
        document.addEventListener('touchend', handleRestart);
    }

    // Update high score if necessary
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScoreValue').textContent = highScore;
        document.getElementById('currentHighScore').textContent = highScore;
    }
}

// Add reset game function
function resetGame() {
    isPaused = false;
    hidePauseMenu();
    snake = [
        { x: Math.floor(GAME_SIZE/2), y: Math.floor(GAME_SIZE/2) },
        { x: Math.floor(GAME_SIZE/2) - GRID_SIZE, y: Math.floor(GAME_SIZE/2) },
        { x: Math.floor(GAME_SIZE/2) - GRID_SIZE*2, y: Math.floor(GAME_SIZE/2) }
    ];
    direction = 'right';
    score = 0;
    document.getElementById('scoreValue').textContent = score;
    gameSpeed = 150;
    food = generateFood();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, gameSpeed);
}

function showHighScores() {
    document.querySelector('.page.active').classList.remove('active');
    document.getElementById('highScoresPage').classList.add('active');
    updateHighScoresList();
}

function showHomePage() {
    document.querySelector('.page.active').classList.remove('active');
    document.getElementById('homepage').classList.add('active');
}

function updateHighScoresList() {
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = '';
    
    highScores.forEach((score, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `
            <span><span class="score-rank">#${index + 1}</span> ${score.name}</span>
            <span>${score.score}</span>
        `;
        highScoresList.appendChild(scoreItem);
    });
}

// Replace the localStorage operations with API calls
async function loadHighScores() {
    try {
        const response = await fetch('https://your-api.com/scores');
        const scores = await response.json();
        highScores = scores;
        updateHighScoresList();
    } catch (error) {
        console.error('Failed to load high scores');
    }
}

// Revert back to the original localStorage version
function addHighScore(score, name) {
    highScores.push({ score, name });
    highScores.sort((a, b) => b.score - a.score);
    if (highScores.length > 10) {
        highScores.pop();
    }
    localStorage.setItem('snakeHighScores', JSON.stringify(highScores));
    updateHighScoresList();
}

// Add pause/resume functions
function togglePause() {
    if (!gameLoop) return; // Don't pause if game is not running
    
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameLoop);
        showPauseMenu();
    } else {
        hidePauseMenu();
        gameLoop = setInterval(updateGame, gameSpeed);
    }
}

function showPauseMenu() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE);
    
    ctx.fillStyle = '#f00';
    ctx.font = '48px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00f';
    ctx.shadowBlur = 10;
    ctx.fillText('PAUSED', GAME_SIZE/2, GAME_SIZE/2 - 50);
    
    // Draw resume button
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = GAME_SIZE/2 - buttonWidth/2;
    const buttonY = GAME_SIZE/2 + 20;
    
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = 3;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.font = '24px "Press Start 2P"';
    ctx.fillStyle = '#f00';
    ctx.fillText('RESUME', GAME_SIZE/2, buttonY + 35);
    
    // Add click handler for resume button
    canvas.addEventListener('click', handlePauseClick);
    canvas.addEventListener('touchend', handlePauseClick);
}

function handlePauseClick(e) {
    if (!isPaused) return;
    
    const rect = canvas.getBoundingClientRect();
    const scale = GAME_SIZE / rect.width;
    const clickX = (e.type === 'click' ? e.clientX : e.changedTouches[0].clientX) - rect.left;
    const clickY = (e.type === 'click' ? e.clientY : e.changedTouches[0].clientY) - rect.top;
    
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = GAME_SIZE/2 - buttonWidth/2;
    const buttonY = GAME_SIZE/2 + 20;
    
    const scaledX = clickX * scale;
    const scaledY = clickY * scale;
    
    if (scaledX >= buttonX && scaledX <= buttonX + buttonWidth &&
        scaledY >= buttonY && scaledY <= buttonY + buttonHeight) {
        togglePause();
    }
}

function hidePauseMenu() {
    canvas.removeEventListener('click', handlePauseClick);
    canvas.removeEventListener('touchend', handlePauseClick);
}

// Update the resize function
function resizeGame() {
    const oldSize = GAME_SIZE;
    GAME_SIZE = Math.floor((Math.min(window.innerWidth, window.innerHeight) - 40) / GRID_SIZE) * GRID_SIZE; // Ensure GAME_SIZE is multiple of GRID_SIZE
    canvas.width = GAME_SIZE;
    canvas.height = GAME_SIZE;
    
    const scale = GAME_SIZE / oldSize;
    
    // Ensure snake positions are grid-aligned
    snake = snake.map(segment => ({
        x: Math.floor((segment.x * scale) / GRID_SIZE) * GRID_SIZE,
        y: Math.floor((segment.y * scale) / GRID_SIZE) * GRID_SIZE
    }));
    
    if (food) {
        food.x = Math.floor((food.x * scale) / GRID_SIZE) * GRID_SIZE;
        food.y = Math.floor((food.y * scale) / GRID_SIZE) * GRID_SIZE;
    }
}

// Update generateFood function to ensure perfect grid alignment
function generateFood() {
    const gridCells = Math.floor(GAME_SIZE / GRID_SIZE);
    const newFood = {
        x: Math.floor(Math.random() * gridCells) * GRID_SIZE,
        y: Math.floor(Math.random() * gridCells) * GRID_SIZE
    };
    
    // Ensure food doesn't spawn on snake
    while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        newFood.x = Math.floor(Math.random() * gridCells) * GRID_SIZE;
        newFood.y = Math.floor(Math.random() * gridCells) * GRID_SIZE;
    }
    
    return newFood;
}

let food = generateFood();

// Add event listener for resize
window.addEventListener('resize', resizeGame);

// Start the game
resizeGame();

// Add this function back near the top with other initialization functions
function startNewGame() {
    document.getElementById('homepage').classList.remove('active');
    document.getElementById('gameContainer').classList.add('active');
    resetGame();
}