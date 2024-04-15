import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Logs() {
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/api/logs')
            .then(response => {
                setLogs(response.data);
            })
            .catch(error => console.error('Error fetching logs:', error));
    }, []);

    // Filter logs based on the search term
    const filteredLogs = logs.filter(log => 
        log.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Job Logs</h1>
            <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredLogs.map(log => (
                    <li key={log.name}>
                        <a href={`http://localhost:3001/logs/${log.name}`} target="_blank" rel="noopener noreferrer">
                            {log.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Logs;
