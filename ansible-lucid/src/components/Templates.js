import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField, Paper, Typography, Box, Select, MenuItem
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Templates() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', extraVars: '', limit: '', playbook: '' });
    const [playbooks, setPlaybooks] = useState([]);
    const [logs, setLogs] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchTemplates();
        fetchPlaybooks();
    }, []);

    const fetchTemplates = () => {
        axios.get('http://localhost:3001/api/templates')
            .then(response => setTemplates(response.data))
            .catch(error => console.error('Error fetching templates:', error));
    };

    const fetchPlaybooks = () => {
        axios.get('http://localhost:3001/api/playbooks')
            .then(response => setPlaybooks(response.data))
            .catch(error => console.error('Error fetching playbooks:', error));
    };

    const handleFormChange = (field, value) => {
        setForm(prevForm => ({ ...prevForm, [field]: value }));
    };

    const handleCreate = () => {
        axios.post('http://localhost:3001/api/templates', form)
            .then(() => {
                fetchTemplates();
                setForm({ name: '', description: '', extraVars: '', limit: '', playbook: '' });
            })
            .catch(error => {
                const errorMessage = error.response ? error.response.data.message : error.message;
                console.error('Error creating template:', errorMessage);
            });
    };

    const handleSelectTemplate = (name) => {
        axios.get(`http://localhost:3001/api/templates/${name}`)
            .then(response => setSelectedTemplate(response.data))
            .catch(error => console.error('Error fetching template:', error));
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:3001/api/templates/${selectedTemplate.name}`, form)
            .then(() => {
                fetchTemplates();
                setSelectedTemplate(null);
                setForm({ name: '', description: '', extraVars: '', limit: '', playbook: '' });
            })
            .catch(error => console.error('Error updating template:', error));
    };

    const handleDelete = (name) => {
        axios.delete(`http://localhost:3001/api/templates/${name}`)
            .then(() => fetchTemplates())
            .catch(error => console.error('Error deleting template:', error));
    };

    const handleRunTemplate = (name) => {
        axios.post(`http://localhost:3001/api/templates/run/${name}`, {username: user.username})
            .then(response => {
                setLogs(`Output for ${name}:\n\n${response.data.output}\nErrors: ${response.data.errors}`);
            })
            .catch(error => {
                const errorMessage = error.response ? error.response.data.message : error.message;
                setLogs(`Error running template ${name}: ${errorMessage}`);
            });
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4">Manage Templates</Typography>

            <Box component="form" sx={{ marginBottom: 2 }}>
                <TextField
                    label="Name"
                    value={form.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={form.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Extra Variables"
                    value={form.extraVars}
                    onChange={(e) => handleFormChange('extraVars', e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Limit Hosts"
                    value={form.limit}
                    onChange={(e) => handleFormChange('limit', e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Select
                    label="Playbook"
                    value={form.playbook}
                    onChange={(e) => handleFormChange('playbook', e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {playbooks.map(playbook => (
                        <MenuItem key={playbook} value={playbook}>
                            {playbook}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={selectedTemplate ? handleUpdate : handleCreate}
                >
                    {selectedTemplate ? 'Update Template' : 'Create Template'}
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {templates.map(template => (
                            <TableRow key={template}>
                                <TableCell>{template}</TableCell>
                                <TableCell>{template.description}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleSelectTemplate(template)}>Edit</Button>
                                    <Button onClick={() => handleDelete(template)}>Delete</Button>
                                    <Button onClick={() => handleRunTemplate(template)}>Run</Button>
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

export default Templates;
