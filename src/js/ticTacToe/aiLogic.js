'use strict'
import {cells} from "./initialData.js";

export class ticTacToeAI{

    constructor(player = 'X') {
        this.player = player
    }

    makeMove(){
        let copyCells = cells.map(row => row.filter(cell => !cell.classList.contains('X') && !cell.classList.contains('O')));
        copyCells = copyCells.flatMap(row => row.map(cell=>cell));

        let randomCell = Math.ceil(Math.random()*(copyCells.length-1));
        copyCells[randomCell].classList.add(this.player)
    }
}


