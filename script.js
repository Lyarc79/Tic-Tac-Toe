
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
                newRow.push("");
            }
            gameBoard.push(newRow);
        }
    }

    const resetGameBoard = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = "";
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
            setName: (name) => {
                this.playerName = name;
            },
            makeMove: (inputRow, inputColumn) => {
                const currentPlayer = Game.getCurrentPlayer();
                if (!isNaN(inputRow) && !isNaN(inputColumn)) {
                    GameBoard.placeToken(inputRow, inputColumn, currentPlayer.playerToken);
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

const playerOne = Players.createPlayer("Player 1", "X");
const playerTwo = Players.createPlayer("Player 2", "O");

const Game = (function () {
    let currentPlayer = playerOne;
    let playerOneWins = 0;
    let playerTwoWins = 0;
    const gameBoard = GameBoard.getGameBoard();
    const switchTurns = (currentPlayer) => (currentPlayer === playerOne ? playerTwo : playerOne);
    const getCurrentPlayer = () => { return currentPlayer; };
    const getPlayerOneWins = () => { return playerOneWins };
    const getPlayerTwoWins = () => { return playerTwoWins };

    const playRound = (row, col) => {
        if (!isNaN(row) && !isNaN(col)) {
            const validInput = currentPlayer.makeMove(row, col);
            if (!validInput) {
                console.log("Invalid move, please try again.");
                return false;
            }
            checkGameStatus();
            currentPlayer = switchTurns(currentPlayer);
            GameDisplay.playerTurn();
            return true;
        }
        return false;
    };
    const checkWinner = (playerToken) => {
        playerToken = currentPlayer.playerToken;
        const rows = GameBoard.getRows();
        const columns = GameBoard.getColumns();
        const checkLineForWin = (line) => {
            if (Array.isArray(line) && line.length > 0) {
                return line.every(cell => cell === playerToken);
            }
            return false;
        };
        const checkRowsForWin = (rows, playerToken) => {
            for (let i = 0; i < rows; i++) {
                if (checkLineForWin(gameBoard[i], playerToken)) {
                    return true;
                }
            } return false;
        };
        const checkColumnsForWin = (columns, playerToken) => {
            for (let j = 0; j < columns; j++) {
                const column = gameBoard.map(row => row[j]);
                if (checkLineForWin(column, playerToken)) {
                    return true;
                }
            } return false;
        };
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
        };
        const isWin = checkRowsForWin(rows, playerToken) || checkColumnsForWin(columns, playerToken) || checkDiagonalsForWin(rows, playerToken);
        return isWin;
    }
    const checkGameStatus = () => {
        const playerToken = currentPlayer.playerToken;
        const isWinForCurrentPlayer = checkWinner(GameBoard.getRows(), GameBoard.getColumns(), playerToken);
        if (isWinForCurrentPlayer) {
            GameDisplay.winnerDisplay('round');            
            if (currentPlayer === playerOne) {
                playerOneWins++;
                GameBoard.resetGameBoard();
                GameDisplay.scoreDisplay();
            } else {
                playerTwoWins++;
                GameBoard.resetGameBoard();
                GameDisplay.scoreDisplay();
            }
            return true;
        }
        if (isGameTied()) {
            GameBoard.resetGameBoard();
            return false;
        }
        return true;
    }
    const endGameActions = () => {
        GameDisplay.endGame();
    }
    const isGameTied = () => {
        const board = GameBoard.getGameBoard();
        let isTied = true;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === "" || checkWinner(board[i][j])) {
                    isTied = false;
                    break;
                }
            }
            if (!isTied) {
                break;
            }
        }
        if (isTied) {
            GameDisplay.winnerDisplay('tie');
            GameBoard.resetGameBoard();
        }

        return isTied;
    };

    const initializeGame = () => {
        GameBoard.createGameBoard();
    }

    const gamePlay = () => {
        initializeGame();
        GameDisplay.loadDOMElements();
    };

    const resetGame = () => {
        GameBoard.resetGameBoard();
        playerOneWins = 0;
        playerTwoWins = 0;
        GameDisplay.renderGameBoard(gameBoard);
    };
    return {
        playRound,
        switchTurns,
        getCurrentPlayer,
        checkGameStatus,
        initializeGame,
        checkWinner,
        endGameActions,
        resetGame,
        getPlayerOneWins,
        getPlayerTwoWins,
        gamePlay,
    }
})()

