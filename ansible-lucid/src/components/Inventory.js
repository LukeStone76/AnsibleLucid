import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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
        if (newLine.trim() !== '') {
            setLines([...lines, newLine]);
            setNewLine('');
        }
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
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>Inventory</Typography>
            <List>
                {lines.map((line, index) => (
                    <ListItem key={index} secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteLine(index)}>
                            <DeleteIcon />
                        </IconButton>
                    }>
                        <ListItemText primary={line} />
                    </ListItem>
                ))}
            </List>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    label="Add a new line"
                    value={newLine}
                    onChange={(e) => setNewLine(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={addLine}>
                    Add Line
                </Button>
            </Box>
            <Button
                variant="contained"
                color="success"
                onClick={saveInventory}
                sx={{ marginTop: 2 }}
            >
                Save Inventory
            </Button>
        </Box>
    );
}

export default Inventory;
