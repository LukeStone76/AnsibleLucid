import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Typography,
    Box
} from '@mui/material';

function Settings() {
    const [playbookDirectory, setPlaybookDirectory] = useState('');
    const [user, setUser] = useState('');
    const [logDirectory, setLogDirectory] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/api/settings')
            .then(response => {
                setPlaybookDirectory(response.data.playbookDirectory);
                setUser(response.data.user);
                setLogDirectory(response.data.logDirectory);
            })
            .catch(error => console.error('Error loading settings:', error));
    }, []);

    const saveSettings = () => {
        axios.post('http://localhost:3001/api/settings', { playbookDirectory, user, logDirectory })
            .then(() => alert('Settings saved successfully'))
            .catch(error => console.error('Error saving settings:', error));
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <TextField
                label="Playbook Directory"
                value={playbookDirectory}
                onChange={e => setPlaybookDirectory(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="User"
                value={user}
                onChange={e => setUser(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Log Directory"
                value={logDirectory}
                onChange={e => setLogDirectory(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={saveSettings}
                sx={{ marginTop: 2 }}
            >
                Save Settings
            </Button>
        </Box>
    );
}

export default Settings;
