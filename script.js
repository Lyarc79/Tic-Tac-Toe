
// PSEUDOCODE HERE

// I need 3 OBJECTS
// - 1. Gameboard object (this will store the gameboard among other things).
// - 2. Players object (this can be a factory to create new players each game).
// - 3. Game controller object (needed to control the flow of the game).

// 1. Gameboard
// - Create a module to handle the game board logic and state
// - Factory function to initialize the game board
// - Function to manipulate the game board (e.g., place a token, check for a win)

// 2. Player
// - Create a module to handle player-related logic and state
// - Factory function to initialize a player
// - Functions to interact with the player (e.g., make a move)

// 3. Game
// - Create a module to manage the overall game flow
// - IIFE to encapsulate the game logic
// - Initialize the game board and players using the GameBoard and Players modules
// - Functions to handle turns, check for a win/tie, and update the game state

// 4. IIFE (Immediatly Invoked Function Expression):
// - Encapsulate the entire game logic withing an IIFE to minimize global code
// - Invoke the Game module to start the game

// 5. MAIN PROGRAM:
// - Import the necessary modules
// - Invoke the IIFE to start the game


const GameBoard = (function () {
    const gameBoard = [];
    const rows = 3;
    const columns = 3;
    const getRows = () => rows;
    const getColumns = () => columns;

    const createGameBoard = () => {
        for (let i = 0; i < rows; i++) {
            let newRow = [];
            for (let j = 0; j < columns; j++) {
                newRow.push("cell");
            }
            gameBoard.push(newRow);
        }
    }

    const resetGameBoard = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = "cell";
            }
        }
        console.log("gameBoard has been reseted");
    }

    const placeToken = (row, column, playerToken) => {
        gameBoard[row][column] = playerToken;
    }

    return {
        createGameBoard,
        resetGameBoard,
        getGameBoard: () => gameBoard,
        placeToken,
        getRows,
        getColumns,
    }
})()

const Players = (function () {
    const createPlayer = (playerName, playerToken) => {
        return {
            playerName: playerName,
            playerToken: playerToken,
            getPlayer() {
                return `${playerName}, ${playerToken}`;
            },
            makeMove: (inputRow, inputColumn) => {
                const currentPlayer = Game.getCurrentPlayer();
                console.log("Making a move with token:", currentPlayer.playerToken);
                if (!isNaN(inputRow) && !isNaN(inputColumn)) {
                    GameBoard.placeToken(inputRow - 1, inputColumn - 1, currentPlayer.playerToken);
                    console.log(inputRow, inputColumn, currentPlayer);
                    return true;
                } else {
                    console.log("Invalid input. Please enter a valid row and column number.");
                    return false;
                }
            },
        }
    }
    return {
        createPlayer,
    }
})()

