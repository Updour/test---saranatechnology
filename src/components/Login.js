import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash'
import { API_SERVE } from '../helper'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async() => {
    try {
      if (!credentials.username || !credentials.password) return alert('Form diperlukan!.')
      let items = { 
       username: credentials.username,
       password: credentials.password
    }
    const results = await API_SERVE.post('/api/v1/login', items)
    if (_.isEqual(results.data.success, true)) {
      alert(results.data.message)
      localStorage.setItem('accessToken', JSON.stringify(results.data.data.token))
      setTimeout(() => navigate('/home'), 1500);
    }
    }catch(e) {
      if (_.isEqual(e.response.data.success, false)) return alert(e.response.data.message)
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4">
        <h2 className="text-center">Login</h2>
        <div className="mb-3">
          <input type="text" className="form-control" name="username" placeholder="Username" value={credentials.username} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" name="password" placeholder="Password" value={credentials.password} onChange={handleInputChange} />
        </div>
        <button className="btn btn-primary d-block" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
