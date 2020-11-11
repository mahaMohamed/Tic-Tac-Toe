const gameGridContainer = document.querySelector("#game-grid-container");
const markedCell = [];


/* IIFE that creates the 3x3 Game Grid and puts it in the "game-grid-container"*/
(function () {
    const div = document.createElement('div');

    /* The squares in the grid are gonna be grouped under the class "cells"*/
    div.classList.add("cells");

    /*Adding styling elements*/
    div.style.borderRight = "0.1px solid black";
    div.style.borderBottom = "0.1px solid black";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";

    /*Attaching the cells to the grid*/
    for (let i = 0; i < 9; i++) {
        div.setAttribute("id", i);
        gameGridContainer.appendChild(div.cloneNode());

    }

})();

/*The Nodelist that contains the grid cells*/
const gameGrid = document.querySelectorAll(".cells");







/*Player Object created using Factory Design Pattern*/
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


/* Game Object that contains the logic of the game*/
const game = (function(gameGrid){

    const isThereAWinner = function (x, y, z) {

        if (gameGrid[x].innerText === gameGrid[y].innerText &&
            gameGrid[y].innerText === gameGrid[z].innerText && 
            gameGrid[x].innerText != "" ) {
            return {
                win: true,
                winnerMark: gameGrid[x].innerText,
                winningSequence: [x, y, z]
            }
        }
        else {
            return { win: false };
        }

    }

    const checkForWins = function () {


        for (let i = 0; i <= 6; i += 3) {
            let winner = isThereAWinner(0 + i, 1 + i, 2 + i);
            if (winner.win) {
                console.log(winner.winnerMark);
                console.log(JSON.stringify(winner.winningSequence));
                return winner;
            }
        }

        for (let i=0; i<3; i++){
             winner = isThereAWinner (0+i, 3+i, 6+i);
            if (winner.win){
                console.log(winner.winnerMark);
                console.log(JSON.stringify(winner.winningSequence));
                return winner;
            }
        }

        winner = isThereAWinner (0, 4, 8);
        if (winner.win){
            console.log(winner.winnerMark);
            console.log(JSON.stringify(winner.winningSequence));
            return winner;
        }

        winner = isThereAWinner (2, 4, 6);
        if (winner.win){
            console.log(winner.winnerMark);
            console.log(JSON.stringify(winner.winningSequence));
            return winner;
        }
    }

    return {
        checkForWins
    }




})(gameGrid)




//Gameboard Object created using Revealing Module Design Pattern
const gameBoard = (function (gameGrid) {

    const drawMark = function (e) {
        if (!markedCell[e.target.id]) {
            //TODO add the mark dynamically based on the player
            e.target.innerText = "x";
            markedCell[e.target.id] = true;
            game.checkForWins();
        }
    }

    const addMove = function (player, move) {
        player.addMove(move);
        drawMark(player.getPlayerMark(), move.getCoordinates());
    }

    return {
        addMove,
        drawMark,
    }



})(gameGrid);










let player1 = Player("sam", "x");
console.log(player1.getPlayerName() + " " + player1.getPlayerMark() + " " + player1.getScore())
player1.playerWin();
console.log(player1.score);
console.log(player1.getScore());

for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].addEventListener("click", gameBoard.drawMark);
}


game.checkForWins();