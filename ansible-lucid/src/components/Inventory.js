import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Inventory() {
    const [lines, setLines] = useState([]);
    const [newLine, setNewLine] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/api/inventory')
            .then(response => {
                setLines(response.data.inventory);
            })
            .catch(error => console.error('Error fetching inventory:', error));
    }, []);

    const addLine = () => {
        setLines([...lines, newLine]);
        setNewLine('');
    };

    const deleteLine = (index) => {
        const updatedLines = lines.filter((_, i) => i !== index);
        setLines(updatedLines);
    };

    const saveInventory = () => {
        axios.post('http://localhost:3001/api/inventory', { lines })
            .then(() => alert('Inventory updated successfully'))
            .catch(error => console.error('Error saving inventory:', error));
    };

    return (
        <div>
            <h1>Inventory</h1>
            <ul>
                {lines.map((line, index) => (
                    <li key={index}>
                        {line}
                        <button onClick={() => deleteLine(index)}>Delete</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newLine}
                onChange={(e) => setNewLine(e.target.value)}
                placeholder="Add a new line"
            />
            <button onClick={addLine}>Add Line</button>
            <button onClick={saveInventory}>Save Inventory</button>
        </div>
    );
}

export default Inventory;
