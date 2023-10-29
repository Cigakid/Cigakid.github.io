import React from 'react';
import './App.css';
import './BeachMap.css';
import BeachMap from './BeachMap';

function App() {
    return (
        <div className="App">
            <div className="header">
                <img src="/logo512.png" alt="Virginia Tech Logo" className="vt-logo" />
                <h1>Red Tide Respiratory Irritation Forecasting System</h1>
            </div>
            <BeachMap />
        </div>
    );
}

export default App;
