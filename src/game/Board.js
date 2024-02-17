import React, {useCallback, useEffect, useState} from "react";
import {Cell} from "./Cell";
import '../game-css/Board.css';

const PLAYERS = {
    1: 'X',
    2: 'O'
}

export const Board = ({width, height, playAgainstPC}) => {
    const [board, setBoard] = useState([]);
    const [currPlayer, setCurrPlayer] = useState('X');
    const [oppPlayer] = useState('O');
    const [gameOver, setGameOver] = useState(false);
    const [isPCTurn, setIsPCTurn] = useState(false);
    const [lastPlayer, setLastPlayer] = useState(null);
    const [displayText, setDisplayText] = useState('Purple Move');
    const [isBoardInitialized, setIsBoardInitialized] = useState(false);

    const findLowestEmptyIndex = useCallback((board, column) => {
        for (let i = board.length - 1; i >= 0; i--) {
            if (board[i][column] === '') {
                return i;
            }
        }
        return -1;
    }, []);


    // Create the board by your preference.
    useEffect(() => {
        const initBoard = Array.from({length: height}, () =>
            Array.from({length: width}, () => '')
        );
        setBoard(initBoard);
        setIsBoardInitialized(true); // Set the board as initialized
        console.log("Board initialized.");
    }, [width, height]);

    //An algorithm that counts the number of same cells in a row to return a winner in case of 4 in a row.
    const checkWin = useCallback((row, column, ch) => {
        const checkLine = (deltaRow, deltaCol) => {
            let count = 1;

            for (let i = 1; i < 4; i++) {
                if (board[row + i * deltaRow]?.[column + i * deltaCol] === ch) {
                    count++;
                } else {
                    break;
                }
            }

            for (let i = 1; i < 4; i++) {
                if (board[row - i * deltaRow]?.[column - i * deltaCol] === ch) {
                    count++;
                } else {
                    break;
                }
            }
            return count >= 4;
        };

        const result = checkLine(1, 0) || checkLine(0, 1) || checkLine(1, 1) || checkLine(1, -1);
        console.log(`Win Check for player ${ch} resulted in: ${result}`);
        return result
    }, [board]);

    const checkTie = useCallback(() => {
        console.log("Initiating tie check...");
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === '') {
                    console.log(`Empty cell found at [${i}, ${j}], no tie.`);
                    return false; // Found an empty cell, so no tie
                }
            }
        }
        console.log("No empty cells found, it's a tie.");
        return true; // No empty cells found, it's a tie
    }, [board]);


    useEffect(() => {
        console.log(`Game Over State Changed: ${gameOver}, Current Player: ${currPlayer}`);
        if (!gameOver) {
            // Update the display text only if the game is still in progress.
            const nextMoveText = currPlayer === 'X' ? 'Purple Move' : 'Green Move';
            setDisplayText(nextMoveText);
            console.log(`Display Text Set For Current Player Move: ${nextMoveText}`);
        }

    }, [currPlayer, gameOver]);



    const updateBoard = useCallback((row, column, ch) => {
        console.log(`Making move at [${row}, ${column}] by player ${ch}`);
        setBoard(prev => {
            const boardCopy = [...prev];
            boardCopy[row][column] = ch;
            return boardCopy;
        });
        const win = checkWin(row, column, ch);
        console.log(`Win detected for player ${ch}: ${win}`);
        if (win) {
            console.log(`Win detected for player ${ch}: true`);
            setLastPlayer(ch); // Ensure this is set before updating the gameOver state and displayText
            setGameOver(true);
            const winMessage = ch === 'X' ? 'Game Over! Purple Wins!' : 'Game Over! Green Wins!';
            setDisplayText(winMessage);
            console.log(`Game over set. Winner: ${ch === 'X' ? 'Purple' : 'Green'}`);
        }
    }, [checkWin]); // Make sure to include all necessary dependencies.


    const swapPlayers = useCallback(() => {
        setCurrPlayer(curr => (curr === 'X' ? 'O' : 'X'));
    }, []);

    const makeRandomMove = useCallback(() => {
        console.log(`PC's turn to make a move as player: ${oppPlayer}`);
        let column, row;
        do {
            column = Math.floor(Math.random() * width);
            row = findLowestEmptyIndex(board, column);
        } while (row === -1);

        if (!gameOver) {
            updateBoard(row, column, oppPlayer);
            // The updateBoard function will handle setting the game over state and updating the display text
            // No need to explicitly set the display text here for a win or not a win
        }
    }, [gameOver, width, findLowestEmptyIndex, board, updateBoard, oppPlayer]);


    useEffect(() => {
        console.log(`Initial game state: gameOver = ${gameOver}, board =`, board);
        if (!gameOver) {
            if (isPCTurn && playAgainstPC) {
                setDisplayText('Green Move');
            } else {
                setDisplayText('Purple Move');
            }
        }
    }, [isPCTurn, playAgainstPC, gameOver, board]);

    useEffect(() => {
        console.log(`Checking if it's PC's turn: ${isPCTurn}, playAgainstPC: ${playAgainstPC}, gameOver: ${gameOver}`);
        if (isPCTurn && playAgainstPC && !gameOver) {
            const timer = setTimeout(() => {
                makeRandomMove();
                setIsPCTurn(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isPCTurn, playAgainstPC, gameOver, makeRandomMove]);

    const handleClick = (e) => {
        console.log(`Handle click initiated for player: ${currPlayer}`);
        // Prevents the user from spamming the mouse button before the PC makes a move.
        if (isPCTurn) {
            console.log('PC\'s turn, player cannot make a move.');
            return;
        }

        if (!e.target.dataset.x || isNaN(e.target.dataset.x)) {
            console.log('Invalid click: No data-x attribute or not a number.');
            return;
        }

        const column = parseInt(e.target.dataset.x, 10);
        if (column < 0 || column >= board[0].length) {
            console.log('Invalid click: Column out of bounds.');
            return;
        }

        let row = findLowestEmptyIndex(board, column);
        if (row === -1) {
            console.log('Column is full.');
            return;
        }

        if (!gameOver && board[row][column] === '') {
            console.log(`Attempting to update board at [${row}, ${column}] for player: ${currPlayer}`);
            const win = updateBoard(row, column, currPlayer);
            console.log(`Win check result: ${win} for player ${currPlayer} at [${row}, ${column}].`);

            if (win) {
                // Set the gameOver and displayText state here, then immediately return.
                setGameOver(true);
                const winMessage = currPlayer === 'X' ? 'Game Over! Purple Wins!' : 'Game Over! Green Wins!';
                setDisplayText(winMessage);
                return; // Stop further execution to ensure displayText is not overwritten.
            }

            if (gameOver) {
                // If the game is over, clicks should not trigger state changes.
                console.log('Game is over, no further moves allowed.');
                return;
            }


            // If the game is not over, continue with the next player's turn or the PC's turn
            if (!playAgainstPC) {
                swapPlayers();
                setDisplayText(currPlayer === 'X' ? 'Green Move' : 'Purple Move');
                console.log(`Next player's turn: ${currPlayer === 'X' ? 'O' : 'X'}`);
            } else {
                setIsPCTurn(true);
                setDisplayText('Green Move');
                console.log('PC\'s turn next.');
            }
        }
    };

    // Check for a tie only if the board has been initialized, and it's not the first render
    useEffect(() => {
        console.log(`Checking for tie with board initialized: ${isBoardInitialized}, gameOver: ${gameOver}`);
        if (isBoardInitialized && !gameOver) {
            const isTie = checkTie();
            console.log(`Tie check result: ${isTie}`);
            if (isTie) {
                setGameOver(true);
                setDisplayText("Game Over! It's a Tie!");
                console.log("Game Over due to tie.");
            }
        }
    }, [board, checkTie, gameOver, isBoardInitialized]);

    // Existing useEffect for handling game over and win condition updates
    useEffect(() => {
        if (gameOver) {
            // Check if it's a tie
            if (checkTie() && !lastPlayer) {
                setDisplayText("Game Over! It's a Tie!");
                console.log("Game Over: It's a Tie.");
            } else if (lastPlayer) {
                const finalMessage = lastPlayer === 'X' ? 'Game Over! Purple Wins!' : 'Game Over! Green Wins!';
                setDisplayText(finalMessage);
            }
        }
    }, [gameOver, lastPlayer, checkTie]);


    return (
        <>
            <h1 className="displayMessage">{displayText}</h1>

            <div id='board'
                 style={{
                     width: `${width * 120}px`,
                     height: `${height * 120}px`,
                     display: 'flex',
                     flexWrap: 'wrap',
                     alignContent: 'flex-start',
                     gap: '20px'
                 }}
                 onClick={gameOver ? null : handleClick}>
                {board.map((row, i) => {
                    return row.map((ch, j) => <Cell key={`${i}-${j}`} ch={ch} y={i} x={j}/>);
                })}
            </div>
        </>
    );


};