import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, TextField, Box, Typography } from '@mui/material';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            if (response.data.message === 'Login successful!') {
                login(response.data.user);
                navigate('/');
            } else {
                alert(response.data);
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data);
            } else {
                alert("Failed to connect to the server.");
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 300, mx: "auto", mt: 4 }}>
            <Typography variant="h6" gutterBottom>User Login</Typography>
            <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={handleLogin}
                sx={{ mt: 2 }}
            >
                Login
            </Button>
        </Box>
    );
}

export default Login;
