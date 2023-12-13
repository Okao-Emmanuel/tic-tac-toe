const boxes = document.querySelectorAll('.box');
let currentPlayer = 'X'; // Human starts as 'X'
let gameMode = 'two-player'; // Default game mode
let aiDifficulty = 'easy';
let isGameOver = false;

// Event listeners for game mode selection
document.getElementById('single-player').addEventListener('click', function() {
    gameMode = 'single-player';
    resetGame();
});

document.getElementById('two-player').addEventListener('click', function() {
    gameMode = 'two-player';
    resetGame();
});

// Event listener for AI difficulty selection
document.getElementById('ai-difficulty').addEventListener('change', function() {
    aiDifficulty = this.value;
});

// Set up event listeners for each box in the grid
boxes.forEach(box => {
    box.addEventListener("click", () => {
        if (!isGameOver && box.innerHTML === "" && (gameMode !== 'single-player' || currentPlayer === 'X')) {
            box.innerHTML = currentPlayer;
            if (checkGameStatus()) return;
            if (gameMode === 'single-player') {
                changeTurn();
                aiMove();
            } else {
                changeTurn();
            }
        }
    });
});

// Event listener for the 'Play Again' button
document.querySelector("#play-again").addEventListener("click", resetGame);

// Function to change the current player
function changeTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to check the game status (win or draw)
function checkGameStatus() {
    if (checkWin()) {
        isGameOver = true;
        document.querySelector("#results").innerHTML = currentPlayer + " wins!";
        document.querySelector("#play-again").style.display = "block";
        return true;
    } else if (checkDraw()) {
        isGameOver = true;
        document.querySelector("#results").innerHTML = "It's a draw!";
        document.querySelector("#play-again").style.display = "block";
        return true;
    }
    return false;
}

// Function to check for a win
function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winConditions.some(condition => {
        return boxes[condition[0]].innerHTML === currentPlayer &&
               boxes[condition[0]].innerHTML === boxes[condition[1]].innerHTML &&
               boxes[condition[1]].innerHTML === boxes[condition[2]].innerHTML;
    });
}

// Function to check for a draw
function checkDraw() {
    return Array.from(boxes).every(box => box.innerHTML.trim() !== '');
}

// Function for the AI to make a move
function aiMove() {
    if (gameMode !== 'single-player' || isGameOver) return;

    setTimeout(() => {
        if (aiDifficulty === 'easy' || aiDifficulty === 'medium') {
            makeRandomMove();
        } else if (aiDifficulty === 'hard') {
            makeBestMove();
        }
        if (checkGameStatus()) return;
        changeTurn();
    }, 500);
}

// Function for AI to make a random move
function makeRandomMove() {
    let emptyBoxes = Array.from(boxes).filter(box => box.innerHTML === "");
    if (emptyBoxes.length > 0) {
        let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        randomBox.innerHTML = 'O'; // AI is always 'O'
    }
}

// Minimax algorithm for hard difficulty
function makeBestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerHTML === '') {
            boxes[i].innerHTML = 'O';
            let score = minimax(boxes, 0, false);
            boxes[i].innerHTML = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    if (move !== undefined) {
        boxes[move].innerHTML = 'O';
    }
}

function minimax(newBoard, depth, isMaximizing) {
    let scores = {
        'X': -10,
        'O': 10,
        'Tie': 0
    };

    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i].innerHTML === '') {
                newBoard[i].innerHTML = 'O';
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i].innerHTML = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i].innerHTML === '') {
                newBoard[i].innerHTML = 'X';
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i].innerHTML = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let condition of winConditions) {
        if (boxes[condition[0]].innerHTML === boxes[condition[1]].innerHTML &&
            boxes[condition[1]].innerHTML === boxes[condition[2]].innerHTML &&
            boxes[condition[0]].innerHTML !== '') {
            return boxes[condition[0]].innerHTML;
        }
    }

    if (Array.from(boxes).every(box => box.innerHTML.trim() !== '')) {
        return 'Tie';
    }

    return null;
}

// Function to reset the game
function resetGame() {
    isGameOver = false;
    currentPlayer = 'O'; // Human player always starts as 'X'
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";
    boxes.forEach(box => {
        box.innerHTML = "";
    });
}
// Event listener for the 'Restart' button
document.getElementById('restart-game').addEventListener('click', function() {
    restartGame();
});

// Function to restart the game
function restartGame() {
    // Reset game state
    isGameOver = false;
    currentPlayer = 'O'; // Set the starting player to 'O'
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    // Clear the game board
    boxes.forEach(box => {
        box.innerHTML = "";
    });
}


// Initial game setup
resetGame();
