const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const childProcess = require('child_process');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const settingsPath = process.env.SETTINGS_PATH || 'settings.json';

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.json());

// Create DB if it doesn't already exist
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        db.run(`CREATE TABLE users(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            admin BOOLEAN NOT NULL DEFAULT 0
        )`, (err) => {
            if (err) {
                console.log("Table already exists.");
            } else {
                console.log("Table just created.");
                // Create a default admin user
                const hash = bcrypt.hashSync("admin", 10);
                db.run(`INSERT INTO users (username, password, admin) VALUES (?, ?, ?)`, ["admin", hash, 1]);
            }
        });
    }
});

// Middleware to check if the user is admin
function checkAdmin(req, res, next) {
    const username = req.body.username;
    db.get('SELECT admin FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            res.status(500).send('Error fetching user from database.');
        } else if (!user || user.admin === 0) {
            res.status(403).send('Forbidden');
        } else {
            next();
        }
    });
}

// Endpoint to list all users
app.get('/api/users', (req, res) => {
    db.all('SELECT id, username, admin FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving users');
        }
        res.json(rows);
    });
});

// Endpoint to add a new user
app.post('/api/add-user', checkAdmin, (req, res) => {
    const { newUsername, newPassword, newAdmin } = req.body;
    const hash = bcrypt.hashSync(newPassword, 10);
    db.run('INSERT INTO users (username, password, admin) VALUES (?, ?, ?)', [newUsername, hash, newAdmin ? 1 : 0], function (err) {
        if (err) {
            return res.status(500).send('Error adding user');
        }
        res.send('User added successfully');
    });
});

// Endpoint to remove a user
app.post('/api/remove-user', checkAdmin, (req, res) => {
    const { removeUsername } = req.body;
    db.run('DELETE FROM users WHERE username = ?', [removeUsername], function (err) {
        if (err) {
            return res.status(500).send('Error removing user');
        }
        res.send('User removed successfully');
    });
});

// Endpoint to login a user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            res.status(500).send("Error fetching user from database.");
        } else if (!user) {
            res.status(404).send("User not found.");
        } else if (bcrypt.compareSync(password, user.password)) {
            res.send({
                message: "Login successful!",
                user: {
                    username: user.username,
                    admin: user.admin
                }
            });
        } else {
            res.status(403).send("Incorrect password.");
        }
    });
});

// Generate default settings if settings.json does not exist
if (!fs.existsSync(settingsPath)) {
    const defaultSettings = {
        playbookDirectory: "/path/to/playbooks",
        logDirectory: "/path/to/logs",
        user: "default_user"
    };
    fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
}

// Read application settings from local file
fs.readFile(settingsPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error loading settings:', err);
        process.exit(1);
    } else {
        app.locals.settings = JSON.parse(data);
    }
});

// Endpoint to read playbooks
app.get('/api/playbooks', (req, res) => {
    const playbookDir = app.locals.settings.playbookDirectory;
    console.log("Directory being accessed: ", playbookDir);

    fs.readdir(playbookDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ message: 'Failed to list playbooks', error: err.message });
        }
        res.json(files.filter(file => file.endsWith('.yml')));
    });
});

// Endpoint to run a playbook
app.post('/api/playbooks/run', (req, res) => {
    const { username, playbook, extraVars, limit } = req.body;
    const playbookDir = app.locals.settings.playbookDirectory;
    const playbookPath = path.join(playbookDir, playbook);

    // Generate a timestamped log file name with the user's name
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const logFilename = `${username}_${playbook.replace(/\.yml$/, '')}_${timestamp}.log`;
    const logFilePath = path.join(app.locals.settings.logDirectory, logFilename);

    let cmd = `ansible-playbook "${playbookPath}"`;
    if (extraVars) {
        const extraVarsString = typeof extraVars === 'string' ? extraVars : JSON.stringify(extraVars);
        cmd += ` -e ${extraVarsString}`;
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
            return res.json({ message: 'Error executing playbook', output: stdout, errors: stderr });
        }
        res.json({ message: 'Playbook executed successfully', output: stdout, errors: stderr });
    });
});

// Endpoint to save application settings
app.post('/api/settings', (req, res) => {
    const { playbookDirectory, user, logDirectory } = req.body;
    const settings = { playbookDirectory, user, logDirectory };

    fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to save settings' });
        }
        app.locals.settings = settings;
        res.json({ message: 'Settings saved' });
    });
});

// Endpoint to read application settings
app.get('/api/settings', (req, res) => {
    fs.readFile(settingsPath, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read settings' });
        }
        app.locals.settings = JSON.parse(data);
        res.json(app.locals.settings);
    });
});

// Endpoint to read logs
app.get('/api/logs', (req, res) => {
    const logsDir = app.locals.settings.logDirectory;
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

// Endpoint to read specific log file
app.get('/logs/:logFile', (req, res) => {
    const logsDir = app.locals.settings.logDirectory;
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
