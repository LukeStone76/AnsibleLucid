import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Inventory() {
  const [inventory, setInventory] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/inventory')
      .then(response => setInventory(response.data))
      .catch(error => console.error('Failed to fetch inventory:', error));
  }, []);

  const updateInventory = () => {
    axios.post('http://localhost:3001/api/inventory', { inventory })
      .then(() => alert('Inventory updated successfully'))
      .catch(error => console.error('Failed to update inventory:', error));
  };

  return (
    <div>
      <h1>Edit Inventory</h1>
      <textarea value={inventory} onChange={e => setInventory(e.target.value)} />
      <button onClick={updateInventory}>Save Inventory</button>
    </div>
  );
}

export default Inventory;
