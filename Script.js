const boardEl = document.getElementById("board");

let currentBoard = [];

function newGame(difficulty) {
  const puzzles = {
    easy: "53--7----6--195----98----6-8---6---34--8-3--17---2---6----6-28----419--5----8--79",
    medium: "--9-------4----6-758--1---6----3--82---2--6---17--9----9---6--251-8----6-------4--",
    hard: "---7-8-1----9----2-6-1---5----1-29------8---4------45-7----2---8-4----3----6-5-1---"
  };

  const puzzle = puzzles[difficulty];
  boardEl.innerHTML = '';
  currentBoard = [];

  for (let i = 0; i < 81; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    const input = document.createElement("input");
    input.maxLength = 1;
    input.type = "text";

    if (puzzle[i] !== '-') {
      input.value = puzzle[i];
      input.disabled = true;
    } else {
      input.value = "";
      input.addEventListener("input", () => {
        const val = input.value;
        if (!/^[1-9]$/.test(val)) input.value = '';
      });
    }

    cell.appendChild(input);
    boardEl.appendChild(cell);
    currentBoard.push(input);
  }
}

function getBoardValues() {
  return currentBoard.map(cell => cell.value || '-');
}

function checkBoard() {
  const values = getBoardValues();

  for (let i = 0; i < 81; i++) {
    const val = values[i];
    if (val === '-') continue;

    const row = Math.floor(i / 9);
    const col = i % 9;

    // Check row
    for (let j = 0; j < 9; j++) {
      if (j !== col && values[row * 9 + j] === val) {
        alert("Invalid entry at row " + (row + 1));
        return;
      }
    }

    // Check column
    for (let j = 0; j < 9; j++) {
      if (j !== row && values[j * 9 + col] === val) {
        alert("Invalid entry at column " + (col + 1));
        return;
      }
    }

    // Check box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        const idx = r * 9 + c;
        if (idx !== i && values[idx] === val) {
          alert("Invalid box entry.");
          return;
        }
      }
    }
  }

  alert("Board is valid so far!");
}

function solveBoard() {
  let values = getBoardValues();

  function isValid(board, index, num) {
    const row = Math.floor(index / 9);
    const col = index % 9;

    for (let i = 0; i < 9; i++) {
      if (board[row * 9 + i] === num) return false;
      if (board[i * 9 + col] === num) return false;
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (board[r * 9 + c] === num) return false;
      }
    }

    return true;
  }

  function solve(board, index = 0) {
    if (index >= 81) return true;
    if (board[index] !== '-') return solve(board, index + 1);

    for (let n = 1; n <= 9; n++) {
      const num = n.toString();
      if (isValid(board, index, num)) {
        board[index] = num;
        if (solve(board, index + 1)) return true;
        board[index] = '-';
      }
    }

    return false;
  }

  if (solve(values)) {
    for (let i = 0; i < 81; i++) {
      currentBoard[i].value = values[i];
    }
    alert("Solved!");
  } else {
    alert("No solution found!");
  }
}

newGame('easy');
