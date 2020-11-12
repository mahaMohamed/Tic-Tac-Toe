const gameGridContainer = document.querySelector("#game-grid-container");
const markedCell = [false, false, false, false, false, false, false, false, false];
let turns = 9;


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

let player2 = Player("human", "x");
let player1 = Player("computer", "o");


/* Game Object that contains the logic of the game*/
const game = (function (gameGrid) {

    const isThereAWinner = function (x, y, z) {

        if (gameGrid[x].innerText === gameGrid[y].innerText &&
            gameGrid[y].innerText === gameGrid[z].innerText &&
            gameGrid[x].innerText != "") {
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
                // console.log(winner.winnerMark);
                // console.log(JSON.stringify(winner.winningSequence));
                return winner;
            }
        }

        for (let i = 0; i < 3; i++) {
            winner = isThereAWinner(0 + i, 3 + i, 6 + i);
            if (winner.win) {
                // console.log(winner.winnerMark);
                // console.log(JSON.stringify(winner.winningSequence));
                return winner;
            }
        }

        winner = isThereAWinner(0, 4, 8);
        if (winner.win) {
            // console.log(winner.winnerMark);
            // console.log(JSON.stringify(winner.winningSequence));
            return winner;
        }

        winner = isThereAWinner(2, 4, 6);
        if (winner.win) {
            // console.log(winner.winnerMark);
            // console.log(JSON.stringify(winner.winningSequence));
            return winner;
        }




    }

    const getRandomInt = function () {
        return Math.floor(Math.random() * (9 - 0 + 1)) + 0;


    }

    const playComputerTurn = function () {

        turns--;

        if (turns <= 0)
            return;

        let randomNumber = getRandomInt();


        while (true) {
            randomNumber = getRandomInt();
            if (markedCell[randomNumber] == false) {
                break;
            }
        }

        gameGrid[randomNumber].innerText = player2.getPlayerMark();
        markedCell[randomNumber] = true;

    }

    const checkForEnd = function () {

        for (let i = 0; i < markedCell.length; i++) {
            if (markedCell[i] == false)
                return false;
        }

        return true;
    }

    return {
        checkForWins,
        playComputerTurn,
        checkForEnd
    }




})(gameGrid)




//Gameboard Object created using Revealing Module Design Pattern
const gameBoard = (function (gameGrid) {


    const declareWinner = function (winner) {
        for (let i = 0; i < gameGrid.length; i++) {
            gameGrid[i].removeEventListener("click", gameBoard.playGame);
        }

        alert("player " + winner + " has won the game");

    }

    const playGame = function (e) {

        let winner = null;

        if (!markedCell[e.target.id]) {
            e.target.innerText = player1.getPlayerMark();
            markedCell[e.target.id] = true;
            turns--;


      
            setTimeout(function () {
                winner = game.checkForWins();
                if (winner != null){
                    declareWinner(winner.winnerMark);
                }

            }, 100);


            setTimeout(function(){
                if (game.checkForEnd() == true && winner == null ){
                    alert("game has tied");
                }
    
            }, 110)
            

            setTimeout(function () {
                if (winner == null) {
                    setTimeout(game.playComputerTurn, 150);

                    setTimeout(function () {
                        winner = game.checkForWins();
                        if (winner != null)
                            declareWinner(winner.winnerMark);
                    }, 170);
                }
            }, 120);



        }
    }



    const addMove = function (player, move) {
        player.addMove(move);
        playGame(player.getPlayerMark(), move.getCoordinates());
    }

    return {
        addMove,
        playGame,
    }



})(gameGrid);


for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].addEventListener("click", gameBoard.playGame);
}








// let player1 = Player("sam", "x");
// console.log(player1.getPlayerName() + " " + player1.getPlayerMark() + " " + player1.getScore())
// player1.playerWin();
// console.log(player1.score);
// console.log(player1.getScore());









// game.checkForWins();