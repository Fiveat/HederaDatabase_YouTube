import logo from './logo.svg';
import './App.css';
import React, {useReducer, useState }from 'react';
import { addUserToContract } from './AddNota';


function App() {

  const [userId, setUserId ] = useState('');
  const [userName, setUserName ] = useState('');
  const [userNote, setUserNote ] = useState('');

  const handleSubmit = async (e) => { e.preventDefault();
  try {
    const status = await addUserToContract(userId, userName, userNote);
    alert(`Transaction status: ${status}`);
  } catch (error){
    alert(`Error: ${error.message}`);
  }
}

  return (
    <div className="App">
      <header className="App-header">
      <div>
        <form onSubmit={handleSubmit}>
        <input type="text" value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID" />
        <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="User Name" />
        <input type="text" value={userNote} onChange={e => setUserNote(e.target.value)} placeholder="User Note" />
        <button type="submit">Add User</button>
        </form>
      </div>
      </header>
    </div>
  );
}

export default App;
