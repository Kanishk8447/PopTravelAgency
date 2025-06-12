import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the users data from the JSON file
    fetch('/usersData.json')
      .then(response => response.json())
      .then(data => setUsers(data.users))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      navigate('/welcome');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <>
    <div className="login-div">
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-md-12 p-0">
            <div className="card login-card mt-0 pt-0">
              <div className="d-flex justify-content-center align-items-center">
                <div className="card-body pt-5 pl-4 ml-1  col-md-7">
                <div className="col-md-3 px-0 pb-5 mb-5">
                  <img src="/GenAILogoWhiteBlue.svg" />
                </div>
                
                <div className="pt-5 mt-n5">
                  <div className="lh-sm pl-5 pb-3 pt-5 signin-head fw-bold col-md-6">
                    Discover Gen AI Foundations
                  </div>
                  <div className="pl-5 pt-4 log signin-desc text-white fs-1 col-md-9">
                    Your innovative, on-demand accelerator crafted to superoxide software and
                    quality engineering processes through the thoughtful application of Generative
                    AI.
                  </div>
                  {/* <p className="mt-4 pl-5 pt-5 mt-4">
                    <Link to={'/login'}>
                      <button className="btn-white btn-lg rounded-pill fs-2 sign-in-btn">
                        Sign in
                      </button>
                    </Link>
                  </p> */}
                </div>
                
              </div>
              <div className="col-md-1 p-0">
                </div>
              <div className=" pl-5 pt-5 col-md-3" style={{marginTop: '8rem'}}>
                    
                    <div className="login-container">
                      <div className="login-form-wrapper">
                        <h2 className="login-title">Log In</h2>
                        <form onSubmit={handleLogin} className="login-form row">
                          <div className="form-group col-md-12">
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="form-input"
                              placeholder="Enter your email"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                              type="password"
                              id="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="form-input"
                              placeholder="Enter your password"
                            />
                          </div>
                          <div className='d-flex justify-content-center align-items-center'>
                            <button type="submit" className="login-button w-50">Log In</button>
                          </div>                        
                          </form>
                        {error && <p className="error-message mb-0">{error}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-1 p-0">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
