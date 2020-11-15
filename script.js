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
        // div.setAttribute("move" , i);
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

let humanPlayer = Player("human", "x");
let computerPlayer = Player("computer", "o");


/* Game Object that contains the logic of the game*/
const game = (function (gameGrid) {

    const _isThereAWinner = function (x, y, z) {

        if (gameGrid[x].moveMark === gameGrid[y].moveMark &&
            gameGrid[y].moveMark === gameGrid[z].moveMark &&
           ( gameGrid[x].moveMark == "x" || gameGrid[x].moveMark == "o")) {
            //    console.log(x,y,z);
            return {
                win: true,
                winnerMark: gameGrid[x].moveMark,
                winningSequence: [x, y, z]
            }
        }
        else {
            return { win: false };
        }

    }

    const checkForWins = function () {


        for (let i = 0; i <= 6; i += 3) {
            let winner = _isThereAWinner(0 + i, 1 + i, 2 + i);
            if (winner.win) {
                return winner;
            }
        }

        for (let i = 0; i < 3; i++) {
            winner = _isThereAWinner(0 + i, 3 + i, 6 + i);
            if (winner.win) {
                return winner;
            }
        }

        winner = _isThereAWinner(0, 4, 8);
        if (winner.win) {
            return winner;
        }

        winner = _isThereAWinner(2, 4, 6);
        if (winner.win) {
            return winner;
        }


        return null;




    }

    const _getRandomInt = function () {
        return Math.floor(Math.random() * (9 - 0 + 1)) + 0;


    }
    const playComputerTurn = function () {

        turns--;
        if (turns <= 0)
            return;

        let randomNumber = _getRandomInt();

        while (true) {
            randomNumber = _getRandomInt();
            if (markedCell[randomNumber] == false) {
                break;
            }
        }

        // gameGrid[randomNumber].innerHTML = computerPlayer.getPlayerMark();
        // markedCell[randomNumber] = true;
        // gameGrid[randomNumber].moveMark = computerPlayer.getPlayerMark();

        let computerBestMove = minimax(gameGrid, computerPlayer, 0).id;

        gameGrid[computerBestMove].innerHTML = computerPlayer.getPlayerMark();
        markedCell[computerBestMove] = true;
        gameGrid[computerBestMove].moveMark = computerPlayer.getPlayerMark();

    }

    const checkForEnd = function () {

        for (let i = 0; i < markedCell.length; i++) {
            if (markedCell[i] == false)
                return false;
        }

        return true;
    }


    const _getEmptySpaces = function () {
        let emptySpacesArray = [];

        for (let i = 0; i < markedCell.length; i++) {
            if (markedCell[i] === false)
                emptySpacesArray.push(i);
        }

        return emptySpacesArray;

    }

    const minimax = function (gameGrid, player, depth) {

        //Base case
        // debugger;

        // console.log(JSON.stringify(moves));
        let winner = checkForWins();
        if (winner !== null) {

            if (winner.winnerMark === humanPlayer.getPlayerMark()) {


                return {
                    evaluation: depth - 10
                }
            }

            else if (winner.winnerMark === computerPlayer.getPlayerMark()) {
                return {
                    evaluation: 10 - depth
                }
            }
        }

        else if (checkForEnd() === true) {
            return {
                evaluation: 0
            }
        }



        let emptySpaces = _getEmptySpaces();
        let moves = [];


        //Looping over empty spaces in the grid to play each one of them and evaluate their value 
        //in order to make a decision
        for (let i = 0; i < emptySpaces.length; i++) {

            //Getting the empty space and saving it in "id"
            let move = {};
            let id = emptySpaces[i];
            move.id = id;

            let backup = undefined;

            //Playing the empty space
            gameGrid[id].moveMark = player.getPlayerMark();
            markedCell[id] = true;



            //Recursive Call
            if (player.getPlayerMark() === computerPlayer.getPlayerMark()) {
                move.evaluation = minimax(gameGrid, humanPlayer, depth+1).evaluation;
            }

            else if (player.getPlayerMark() === humanPlayer.getPlayerMark()) {
                move.evaluation = minimax(gameGrid, computerPlayer, depth+1).evaluation;
            }


            //Restoring the grid to its original state
            gameGrid[id].moveMark = backup;
            // gamedGrid[id].removeAttribute("moveMark");
            markedCell[id] = false;

            //Saving the move to further evaluate the moves based on their weight 
            moves.push(move);
            // console.log(JSON.stringify(moves));

        }

        //Minimax Algorithm 


        let bestMove;

        if (player.getPlayerMark() === computerPlayer.getPlayerMark()) {

            let bestEvaluation = -Infinity;

            for (let i = 0; i < moves.length; i++) {
                if (moves[i].evaluation > bestEvaluation) {
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i];

                }
            }


        }

        else {

            let bestEvaluation = +Infinity;

            for (let i = 0; i < moves.length; i++) {
                if (moves[i].evaluation < bestEvaluation) {
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i];

                }
            }


        }


        // console.log("best " +bestMove);
        return bestMove;


    }

    return {
        checkForWins,
        playComputerTurn,
        checkForEnd,
        minimax,
    }




})(gameGrid)




//Gameboard Object created using Revealing Module Design Pattern
const gameBoard = (function (gameGrid) {


    const _declareWinner = function (winner) {
        for (let i = 0; i < gameGrid.length; i++) {
            gameGrid[i].removeEventListener("click", gameBoard.playGame);
        }

        alert("player " + winner + " has won the game");

    }

    const playGame = function (e) {

        let winner = null;

        if (!markedCell[e.target.id]) {
            e.target.innerHTML = humanPlayer.getPlayerMark();
            e.target.moveMark = humanPlayer.getPlayerMark();

            markedCell[e.target.id] = true;
            turns--;



            setTimeout(function () {
                winner = game.checkForWins();
                if (winner != null) {
                    _declareWinner(winner.winnerMark);
                }

            }, 10);


            setTimeout(function () {
                if (game.checkForEnd() == true && winner == null) {
                    alert("game has tied");
                }

            },20)


            setTimeout(function () {
                if (winner == null) {
                    setTimeout(game.playComputerTurn, 40);

                    setTimeout(function () {
                        winner = game.checkForWins();
                        if (winner != null)
                            _declareWinner(winner.winnerMark);
                    }, 50);
                }
            },30);



        }
    }



    // const addMove = function (player, move) {
    //     player.addMove(move);
    //     playGame(player.getPlayerMark(), move.getCoordinates());
    // }

    return {
        // addMove,
        playGame,
    }



})(gameGrid);


for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].addEventListener("click", gameBoard.playGame);
}


