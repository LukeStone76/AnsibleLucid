import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [playbooks, setPlaybooks] = useState([]);
    const [params, setParams] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/api/playbooks')
            .then(response => {
                setPlaybooks(response.data);
                // Initialize extraVars and limit for each playbook
                const initialParams = response.data.reduce((acc, playbook) => {
                    acc[playbook] = { extraVars: '', limit: '' };
                    return acc;
                }, {});
                setParams(initialParams);
            })
            .catch(error => console.error('Error fetching playbooks:', error));
    }, []);

    const runPlaybook = (playbook) => {
        const { extraVars, limit } = params[playbook];
        axios.post('http://localhost:3001/api/playbooks/run', { playbook, extraVars, limit })
            .then(response => {
                setLogs(`Output for ${playbook}: ${response.data.output}\nErrors: ${response.data.errors}`);
            })
            .catch(error => {
                const errorMessage = error.response ? error.response.data.message : error.message;
                setLogs(`Error running playbook ${playbook}: ${errorMessage}`);
            });
    };

    const handleParamChange = (playbook, key, value) => {
        setParams(prev => ({
            ...prev,
            [playbook]: {
                ...prev[playbook],
                [key]: value
            }
        }));
    };

    const filteredPlaybooks = playbooks.filter(playbook =>
        playbook.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Available Playbooks</h1>
            <input
                type="text"
                placeholder="Search playbooks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>Playbook</th>
                        <th>Extra Variables</th>
                        <th>Limit Hosts</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPlaybooks.map(playbook => (
                        <tr key={playbook}>
                            <td>{playbook}</td>
                            <td>
                                <input
                                    type="text"
                                    value={params[playbook]?.extraVars || ''}
                                    onChange={e => handleParamChange(playbook, 'extraVars', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={params[playbook]?.limit || ''}
                                    onChange={e => handleParamChange(playbook, 'limit', e.target.value)}
                                />
                            </td>
                            <td>
                                <button onClick={() => runPlaybook(playbook)}>Run</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="form-group">
                <textarea
                    className="logs"
                    value={logs}
                    readOnly
                    placeholder="Execution logs will appear here..."
                    rows="10"
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    );
}

export default Home;