const Game = (function () {
    const playerOne = Players.createPlayer("Player 1", "X");
    const playerTwo = Players.createPlayer("Player 2", "O");
    console.log("Player One token:", playerOne.playerToken, typeof playerOne.playerToken);
    console.log("Player Two token:", playerTwo.playerToken, typeof playerTwo.playerToken);

    // Additional log to check the type of 'playerOne.playerToken'
    console.log("Type of Player One token:", typeof playerOne.playerToken);

    // Additional log to check the type of 'playerTwo.playerToken'
    console.log("Type of Player Two token:", typeof playerTwo.playerToken);

    console.log(playerOne.getPlayer());
    console.log(playerTwo.getPlayer());

    let currentPlayer = playerOne;
    let playerOneWins = 0;
    let playerTwoWins = 0;
    const gameBoard = GameBoard.getGameBoard();

    const switchTurns = (currentPlayer) => (currentPlayer === playerOne ? playerTwo : playerOne);

    const getCurrentPlayer = () => { return currentPlayer; };
    const getPlayerOneWins = () => {return playerOneWins};
    const getPlayerTwoWins = () => {return playerTwoWins};

    const playRound = () => {
        console.log("Starting playRound. Current player:", currentPlayer);
        let validInput = false;
        while (!validInput) {
            const userInput = prompt("Enter your desired row an column (e.g., 1,2):");
            console.log("Initial user input is:", userInput);
            const [inputRow, inputColumn] = userInput.split(',').map(coord => parseInt(coord, 10));
            console.log("Formated user input is:", [inputRow, inputColumn]);
            validInput = currentPlayer.makeMove(inputRow, inputColumn, currentPlayer.playerToken);
            if (!validInput) { console.log("Invalid move. Please try again."); }
        }
        console.log("Move made. Current player:", currentPlayer);
        checkGameStatus();
        currentPlayer = switchTurns(currentPlayer);
        console.log("Switching turns. Next player:", currentPlayer);
    };
    const checkWinner = (playerToken) => {
        console.log("Entering checkWinner function...");

        playerToken = currentPlayer.playerToken;
        const rows = GameBoard.getRows();
        const columns = GameBoard.getColumns();
        console.log("Current player token in checkWinner:", playerToken);
        const checkLineForWin = (line) => {
            if (Array.isArray(line) && line.length > 0) {
                return line.every(cell => cell === playerToken);
            }
            return false;
        }

        const checkRowsForWin = (rows, playerToken) => {
            for (let i = 0; i < rows; i++) {

                if (checkLineForWin(gameBoard[i], playerToken)) {
                    console.log("this is true");
                    return true;
                }
            } return false;
        }
        const checkColumnsForWin = (columns, playerToken) => {
            for (let j = 0; j < columns; j++) {
                const column = gameBoard.map(row => row[j]);

                if (checkLineForWin(column, playerToken)) {
                    return true;
                }
            } return false;
        }
        const checkDiagonalsForWin = (rows, playerToken) => {
            const primaryDiagonal = [];
            for (let i = 0; i < rows; i++) {
                if (Array.isArray(gameBoard[i]) && gameBoard[i].length > i) {
                    primaryDiagonal.push(gameBoard[i][i]);
                } else { console.error(`Invalid array at gameBoard[${i}]`, gameBoard[i]); return false };
            }

            if (checkLineForWin(primaryDiagonal, playerToken)) {
                return true;
            }
            const secondaryDiagonal = [];
            for (let i = 0; i < rows; i++) {
                const columnIndex = columns - 1 - i;
                if (Array.isArray(gameBoard[i]) && gameBoard[i].length > columnIndex) {
                    secondaryDiagonal.push(gameBoard[i][columnIndex]);
                } else { console.error(`Invalid array at gameBoard[${i}]`, gameBoard[i]); return false };
            }

            if (checkLineForWin(secondaryDiagonal, playerToken)) {
                return true;
            }
            return false;
        }
        const isWin = checkRowsForWin(rows, playerToken) || checkColumnsForWin(columns, playerToken) || checkDiagonalsForWin(rows, playerToken);
        console.log("Is there a win", isWin);
        return isWin;
    }
    const checkGameStatus = () => {
        console.log("Cheking game status...")
        const playerToken = currentPlayer.playerToken;
        console.log("Current player token in checkGameStatus:", playerToken);
        const isWinForCurrentPlayer = checkWinner(GameBoard.getRows(), GameBoard.getColumns(), playerToken);
        console.log("Is there a win for the current player?", isWinForCurrentPlayer);
        if (isWinForCurrentPlayer) {
            console.log("Checking for a win...");
            console.log(`${currentPlayer.playerName} wins the round with token:`, currentPlayer.playerToken);
            if (currentPlayer === playerOne) {
                playerOneWins++;
                console.log("Player1 Score:", playerOneWins);
                GameBoard.resetGameBoard();
            } else {
                playerTwoWins++;
                console.log("Player2 Score:", playerTwoWins);
                GameBoard.resetGameBoard();
            }
            
            return true;
        }

        if (isGameTied()) {
            GameBoard.resetGameBoard();
            return false;
        }
        console.log("No win or tie detected.")
        return true;
    }
    const endGameActions = () => {
        console.log("Game Over. Thank you for playing!");
        console.log("Do you wanna play again?");
        // if yes,  GameBoard.resetGameBoard();
    }
    const isGameTied = () => {
        const board = GameBoard.getGameBoard();
        let isTied = true;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === "cell" || !checkWinner(board[i][j])) {
                    isTied = false;
                    break;
                }
            }
            if (!isTied) {
                break;
            }

        }
        if (isTied) {
            console.log("It's a tie.");
            GameBoard.resetGameBoard();
        }
    };
    const initializeGame = () => {
        GameBoard.createGameBoard();
        // Maybe player creation too
    }
    
    const gamePlay = () => {
        initializeGame();
    
        while (Game.getPlayerOneWins() < 3 && Game.getPlayerTwoWins() < 3) {
            playRound();
            console.log(GameBoard.getGameBoard());
        }
    
        // Game has ended
        if (Game.getPlayerOneWins() === 3) {
            console.log("Player 1 is the overall winner!");
            Game.endGameActions();
        } else {
            console.log("Player 2 is the overall winner!");
            Game.endGameActions();
        }
    };
    return {
        playRound,
        switchTurns,
        getCurrentPlayer,
        checkGameStatus,
        initializeGame,
        checkWinner,
        getPlayerOneWins,
        getPlayerTwoWins,
        gamePlay,
    }
})()

Game.gamePlay();