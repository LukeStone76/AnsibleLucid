import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box
} from '@mui/material';

function Logs() {
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/api/logs')
            .then(response => {
                setLogs(response.data);
            })
            .catch(error => console.error('Error fetching logs:', error));
    }, []);

    // Filter logs based on the search term
    const filteredLogs = logs.filter(log =>
        log.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>Job Logs</Typography>
            <TextField
                label="Search logs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
            />
            <List>
                {filteredLogs.map(log => (
                    <ListItem
                        key={log.name}
                        component="a"
                        href={`http://localhost:3001/logs/${log.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ListItemText primary={log.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default Logs;
