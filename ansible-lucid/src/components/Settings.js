import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Settings() {
  const [playbookDirectory, setPlaybookDirectory] = useState('');
  const [user, setUser] = useState('');
  const [logDirectory, setLogDirectory] = useState(''); // Add state for log directory

  useEffect(() => {
    axios.get('http://localhost:3001/api/settings')
      .then(response => {
        setPlaybookDirectory(response.data.playbookDirectory);
        setUser(response.data.user);
        setLogDirectory(response.data.logDirectory); // Set log directory from fetched settings
      })
      .catch(error => console.error('Error loading settings:', error));
  }, []);

  const saveSettings = () => {
    axios.post('http://localhost:3001/api/settings', { playbookDirectory, user, logDirectory })
      .then(() => alert('Settings saved successfully'))
      .catch(error => console.error('Error saving settings:', error));
  };

  return (
    <div>
      <h1>Settings</h1>
      <div>
        <label>
          Playbook Directory:
          <input type="text" value={playbookDirectory} onChange={e => setPlaybookDirectory(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          User:
          <input type="text" value={user} onChange={e => setUser(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Log Directory:
          <input type="text" value={logDirectory} onChange={e => setLogDirectory(e.target.value)} />
        </label>
      </div>
      <button onClick={saveSettings}>Save Settings</button>
    </div>
  );
}

export default Settings;