const GameDisplay = {
    renderGameBoard: (gameBoard) => {
        const gameBoardElement = document.getElementById('game-board');
        gameBoardElement.innerHTML = '';
        for (let row = 0; row < gameBoard.length; row++) {
            for (let col = 0; col < gameBoard[row].length; col++) {
                const cellElement = document.createElement('div');
                cellElement.classList.add('gameCell');
                cellElement.textContent = gameBoard[row][col];
                cellElement.dataset.row = row;
                cellElement.dataset.col = col;
                gameBoardElement.appendChild(cellElement);
            }
        }
    },
    cellSelect: () => {
        const gameBoardElement = document.getElementById('game-board');
        const currentPlayer = Game.getCurrentPlayer();
        gameBoardElement.addEventListener('click', (event) => {
            const clickedCell = event.target;
            if (clickedCell.classList.contains('gameCell') && !clickedCell.textContent.trim()) {
                clickedCell.textContent = currentPlayer.playerToken;
                GameDisplay.handleCellClick(clickedCell);
            }
        })
    },
    handleCellClick: (clickedCell) => {
        const row = parseInt(clickedCell.dataset.row);
        const col = parseInt(clickedCell.dataset.col);
        const roundPlayed = Game.playRound(row, col);
        if (roundPlayed) {
            GameDisplay.renderGameBoard(GameBoard.getGameBoard());
            const playerOneWins = Game.getPlayerOneWins();
            const playerTwoWins = Game.getPlayerTwoWins();
            if (playerOneWins === 3 || playerTwoWins === 3) {
                if (playerOneWins === 3) {
                    GameDisplay.winnerDisplay('overall');
                } else {
                    GameDisplay.winnerDisplay('overall');
                }
                Game.endGameActions();
            }
        }
    },
    playerNames: () => {
        const player1Input = document.getElementById('player-one');
        const player1Btn = document.getElementById('player1Btn');
        const player2Input = document.getElementById('player-two');
        const player2Btn = document.getElementById('player2Btn');
        let player1NameSet = false;
        let player2NameSet = false;

        player1Btn.addEventListener('click', () => {
            const playerName = player1Input.value.trim();
            const player1Name = document.getElementById('player1Name');
            if (playerName !== '') {
                playerOne.playerName = playerName;
                player1Name.textContent = playerName;
                player1Input.value = '';
                player1NameSet = true;
            } else {
                console.log('Please enter a valid name for Player 1.');
            }
        });
        player2Btn.addEventListener('click', () => {
            const playerName = player2Input.value.trim();
            const player2Name = document.getElementById('player2Name');
            if (playerName !== '') { 
                playerTwo.playerName = playerName;
                player2Name.textContent = playerName;
                player2Input.value = '';
                player2NameSet = true;
            } else {
                console.log('Please enter a valid name for Player 2.');
            }
        });
        return player1NameSet && player2NameSet;
    },
    playerTurn: () => {
        const currentPlayer = Game.getCurrentPlayer();
        if (currentPlayer) {
            const controlBtns = document.getElementById('controlBtns');
            let turnDisplay = document.querySelector('.turnDisplay');
            if(!turnDisplay){
                turnDisplay = document.createElement('h2');
                turnDisplay.classList.add('turnDisplay');
                controlBtns.appendChild(turnDisplay);
            }
            turnDisplay.textContent = `${currentPlayer.playerName}'s turn`;

        } else {
            console.log("Unable to set player names or current player not found.");
        }
    },
    winnerDisplay: (winnerType) => {
        const winnerDisplay = document.getElementById('winnerDisplay');
        const winnerText = document.createElement('h2');
        winnerText.classList.add('winnerText');
        winnerDisplay.textContent = '';
        if(winnerType === 'round'){
            const currentPlayer = Game.getCurrentPlayer();
            winnerText.textContent = `${currentPlayer.playerName} wins the round`;
        } else if (winnerType === 'overall') {
            const playerOneWins = Game.getPlayerOneWins();
            const playerTwoWins = Game.getPlayerTwoWins();
            if (playerOneWins === 3) {
                winnerText.textContent = `${playerOne.playerName} is the overall winner!`;
            } else if (playerTwoWins === 3) {
                winnerText.textContent = `${playerTwo.playerName} is the overall winner!`;
            }
        } else if (winnerType === 'tie'){
            winnerText.textContent = `It's a tie!`;
        }
        winnerDisplay.appendChild(winnerText);
    },
    winnerDisplayReset: () => {
        const winnerDisplay = document.getElementById('winnerDisplay');
        const winnerText = document.createElement('h2');
        winnerText.classList.add('winnerText');
        winnerDisplay.textContent = '';
    },
    scoreDisplay: () => {
        const playerOneWins = Game.getPlayerOneWins();
        const playerTwoWins = Game.getPlayerTwoWins();
        const player1Score = document.getElementById('player1Score');
        const player2Score = document.getElementById('player2Score');
        player1Score.textContent = `: ${playerOneWins}`;
        player2Score.textContent = `: ${playerTwoWins}`;
    },
    tokenDisplay: () => {
        const player1Token = document.getElementById('player1Token');
        const player2Token = document.getElementById('player2Token');
        player1Token.textContent = 'X';
        player1Token.classList.add('token');
        player2Token.textContent = 'O';
        player2Token.classList.add('token');

    },
    resetScore: () => {
        const playerOneWins = Game.getPlayerOneWins();
        const playerTwoWins = Game.getPlayerTwoWins();
        const player1Score = document.getElementById('player1Score');
        const player2Score = document.getElementById('player2Score');
        player1Score.textContent = ` `;
        player2Score.textContent = ` `;
    } ,
    resetBtn: () => {
        const resetBtn = document.getElementById('restartBtn');
        resetBtn.addEventListener('click', () => {
            Game.resetGame();
            GameDisplay.resetScore();
            GameDisplay.winnerDisplayReset();
        })
    },
    playAgainBtn: () => {
        const playAgainBtn = document.getElementById('playAgainBtn');
        playAgainBtn.addEventListener('click', () => {
            Game.resetGame();
            GameDisplay.resetScore();
            GameDisplay.winnerDisplayReset();
            GameDisplay.cellSelect();
        })
    },
    endGame: () => {
        const gameBoardElement = document.getElementById('game-board');
        const clonedGameBoard = gameBoardElement.cloneNode(true);
        gameBoardElement.parentNode.replaceChild(clonedGameBoard, gameBoardElement);
    },
    loadDOMElements: () => {
        const gameBoardArray = GameBoard.getGameBoard();
        GameDisplay.resetBtn();
        GameDisplay.playAgainBtn();
        GameDisplay.playerNames();
        GameDisplay.tokenDisplay();
        GameDisplay.renderGameBoard(gameBoardArray);
        GameDisplay.cellSelect(); 
    }
}

Game.gamePlay();
