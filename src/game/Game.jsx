import React, {useState} from 'react';
import {Board} from "./Board";

function Game({height,width, playAgainstPC}) {
    const [playerTurn, setPlayerTurn] = useState(1)
    const [isGameOver, setIsGameOver] = useState(false)

    return (
        <Board height={height} width={width} setGameOver={()=>setIsGameOver(true)}/>
    );
}

export default Game;