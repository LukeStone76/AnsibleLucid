const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const childProcess = require('child_process');
const fs = require('fs');
const cors = require('cors'); // Require CORS middleware
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Use CORS middleware to allow all origins
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

const settingsPath = process.env.SETTINGS_PATH || 'settings.json';

fs.readFile(settingsPath, 'utf8', (err, data) => {
  if (err) {
      console.error('Error loading settings:', err);
      process.exit(1);
  } else {
      app.locals.settings = JSON.parse(data);
  }
});

app.get('/api/playbooks', (req, res) => {
  const playbookDir = app.locals.settings.playbookDirectory;
  console.log("Directory being accessed: ", playbookDir); // This will log the directory path to check it

  fs.readdir(playbookDir, (err, files) => {
      if (err) {
          console.error('Error reading directory:', err); // More detailed logging here
          return res.status(500).json({ message: 'Failed to list playbooks', error: err.message });
      }
      res.json(files.filter(file => file.endsWith('.yml')));
  });
});

// Endpoint to run a playbook
app.post('/api/playbooks/run', (req, res) => {
    const { playbook, extraVars, limit } = req.body;
    const playbookDir = app.locals.settings.playbookDirectory;
    const playbookPath = path.join(playbookDir, playbook);

    // Create the command string
    let cmd = `ansible-playbook "${playbookPath}"`;
    if (extraVars) {
        const extraVarsString = JSON.stringify(extraVars);
        cmd += ` -e '${extraVarsString}'`;
    }
    if (limit) {
        cmd += ` -l ${limit}`;
    }

    // Execute the playbook
    const process = childProcess.exec(cmd, { cwd: playbookDir }, (err, stdout, stderr) => {
        if (err) {
            console.error('Execution Error:', stderr);
            return res.status(500).json({ message: 'Error executing playbook', error: stderr });
        }
        // Return both stdout and stderr as part of the success response
        res.json({ message: 'Playbook executed successfully', output: stdout, errors: stderr });
    });
});

// Settings: Save and Retrieve
app.post('/api/settings', (req, res) => {
    req.app.locals.settings = req.body;
    fs.writeFile('settings.json', JSON.stringify(req.body), err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to save settings' });
        }
        res.json({ message: 'Settings saved' });
    });
});

app.get('/api/settings', (req, res) => {
    fs.readFile('settings.json', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read settings' });
        }
        req.app.locals.settings = JSON.parse(data);
        res.json(req.app.locals.settings);
    });
});

// Serve the React application
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
