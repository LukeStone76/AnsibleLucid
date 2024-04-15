import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [playbooks, setPlaybooks] = useState([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState('');
  const [extraVars, setExtraVars] = useState('');
  const [limit, setLimit] = useState('');
  const [logs, setLogs] = useState('');


  useEffect(() => {
    axios.get('http://localhost:3001/api/playbooks')
      .then(response => {
        setPlaybooks(response.data);
        if (!selectedPlaybook && response.data.length > 0) {
          setSelectedPlaybook(response.data[0]); // Automatically select the first playbook
        }
      })
      .catch(error => console.error('Error fetching playbooks:', error));
  }, []);
  

  const runPlaybook = () => {
    axios.post('http://localhost:3001/api/playbooks/run', { playbook: selectedPlaybook, extraVars, limit })
        .then(response => {
            setLogs(`${response.data.output}\n${response.data.errors}`);
        })
        .catch(error => {
            const errorMessage = error.response ? error.response.data.message : error.message;
            setLogs(`Error running playbook: ${errorMessage}`);
        });
  };


  return (
    <div>
      <h1>Available Playbooks</h1>
      <select onChange={e => setSelectedPlaybook(e.target.value)} value={selectedPlaybook}>
      {playbooks.map(playbook => (
        <option key={playbook} value={playbook}>{playbook}</option>
        ))}
      </select>
      <div>
        <label>
          Extra Variables (JSON):
          <textarea value={extraVars} onChange={e => setExtraVars(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Limit Hosts:
          <input type="text" value={limit} onChange={e => setLimit(e.target.value)} />
        </label>
      </div>
      <button onClick={runPlaybook}>Run Playbook</button>
      <div className="form-group">
        <textarea className="logs" value={logs} readOnly placeholder="Execution logs will appear here..." rows="10"></textarea>
      </div>
    </div>
  );
}

export default Home;
