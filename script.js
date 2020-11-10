const gameGridContainer = document.querySelector("#game-grid-container");

(function(){
    const div = document.createElement('div'); 
    div.classList.add("cells"); 
    div.style.borderRight = "0.1px solid black";
    div.style.borderBottom = "0.1px solid black";
    console.log("hello");

    for (let i=0; i<9; i++){
        div.setAttribute("id" , i); 
        gameGridContainer.appendChild(div.cloneNode()); 

    }

})();

const gameGrid = document.querySelectorAll(".cells");


for (let i=0; i<gameGrid.length; i++){
    gameGrid[i].textContent = "x";
}










//Player Object created using Factory Design Pattern 
const Player = function (playerName, playerMark) {


    let score = 0;
    const playerMoves = [];
    const play = function () {

    }

    const getScore = () => score;
    const getPlayerName = () => playerName;
    const getPlayerMark = () => playerMark;
    const getPlayerMoves = () => playerMoves;
    const addMove = move => {
        playerMoves.push(move);
    }
    const playerWin = () => {
        score++;
    }


    return {
        getPlayerName,
        getPlayerMoves,
        getPlayerMark,
        getScore,
        play,
        addMove,
        playerWin

    };

};



//Gameboard Object created using Revealing Module Design Pattern
const gameBoard = (function (gameGrid) {

    /*gameGrid: an array of 3x3 grid used to represent the Tic Tac Toe game grid*/
    const drawMark = function (mark, move) {

        /*drawing the mark logic*/

    }

    const addMove = function (player, move) {
        player.addMove(move);
        drawMark(player.getPlayerMark(), move.getCoordinates());
    }

    return {
        addMove,
    }



})(gameGrid);











let player1 = Player("sam", "x");
console.log(player1.getPlayerName() + " " + player1.getPlayerMark() + " " + player1.getScore())
player1.playerWin();
console.log(player1.score);
console.log(player1.getScore());
