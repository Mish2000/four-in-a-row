import React from 'react';
import purple from '../images/purple.svg';
import green from '../images/green.svg';
import '../game-css/Cell.css';
export const Cell = ({ch, y, x}) => {
    return (
        <div className='cell' data-x={x} data-y={y}>
            {ch && (
                <img src={ch === 'X' ? purple : green} alt="Token" width='100%' height='100%'/>
            )}
        </div>
    );
};