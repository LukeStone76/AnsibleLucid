import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/logs')
      .then(response => setLogs(response.data))
      .catch(error => console.error('Error fetching logs:', error));
  }, []);

  return (
    <div>
      <h1>Execution Logs</h1>
      {logs.map((log, index) => (
        <div key={index}>
          <h3>{log.date}</h3>
          <pre>{log.content}</pre>
        </div>
      ))}
    </div>
  );
}

export default Logs;
