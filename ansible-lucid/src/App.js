import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Logs from './components/Logs';
import Inventory from './components/Inventory';
import Settings from './components/Settings';
import Login from './components/Login';
import Admin from './components/Admin';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from './context/AuthContext';

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Ansible Dashboard
          </Typography>
          {user ? (
            <div>
              <Typography variant="subtitle1" style={{ display: 'inline' }}>
                {user.username}
              </Typography>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer}>
        <IconButton onClick={toggleDrawer}>
          <CloseIcon />
        </IconButton>
        <List>
          {user && (
            <>
              <ListItem button component={Link} to="/" onClick={toggleDrawer}>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={Link} to="/logs" onClick={toggleDrawer}>
                <ListItemText primary="Logs" />
              </ListItem>
              <ListItem button component={Link} to="/inventory" onClick={toggleDrawer}>
                <ListItemText primary="Inventory" />
              </ListItem>
              <ListItem button component={Link} to="/settings" onClick={toggleDrawer}>
                <ListItemText primary="Settings" />
              </ListItem>
              {user.admin ? (
                <ListItem button component={Link} to="/admin" onClick={toggleDrawer}>
                  <ListItemText primary="Admin" />
                </ListItem>
              ) : null}
            </>
          )}
        </List>
      </Drawer>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={user.admin ? <Admin /> : <Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
