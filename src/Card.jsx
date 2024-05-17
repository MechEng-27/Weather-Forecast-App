import React from 'react';
import './Card.css';

export default function Card(props){
    return (
        <div className = "card">
            <h2>{props.name}</h2>
            <p>{props.description}</p>
        </div>
    );
};