'use strict'
import {cells, rows, columns, players} from "./initialData.js";
import {ticTacToeAI} from "./aiLogic.js";

let htmlCells = document.getElementById('cells');
let turn = '';
let ai;


document.getElementById('play').addEventListener('click', (e) => {
    document.getElementById('menuPageTwo').style.display = 'flex';
    document.getElementById('menuPageOne').style.display = 'none';
    htmlCells.style.display = 'none';
    ai = null;
    document.body.removeEventListener('click', handleAIMove);
})
document.getElementById('back').addEventListener('click', (e) => {
    document.getElementById('menuPageTwo').style.display = 'none';
    document.getElementById('menuPageOne').style.display = 'flex';
})

document.getElementById('onePlayer').addEventListener('click', (e) => {
    initTheGame(true);
    if (ai.player === turn) ai.makeMove();
    document.getElementById('menuPageTwo').style.display = 'none';
    document.getElementById('menuPageOne').style.display = 'flex';
})
document.getElementById('twoPlayers').addEventListener('click', (e) => {
    initTheGame(false);
    document.getElementById('menuPageTwo').style.display = 'none';
    document.getElementById('menuPageOne').style.display = 'flex';
})

function initTheGame(IsAIPlaying) {
    if (IsAIPlaying) {
        ai = new ticTacToeAI(players[Math.ceil(Math.random() * 2) - 1]);
        document.body.addEventListener('click', handleAIMove);
    }

    htmlCells.style.display = 'grid';
    htmlCells.addEventListener('click', handleCellClick);
    cells.forEach(row => row.forEach(cell => {
        if (cell.classList.contains('X')) cell.classList.remove('X');
        if (cell.classList.contains('O')) cell.classList.remove('O');
    }))
    document.getElementById('winnerLine').style.display = 'none';
    turn = getTurn();
}

function declareDraw() {
    stopTheGame();
    showMessage('draw!')
}

function declareWinner(winner) {
    showWinnerLine(winner);
    stopTheGame();
    showMessage(`${winner.player} has won!`)
}

function getTurn() {
    return Math.ceil(Math.random() * 2) === 1 ? 'X' : 'O';
}

function stopTheGame() {
    htmlCells.removeEventListener('click', handleCellClick);
    if (ai) document.body.removeEventListener('click', handleAIMove);
}

function showMessage(message) {
    setTimeout(() => alert(message), 0)
}

function getWinner() {
    let winner;
    for (let player of players) {
        winner = isPlayerWon(player);
        if (winner) return winner;
    }

    function isPlayerWon(player) {
        // won by column
        for (let i = 0; i < columns; i++) {
            if (cells.filter(item => item[i].classList.contains(player)).length === rows) return {column: i, player};
        }
        // won by diagonal
        let copyCells = cells.map(rows => rows.map(cell => cell));
        for (let k = 0; k < 2; k++) {
            let chosenInADiagonal = 0;
            copyCells = copyCells.map(rows => rows.reverse());
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    if (i === j && copyCells[i][j].classList.contains(player)) chosenInADiagonal++;
                }
            }
            if (chosenInADiagonal === 3) return {diagonal: k, player};
        }
        // won by row
        for (let i = 0; i < rows; i++) {
            if (cells[i].filter(elem => elem.classList.contains(player)).length === columns) return {row: i, player}
        }
        // no one won
        return;
    }
}


function showWinnerLine(winnerData) {
    let winnerLine = document.getElementById('winnerLine');
    winnerLine.style.display = 'block';
    positioningWinningLineBasedOnWinnerData(winnerData);

    function positioningWinningLineBasedOnWinnerData(winnerData) {
        let entries = Object.entries(winnerData)
        let [key, value] = entries[0];
        switch (key) {
            case 'column':
                winnerLine.style.transform = `rotate(${90}deg)`;
                winnerLine.style.left = value === 0 ? '-33.5%' : value === 1 ? '0' : '33.5%'
                winnerLine.style.top = '50%';
                break;
            case 'row':
                winnerLine.style.transform = `rotate(${0}deg)`;
                winnerLine.style.top = value === 0 ? '17%' : value === 1 ? '50%' : '84%'
                winnerLine.style.left = 0;
                break;
            case 'diagonal':
                winnerLine.style.transform = `rotate(${value === 0 ? -45 : 45}deg)`;
                winnerLine.style.top = '50%';
                winnerLine.style.left = 0;
                break;
            default:
                break;
        }
    }
}



function handleAIMove(e) {
    if (!e.target.classList.contains('cell')) return;

    ai.makeMove();
    let winner = getWinner();
    if (winner) {
        declareWinner(winner);
        return;
    }

    if (cells.filter(row => row.filter(cell => cell.classList.contains('X') || cell.classList.contains('O')).length === columns).length === rows) {
        declareDraw();
    }
}

function handleCellClick(e) {
    if (!e.target.classList.contains('cell')) {
        e.stopPropagation();
        return;
    }
    if (e.target.classList.contains('X') || e.target.classList.contains('O')) {
        e.stopPropagation();
        return;
    }

    if (ai) {
        e.target.classList.add(ai.player === 'X' ? 'O' : 'X');
    } else {
        if (turn === 'X') {
            e.target.classList.add('X')
            turn = 'O';
        } else {
            e.target.classList.add('O')
            turn = 'X';
        }
    }

    let winner = getWinner();
    if (winner) {
        e.stopPropagation();
        declareWinner(winner);
        return;
    }

    if (cells.filter(row => row.filter(cell => cell.classList.contains('X') || cell.classList.contains('O')).length === columns).length === rows) {
        e.stopPropagation();
        declareDraw();
    }
}