import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    Typography,
    Box
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Home() {
    const { user } = useAuth();
    const [playbooks, setPlaybooks] = useState([]);
    const [params, setParams] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/api/playbooks')
            .then(response => {
                setPlaybooks(response.data);
                const initialParams = response.data.reduce((acc, playbook) => {
                    acc[playbook] = { extraVars: '', limit: '' };
                    return acc;
                }, {});
                setParams(initialParams);
            })
            .catch(error => console.error('Error fetching playbooks:', error));
    }, []);

    const runPlaybook = (playbook) => {
        const { extraVars, limit } = params[playbook];
        let parsedExtraVars;
        try {
            parsedExtraVars = JSON.parse(extraVars);
        } catch (e) {
            parsedExtraVars = extraVars;
        }
        axios.post('http://localhost:3001/api/playbooks/run', { username: user.username, playbook, extraVars: parsedExtraVars, limit })
            .then(response => {
                setLogs(`Output for ${playbook}:\n\n${response.data.output}\nErrors: ${response.data.errors}`);
            })
            .catch(error => {
                const errorMessage = error.response ? error.response.data.message : error.message;
                setLogs(`Error running playbook ${playbook}: ${errorMessage}`);
            });
    };

    const handleParamChange = (playbook, key, value) => {
        setParams(prev => ({
            ...prev,
            [playbook]: {
                ...prev[playbook],
                [key]: value
            }
        }));
    };

    const filteredPlaybooks = playbooks.filter(playbook =>
        playbook.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4">Available Playbooks</Typography>
            <TextField
                label="Search playbooks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Playbook</TableCell>
                            <TableCell>Extra Variables</TableCell>
                            <TableCell>Limit Hosts</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPlaybooks.map(playbook => (
                            <TableRow key={playbook}>
                                <TableCell>{playbook}</TableCell>
                                <TableCell>
                                    <TextField
                                        value={params[playbook]?.extraVars || ''}
                                        onChange={e => handleParamChange(playbook, 'extraVars', e.target.value)}
                                        fullWidth
                                        margin="dense"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={params[playbook]?.limit || ''}
                                        onChange={e => handleParamChange(playbook, 'limit', e.target.value)}
                                        fullWidth
                                        margin="dense"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => runPlaybook(playbook)}>
                                        Run
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box>
                <TextField
                    label="Execution logs will appear here..."
                    value={logs}
                    readOnly
                    multiline
                    rows={10}
                    fullWidth
                    margin="normal"
                />
            </Box>
        </Box>
    );
}

export default Home;
