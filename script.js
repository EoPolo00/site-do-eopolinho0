// Jogo da Velha
let cells = document.querySelectorAll(".cell");
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let winnerDisplay = document.getElementById("winner");
let scoreDisplay = document.getElementById("score");
let difficulty = document.getElementById("difficulty");
let playerScore = 0, botScore = 0;
let gameOver = false;

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.textContent = "");
  winnerDisplay.textContent = "";
  currentPlayer = "X";
  gameOver = false;
}

function playerMove(index) {
  if (board[index] === "" && !gameOver) {
    board[index] = "X";
    cells[index].textContent = "X";
    if (checkWinner("X")) {
      winnerDisplay.textContent = "Você venceu!";
      playerScore++;
      updateScore();
      gameOver = true;
      return;
    }
    if (board.every(cell => cell !== "")) {
      winnerDisplay.textContent = "Empate!";
      gameOver = true;
      return;
    }
    botMove(); // sem delay!
  }
}

function botMove() {
  let move = getBotMove();
  if (move !== -1) {
    board[move] = "O";
    cells[move].textContent = "O";
    if (checkWinner("O")) {
      winnerDisplay.textContent = "GORDAO venceu!";
      botScore++;
      updateScore();
      gameOver = true;
    } else if (board.every(cell => cell !== "")) {
      winnerDisplay.textContent = "Empate!";
      gameOver = true;
    }
  }
}

function updateScore() {
  scoreDisplay.textContent = `Você: ${playerScore} | GORDAO: ${botScore}`;
}

function getBotMove() {
  let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  if (difficulty.value === "easy") return empty[Math.floor(Math.random() * empty.length)];
  if (difficulty.value === "medium") {
    for (let i of empty) {
      board[i] = "O";
      if (checkWinner("O")) { board[i] = ""; return i; }
      board[i] = "";
    }
    for (let i of empty) {
      board[i] = "X";
      if (checkWinner("X")) { board[i] = ""; return i; }
      board[i] = "";
    }
    return empty[Math.floor(Math.random() * empty.length)];
  }
  return minimax(board, "O").index;
}

function minimax(newBoard, player) {
  let empty = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  if (checkWinner("X", newBoard)) return { score: -10 };
  if (checkWinner("O", newBoard)) return { score: 10 };
  if (empty.length === 0) return { score: 0 };

  let moves = [];
  for (let i of empty) {
    let move = { index: i };
    newBoard[i] = player;
    let result = minimax(newBoard, player === "O" ? "X" : "O");
    move.score = result.score;
    newBoard[i] = "";
    moves.push(move);
  }
  return moves.reduce((best, move) =>
    (player === "O" ? move.score > best.score : move.score < best.score) ? move : best
  );
}

function checkWinner(player, customBoard = board) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(line => line.every(i => customBoard[i] === player));
}

// Jogo da Cobrinha
const canvas = document.getElementById("snake");
const ctx = canvas?.getContext("2d");
const box = 20;
let snake, direction, food, score, highScore, game;

function startSnakeGame() {
  document.getElementById("snake-container").style.display = "block";
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  food = generateFood();
  score = 0;
  highScore = localStorage.getItem("highScore") || 0;
  document.getElementById("score-snake").innerText = `Pontuação: ${score} | Recorde: ${highScore}`;
  if (!game) game = setInterval(drawSnakeGame, 100);
}

document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();
  if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
  else if ((key === "arrowup" || key === "w") && direction !== "DOWN") direction = "UP";
  else if ((key === "arrowright" || key === "d") && direction !== "LEFT") direction = "RIGHT";
  else if ((key === "arrowdown" || key === "s") && direction !== "UP") direction = "DOWN";
});

function generateFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function drawSnakeGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  if (headX === food.x && headY === food.y) {
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    document.getElementById("score-snake").innerText = `Pontuação: ${score} | Recorde: ${highScore}`;
    food = generateFood();
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  if (
    headX < 0 || headX >= canvas.width ||
    headY < 0 || headY >= canvas.height ||
    snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
  ) {
    clearInterval(game);
    alert("Game Over!");
    location.reload();
    return;
  }

  snake.unshift(newHead);
}
