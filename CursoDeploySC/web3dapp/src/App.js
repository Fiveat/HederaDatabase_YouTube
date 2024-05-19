import logo from './logo.svg';
import './App.css';
import React, { useReducer, useState } from 'react';
import { addUserToContract } from './AddNota';
import { getUserFromContract } from './GetNota';



function App() {

  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userNote, setUserNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const status = await addUserToContract(userId, userName, userNote);
      alert(`Transaction status: ${status}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }


  const handleReadUser = async (e) => {
    e.preventDefault();
    try {
      const userData = await getUserFromContract(userId); //Llamamos a nuestra función y le enviamos el UserID
      setUserName(userData.userName); //Forzamos en el campo "userName" el nombre devuelto por la función readUser
      setUserNote(userData.userNote);
    } catch (error) {
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
          <button onClick={handleReadUser}>Leer usuario</button>
        </div>
      </header>
    </div>
  );
}

export default App;
