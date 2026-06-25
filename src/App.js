import { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(`Logging in as ${username || 'user'}...`);
  };

  return (
    <div className="App">
      <div className="login-card">
        <h1> set</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            nameuser
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </label>
          <button type="submit">Sign in</button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default App;
