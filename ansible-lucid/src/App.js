import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Logs from './components/Logs';
import Inventory from './components/Inventory';
import Settings from './components/Settings';
import Login from './components/Login';
import Admin from './components/Admin';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Button, Box } from '@mui/material';
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
          <Box display="flex" alignItems="center" style={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'normal' }}>
              Ansible Lucid
            </Typography>
            <img src={`${process.env.PUBLIC_URL}/AnsibleLucidLogo.png`} alt="Logo" style={{ height: 40, marginLeft: 10 }} />
          </Box>
          {user ? (
              <Button color="inherit" onClick={logout} sx={{ textTransform: 'none',
                fontSize: '1.125rem',
                fontWeight: 'normal',
                lineHeight: 'h6.lineHeight',
                fontFamily: 'h6.fontFamily',
                textTransform: 'none'
              }}>
                Logout ({user.username})
              </Button>
          ) : (
            <Button color="inherit" onClick={logout} sx={{ textTransform: 'none',
              fontSize: '1.125rem',
              fontWeight: 'normal',
              lineHeight: 'h6.lineHeight',
              fontFamily: 'h6.fontFamily',
              textTransform: 'none'
            }}>
              Login
            </Button>
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
