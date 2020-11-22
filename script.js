const gameGridContainer = document.querySelector("#game-grid-container");
const resultModal = document.querySelector("#result-modal");
const resultText = document.querySelector("#result-text");
const playAgainButton = document.querySelector("#play-again");
const markedCell = [false, false, false, false, false, false, false, false, false];
let turns = 9;
let humanPlayerSFX = new Audio ("sounds/player1.wav");
let computerPlayerSFX = new Audio ("sounds/player2.wav");
let losingSFX = new Audio("sounds/losing.wav");
let tyingSFX = new Audio ("sounds/tie.wav");



/* IIFE that creates the 3x3 Game Grid and puts it in the "game-grid-container"*/
(function () {
    const div = document.createElement('div');

    /* The squares in the grid are gonna be grouped under the class "cells"*/
    div.classList.add("cells");

    /*Adding styling elements*/
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";

    /*Attaching the cells to the grid*/
    for (let i = 0; i < 9; i++) {
        if (i == 2 || i == 5 ){
            div.style.borderBottom = "thick solid white";
        }

        else if (i == 6 || i == 7 ){
            div.style.borderRight = "thick solid white";

        }

        else if (i == 0 || i == 1 || i == 3 || i == 4) {
            div.style.borderRight = "thick solid white"; 
            div.style.borderBottom = "thick solid white";
        

        }


        div.setAttribute("id", i);
        gameGridContainer.appendChild(div.cloneNode());
        div.style.borderBottom = "none";
        div.style.borderRight = "none";


    }

})();

/*The Nodelist that contains the grid cells*/
const gameGrid = document.querySelectorAll(".cells");




/*Player Object created using Factory Design Pattern*/
const Player = function (playerName, playerMark) {

    const getPlayerName = () => playerName;
    const getPlayerMark = () => playerMark;


    return {
        getPlayerName,
        getPlayerMark,
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

        gameGrid[computerBestMove].innerHTML = "<p>" + computerPlayer.getPlayerMark() + "</p>";
        computerPlayerSFX.play();
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
            markedCell[id] = false;

            //Saving the move to further evaluate the moves based on their weight 
            moves.push(move);

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
        return bestMove;
    }


    const restart = function(){

        turns = 9;

        resultModal.style.display = "none";

        for (let i=0; i<markedCell.length; i++)
          markedCell[i] = false;

        for(let i=0; i<gameGrid.length; i++){
            gameGrid[i].moveMark = undefined;
            gameGrid[i].innerHTML = "";
            gameGrid[i].addEventListener("click", gameBoard.playGame);
            gameGrid[i].addEventListener("click", () => {
                humanPlayerSFX.play();
            })
            gameGrid[i].style.color = "white";
            gameGrid[i].style.fontSize = "80px";

            
        }

        losingSFX.pause(); 
        losingSFX.currentTime = 0; 
        tyingSFX.pause(); 
        tyingSFX.currentTime = 0; 

    }

    return {
        checkForWins,
        playComputerTurn,
        checkForEnd,
        minimax,
        restart
    }




})(gameGrid)




//Gameboard Object created using Revealing Module Design Pattern
const gameBoard = (function (gameGrid) {


    const _declareWinner = function (winner) {          

        for (let i=0; i<winner.winningSequence.length; i++){
            gameGrid[winner.winningSequence[i]].style.color = "grey";

        }

        setTimeout(function(){
            resultModal.style.display = "block";
            if (winner.winnerMark === computerPlayer.getPlayerMark()){
                resultText.textContent = "You Lose!";

            }

            else if (winner.winnerMark == humanPlayer.getPlayerMark()){
                resultText.innerHTML = "You Win!";
            }
        }, 500);

        for (let i = 0; i < gameGrid.length; i++) {
            gameGrid[i].removeEventListener("click", gameBoard.playGame);
            gameGrid[i].removeEventListener("click", () => {
                humanPlayerSFX.play()});
        }

        losingSFX.play();

    }

    const playGame = function (e) {

        let winner = null;

        if (!markedCell[e.target.id]) {
            e.target.innerHTML ="<p>" + humanPlayer.getPlayerMark() + "</p>";
            e.target.moveMark = humanPlayer.getPlayerMark();

            markedCell[e.target.id] = true;
            turns--;



            setTimeout(function () {
                winner = game.checkForWins();
                if (winner != null) {
                    _declareWinner(winner);
                }

            }, 10);


            setTimeout(function () {
                if (game.checkForEnd() == true && winner == null) {
                    tyingSFX.play();
                    resultModal.style.display = "block";
                        resultText.innerHTML= "TIE";
        
        
                }

            },15)


            setTimeout(function () {
                if (winner == null) {
                    setTimeout(game.playComputerTurn, 100);

                    setTimeout(function () {
                        winner = game.checkForWins();
                        if (winner != null){
                            _declareWinner(winner);
                        }
                            
                    }, 400);
                }
            },20);



        }
    }


    return {
        playGame,
    }



})(gameGrid);


for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].addEventListener("click", gameBoard.playGame);
    gameGrid[i].addEventListener("click", () => {
        humanPlayerSFX.play();
    })

}


playAgainButton.addEventListener("click",game.restart);