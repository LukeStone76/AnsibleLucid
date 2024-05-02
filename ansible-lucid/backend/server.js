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
app.use(express.static(path.join(__dirname, '../build')));

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

    // Generate a timestamped log file name
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const logFilename = `${playbook.replace(/\.yml$/, '')}_${timestamp}.log`;
    const logFilePath = path.join(app.locals.settings.logDirectory, logFilename);

    let cmd = `ansible-playbook "${playbookPath}"`;
    if (extraVars) {
        const extraVarsString = JSON.stringify(extraVars);
        cmd += ` -e '${extraVarsString}'`;
    }
    if (limit) {
        cmd += ` -l ${limit}`;
    }

    const process = childProcess.exec(cmd, { cwd: playbookDir }, (err, stdout, stderr) => {
        // Write the output and errors to a log file
        const logContent = `STDOUT:\n${stdout}\nSTDERR:\n${stderr}`;
        fs.writeFile(logFilePath, logContent, writeErr => {
            if (writeErr) {
                console.error('Failed to write log file:', writeErr);
            }
        });

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
    // Ensure all expected settings are present
    const { playbookDirectory, user, logDirectory } = req.body;
    const settings = { playbookDirectory, user, logDirectory }; // structure the settings

    fs.writeFile('settings.json', JSON.stringify(settings, null, 2), err => {
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






app.get('/api/logs', (req, res) => {
    const logsDir = app.locals.settings.logDirectory; // Use logDirectory from settings
    fs.readdir(logsDir, (err, files) => {
        if (err) {
            res.status(500).json({ message: 'Failed to list logs', error: err.message });
            return;
        }
        const logs = files.map(file => ({
            name: file,
            url: `/logs/${file}`
        }));
        res.json(logs);
    });
});

app.get('/logs/:logFile', (req, res) => {
    const logsDir = app.locals.settings.logDirectory; // Use logDirectory from settings
    const logFilePath = path.join(logsDir, req.params.logFile);
    res.sendFile(logFilePath);
});








// Endpoint to read the inventory file
app.get('/api/inventory', (req, res) => {
    const playbookDir = app.locals.settings.playbookDirectory;
    const inventoryFilePath = path.join(playbookDir, 'inventory');

    fs.readFile(inventoryFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read inventory file', error: err.message });
        }
        res.json({ inventory: data.split('\n') });
    });
});

// Endpoint to update the inventory file
app.post('/api/inventory', (req, res) => {
    const { lines } = req.body;
    const playbookDir = app.locals.settings.playbookDirectory;
    const inventoryFilePath = path.join(playbookDir, 'inventory');

    // Join the lines back together and write to the file
    fs.writeFile(inventoryFilePath, lines.join('\n'), 'utf8', err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to write inventory file', error: err.message });
        }
        res.json({ message: 'Inventory updated successfully' });
    });
});









// Serve the React application
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
