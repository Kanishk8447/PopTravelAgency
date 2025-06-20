import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { useAuth } from 'react-oidc-context';
import LoadingComponent from '../src/common/Loading';
import axiosInstance from '../src/config/axiosConfig';

const STORAGE_PROVIDER = (import.meta.env.VITE_REACT_APP_CLOUD_PROVIDER || 'azure').toLowerCase();

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);


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

   useEffect(() => {
  if (auth?.isAuthenticated && !auth.isLoading) {
    setIsLoading(false);
    localStorage.setItem('accessToken', auth.user?.access_token ?? '');
    navigate('/welcome');

    const channel = new BroadcastChannel('auth');
    channel.postMessage('logged_in');
    channel.close();
  } else if (auth?.error) {
    console.error('Authentication error:', auth?.error);
    setIsLoading(false);
  }
}, [auth, navigate]);


const getDetails = async () => {
     try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found in localStorage');
        return;
      }
      
      const response = await fetch('https://foundation-dev-hyfrcgbcckagbahe.a03.azurefd.net/api/users/details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userName = auth.user?.profile.email;
        console.log('User Name:', userName);
        if (userName) {
          const response = await axiosInstance.get('/api/users/details', {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          getDetails();

          console.log('Response from /users/details:', response);
          const responseData = response.data;
          if (responseData) {
            // updateUserInfo(responseData);

            // if (responseData.is_superadmin === true || responseData.is_enabled === true) {
            //   setValidatedUserRole(responseData);
            //   if (responseData.is_superadmin) {
            //     const newRole = {
            //       is_superadmin: responseData.is_superadmin
            //     };
            //     updateUserInfo({ ...responseData, userRole: newRole });
            //   }
            // } else {
            //   setValidatedUserRole(false);
            // }
          }
        }
      } catch (error: any) {
        if (error.response?.data?.detail) {
          console.warn(
            'User not found in database or other API detail error:',
            error.response.data.detail
          );
          // setValidatedUserRole(false);
        } else {
          console.error('Error fetching data:', error);
          setError(error.message || 'Failed to fetch user details');
        }
        setError(error.message || 'Failed to fetch user details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [auth.user]);

  const handleLoginUI = async () => {
    if (STORAGE_PROVIDER === 'aws') {
      try {
        console.log('Inside aws login');
        await auth.signinRedirect();
        // The following code will run after redirect back from Cognito
        if (auth.user) {
          // Store both access token and ID token
          localStorage.setItem('accessToken', auth.user.access_token);
          localStorage.setItem('idToken', auth.user.id_token);

          const channel = new BroadcastChannel('auth');
          channel.postMessage('logged_in');
          channel.close();

          navigate('/welcome');
          getDetails();
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    } else {
      console.log('Inside azure login');
      try {
        setIsLoading(true);
        await auth.signinPopup();
      } catch (error) {
        setIsLoading(false);
        console.error('Login initiation failed:', error);
      }
    }
  };

   if (auth.isLoading || isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="login-div">
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-md-10 p-0">
            <div className="card login-card mt-0 pt-0">
              <div className="card-body pt-5 pl-4 ml-1">
                <div className="col-md-3 px-0 pb-5 mb-5">
                  <img src="/GenAILogoWhiteBlue.svg" />
                </div>
                <div className="login-s-logo">
                  <img src="/SogetiLogoOrig.svg" />
                </div>
                <div className="pt-5">
                  <div className="lh-sm pl-5 pb-3 pt-5 signin-head fw-bold col-md-6">
                    Discover Gen AI Foundations
                  </div>
                  <div className="pl-5 pt-4 log signin-desc text-white fs-1 col-md-9">
                    Your innovative, on-demand accelerator crafted to superoxide software and
                    quality engineering processes through the thoughtful application of Generative
                    AI.
                  </div>
                  <p className="mt-4 pl-5 pt-5 mt-4">
                    {/* <Link to={'/login'}> */}
                      <button className="btn-white btn-lg rounded-pill fs-2 sign-in-btn"
                      onClick={handleLoginUI}>
                        Sign in
                      </button>
                    {/* </Link> */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
