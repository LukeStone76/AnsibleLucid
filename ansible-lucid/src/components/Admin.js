import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button, TextField, Typography, Box, List, ListItem, ListItemText, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Admin() {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newAdmin, setNewAdmin] = useState(false);
    const [users, setUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        axios.get('http://localhost:3001/api/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const addUser = async () => {
        try {
            await axios.post('http://localhost:3001/api/add-user', { username: user.username, newUsername, newPassword, newAdmin });
            alert('User added successfully');
            setNewUsername('');
            setNewPassword('');
            setNewAdmin(false);
            const response = await axios.get('http://localhost:3001/api/users');
            setUsers(response.data);
        } catch (error) {
            alert(error.response.data);
        }
    };

    const removeUser = async (username) => {
        try {
            await axios.post('http://localhost:3001/api/remove-user', { username: user.username, removeUsername: username });
            alert('User removed successfully');
            setUsers(users.filter(u => u.username !== username));
        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" gutterBottom>Admin Panel</Typography>
            <TextField
                label="New Username"
                fullWidth
                margin="normal"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
            />
            <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
            />
            <FormControlLabel
                control={<Checkbox checked={newAdmin} onChange={(e) => setNewAdmin(e.target.checked)} />}
                label="Admin"
            />
            <Button variant="contained" color="primary" fullWidth onClick={addUser} sx={{ mt: 2 }}>
                Add User
            </Button>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Existing Users</Typography>
            <List>
                {users.map((u) => (
                    <ListItem key={u.username}>
                        <ListItemText 
                            primary={u.username} 
                            secondary={u.admin ? 'Admin' : ''}
                        />
                        <IconButton edge="end" aria-label="delete" onClick={() => removeUser(u.username)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default Admin;
