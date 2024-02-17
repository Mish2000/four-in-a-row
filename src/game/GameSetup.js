import React from 'react';
import '../game-css/GameSetup.css';

function GameSetup({ width, setWidth, height, setHeight, startGame, validationMessage }) {
    const handleWidthChange = (e) => {
        const newValue = Math.max(4, Math.min(7, parseInt(e.target.value, 10) || 0));
        setWidth(newValue);
    };

    const handleHeightChange = (e) => {
        const newValue = Math.max(4, Math.min(7, parseInt(e.target.value, 10) || 0));
        setHeight(newValue);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (width >= 4 && width <= 7 && height >= 4 && height <= 7) {
            startGame();
        }
    };

    return (
        <div className="setupContainer">
            <h1 className="gameTitle">Four In A Row</h1>
            <p className="instructions">Choose the width and height of the board. Please choose width and height in size between 4 to 7 cells.</p>
            <form onSubmit={handleSubmit} className="inputGroup">
                <div className="inputGroup">
                    <label className="inputLabel">Width:</label>
                    <input
                        className="setupInput"
                        type="number"
                        placeholder="Width"
                        value={width}
                        onChange={handleWidthChange}
                    />
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">Height:</label>
                    <input
                        className="setupInput"
                        type="number"
                        placeholder="Height"
                        value={height}
                        onChange={handleHeightChange}
                    />
                </div>
                {validationMessage && <p className="validationMessage">{validationMessage}</p>}
                <button type="submit" className="startButton">Start Game</button>
                <button type="button" className="startButton" onClick={() => startGame(true)}>Play against PC</button>
            </form>
        </div>
    );
}

export default GameSetup;


