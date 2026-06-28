// Game state
const board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let winningLine = [];

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// UI references
const cells = Array.from(document.querySelectorAll(".cell"));
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const scoreEls = {
  X: document.getElementById("score-x"),
  O: document.getElementById("score-o"),
  draws: document.getElementById("score-draws"),
};
const playerPills = Array.from(document.querySelectorAll(".player-pill"));

// Score tracking
const scores = {
  X: 0,
  O: 0,
  draws: 0,
};

// Initialize the game when the page loads
initializeGame();

// Attach event listeners
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

restartBtn.addEventListener("click", restartGame);

function initializeGame() {
  board.fill("");
  currentPlayer = "X";
  gameActive = true;
  winningLine = [];

  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.classList.remove("filled", "winner-cell");
    cell.disabled = false;
    cell.setAttribute("aria-label", `Cell ${index + 1}`);
  });

  updateStatus(`Player ${currentPlayer}'s turn`);
  updatePlayerIndicator();
  renderScores();
}

function handleCellClick(event) {
  const clickedIndex = Number(event.currentTarget.dataset.index);

  if (!gameActive || board[clickedIndex] !== "") {
    return;
  }

  updateCell(clickedIndex, currentPlayer);

  if (checkWinner()) {
    gameActive = false;
    updateStatus(`Player ${currentPlayer} Wins!`);
    highlightWinningCells();
    scores[currentPlayer] += 1;
    renderScores();
    return;
  }

  if (checkDraw()) {
    gameActive = false;
    updateStatus("It's a Draw!");
    scores.draws += 1;
    renderScores();
    return;
  }

  switchPlayer();
  updateStatus(`Player ${currentPlayer}'s turn`);
  updatePlayerIndicator();
}

function updateCell(index, player) {
  board[index] = player;
  const cell = cells[index];
  cell.textContent = player;
  cell.classList.add("filled");
  cell.disabled = true;
  cell.setAttribute("aria-label", `Cell ${index + 1} occupied by ${player}`);
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updatePlayerIndicator();
}

function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winningLine = combination;
      return true;
    }
  }

  winningLine = [];
  return false;
}

function checkDraw() {
  return board.every((cell) => cell !== "");
}

function highlightWinningCells() {
  winningLine.forEach((index) => {
    cells[index].classList.add("winner-cell");
  });
}

function restartGame() {
  initializeGame();
}

function updateStatus(message) {
  statusEl.textContent = message;
}

function updatePlayerIndicator() {
  playerPills.forEach((pill) => {
    const isActive = pill.dataset.player === currentPlayer;
    pill.classList.toggle("active", isActive);
  });
}

function renderScores() {
  scoreEls.X.textContent = scores.X;
  scoreEls.O.textContent = scores.O;
  scoreEls.draws.textContent = scores.draws;
}
