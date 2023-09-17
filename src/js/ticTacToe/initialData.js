
export let cells = [];
export let rows = 3;
export let columns = 3;
export let players = ['X', 'O'];

(function setCells() {
    let currentRow = 0;
    for (let i = 0; i < rows; i++){
        let row = [];
        for (let j = currentRow; j < (columns+currentRow); j++){
            row.push(document.getElementById('cells').children[j])
        }
        currentRow+=3;
        cells.push(row);
    }
}())