const canvas = document.getElementById('minesweeper');
const ctx = canvas.getContext('2d');


const tileWidth = 32;
const fieldWidth = Math.floor(canvas.width / tileWidth);
const fieldHeight = Math.floor(canvas.height / tileWidth);

const startingMines = Math.floor(fieldWidth * fieldHeight / 10);

const field = [];

function initField() {
  for (let i = 0; i < fieldHeight; i++) {
    field[i] = [];
    for (let j = 0; j < fieldWidth; j++) {
      field[i][j] = {
        x: j,
        y: i,
        mine: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0
      };
    }
  }
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < startingMines) {
        const x = Math.floor(Math.random() * fieldWidth);
        const y = Math.floor(Math.random() * fieldHeight);
        if (!field[y][x].mine) {
        field[y][x].mine = true;
        minesPlaced++;
        }
    }
}

function countAdjacentMines() {
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            let adjacentMines = 0;
            for (let y = Math.max(0, i - 1); y <= Math.min(fieldHeight - 1, i + 1); y++) {
                for (let x = Math.max(0, j - 1); x <= Math.min(fieldWidth - 1, j + 1); x++) {
                    if (field[y][x].mine) {
                        adjacentMines++;
                    }
                }
            }
            field[i][j].adjacentMines = adjacentMines;
        }
    }
}

function drawField() {
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            const tile = field[i][j];
            ctx.beginPath();
            ctx.rect(tile.x * tileWidth, tile.y * tileWidth, tileWidth, tileWidth);
            ctx.fillStyle = '#ccc';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }
    }
}

function drawMines() {
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            const tile = field[i][j];
            if (tile.mine) {
                ctx.beginPath();
                ctx.arc(tile.x * tileWidth + tileWidth / 2, tile.y * tileWidth + tileWidth / 2, tileWidth / 4, 0, 2 * Math.PI);
                ctx.fillStyle = '#000';
                ctx.fill();
            }
        }
    }
}

function drawNumbers() {
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            const tile = field[i][j];
            if (tile.adjacentMines > 0) {
                ctx.font = '20px Arial';
                ctx.fillStyle = '#000';
                ctx.fillText(tile.adjacentMines, tile.x * tileWidth + tileWidth / 2 - 5, tile.y * tileWidth + tileWidth / 2 + 5);
            }
        }
    }
}

function drawFlag(x, y) {
    const tile = field[y][x];
    ctx.beginPath();
    ctx.moveTo(tile.x * tileWidth + tileWidth / 2, tile.y * tileWidth + tileWidth / 2);
    ctx.lineTo(tile.x * tileWidth + tileWidth / 2, tile.y * tileWidth + tileWidth / 2 - tileWidth / 4);
    ctx.lineTo(tile.x * tileWidth + tileWidth / 2 + tileWidth / 4, tile.y * tileWidth + tileWidth / 2 - tileWidth / 4);
    ctx.lineTo(tile.x * tileWidth + tileWidth / 2 + tileWidth / 4, tile.y * tileWidth + tileWidth / 2 + tileWidth / 4);
    ctx.lineTo(tile.x * tileWidth + tileWidth / 2, tile.y * tileWidth + tileWidth / 2 + tileWidth / 4);
    ctx.lineTo(tile.x * tileWidth + tileWidth / 2, tile.y * tileWidth + tileWidth / 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function drawTile(x, y) {
    const tile = field[y][x];
    ctx.beginPath();
    ctx.rect(tile.x * tileWidth, tile.y * tileWidth, tileWidth, tileWidth);
    ctx.fillStyle = '#ccc';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function drawRevealedTile(x, y) {
    const tile = field[y][x];
    ctx.beginPath();
    ctx.rect(tile.x * tileWidth, tile.y * tileWidth, tileWidth, tileWidth);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function revealTile(x, y) {
    const tile = field[y][x];
    if (tile.revealed) {
        return;
    }
    tile.revealed = true;
    drawRevealedTile(x, y);
    if (tile.adjacentMines > 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(tile.adjacentMines, tile.x * tileWidth + tileWidth / 2 - 5, tile.y * tileWidth + tileWidth / 2 + 5);
    } else {
        for (let y = Math.max(0, tile.y - 1); y <= Math.min(fieldHeight - 1, tile.y + 1); y++) {
            for (let x = Math.max(0, tile.x - 1); x <= Math.min(fieldWidth - 1, tile.x + 1); x++) {
                revealTile(x, y);
            }   
        }
    }
}

function revealMines() {
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            const tile = field[i][j];
            if (tile.mine) {
                drawRevealedTile(tile.x, tile.y);
                ctx.beginPath();
                ctx.arc(tile.x * tileWidth + tileWidth / 2, tile.y * tileWidth + tileWidth / 2, tileWidth / 4, 0, 2 * Math.PI);
                ctx.fillStyle = '#000';
                ctx.fill();
            }
        }
    }
}

function revealAll() {
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            const tile = field[i][j];
            if (!tile.revealed) {
                revealTile(tile.x, tile.y);
            }
        }
    }
}

function checkWin() {
    let win = true;
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            const tile = field[i][j];
            if (!tile.mine && !tile.revealed) {
                win = false;
            }
        }
    }
    if (win) {
        alert('You win!');
    }
}

function checkLose() {
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            const tile = field[i][j];
            if (tile.mine && tile.revealed) {
                revealMines();
                alert('You lose!');
            }
        }
    }
}

function clickTile(x, y) {
    const tile = field[y][x];
    if (tile.flagged) {
        return;
    }
    if (tile.mine) {
        revealMines();
        alert('You lose!');
    } else {
        revealTile(x, y);
        checkWin();
    }
}

function flagTile(x, y) {
    const tile = field[y][x];
    if (tile.revealed) {
        return;
    }
    if (tile.flagged) {
        tile.flagged = false;
        drawTile(x, y);
    } else {
        tile.flagged = true;
        drawFlag(x, y);
    }
}

function clickHandler(e) {
    const x = Math.floor(e.offsetX / tileWidth);
    const y = Math.floor(e.offsetY / tileWidth);
    clickTile(x, y);
    checkLose();
}

function flagHandler(e) {
    e.preventDefault();
    const x = Math.floor(e.offsetX / tileWidth);
    const y = Math.floor(e.offsetY / tileWidth);
    flagTile(x, y);
}

canvas.addEventListener('click', clickHandler);
canvas.addEventListener('contextmenu', flagHandler);

function start(){
    initField();
    placeMines();
    countAdjacentMines();
    drawField();
}

start();