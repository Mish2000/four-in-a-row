import React, { useState } from 'react';
import { Board } from '../game/Board';
import GameSetup from '../game/GameSetup';
import './App.css';

function App() {
    const [width, setWidth] = useState(5);
    const [height, setHeight] = useState(5);
    const [gameStarted, setGameStarted] = useState(false);
    const [playAgainstPC, setPlayAgainstPC] = useState(false);


    const startGame = (againstPC = false) => {
        setPlayAgainstPC(againstPC); // Set if the game is against PC
        setGameStarted(true);
    };

    return (
        <div className="App">
            {gameStarted ? (
                <Board width={width} height={height} playAgainstPC={playAgainstPC} />
            ) : (
                <GameSetup
                    width={width}
                    setWidth={setWidth}
                    height={height}
                    setHeight={setHeight}
                    startGame={startGame} // Now passing the function directly
                />
            )}
        </div>
    );
}

export default App;



