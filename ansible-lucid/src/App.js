import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Logs from './components/Logs';
import Inventory from './components/Inventory';
import Settings from './components/Settings';
import './App.css'; // Ensure you have some basic styles defined here

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="menu-icon" onClick={toggleMenu}>
            <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </div>
          <ul className={isOpen ? 'nav-links active' : 'nav-links'}>
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/logs" onClick={toggleMenu}>Logs</Link></li>
            <li><Link to="/inventory" onClick={toggleMenu}>Inventory</Link></li>
            <li><Link to="/settings" onClick={toggleMenu}>Settings</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
