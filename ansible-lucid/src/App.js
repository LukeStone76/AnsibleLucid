import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Logs from './components/Logs';
import Inventory from './components/Inventory';
import Settings from './components/Settings';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Ansible Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer}>
        <div>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </div>
        <List>
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
        </List>
      </Drawer>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
