
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

const Login = ({ setToken, setRole, token }) => {
  if (token) {
    window.history.back();
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { email, password }
      );
      if (response.data.access_token) {
        toast.success('Login successful');
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('client_type', response.data.client_type);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('user_name',response.data.user_name)
        setToken(response.data.access_token);
        setRole(response.data.client_type);

        if (response.data.client_type === 'admin') {
          navigate('/dashboard/client');
        } else if (response.data.client_type === 'client') {
          navigate('/dashboard/stores');
        } else {
          navigate('/dashboard/stores');
        }

        setEmail('');
        setPassword('');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.log(error, 'errrr');
      toast.error('Login failed: ' + (error.response?.data?.message || 'Server error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/signup`,
        { email, password }
      );

      if (response.status === 201) {
        toast.success('Sign up successful');
        setEmail('');
        setPassword('');
        setIsLogin(true);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Sign up failed: ' + (error.response?.data?.message || 'Server error'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>{isLogin ? 'Login' : 'Sign up'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {isLogin ? (
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                </>
              ) : (
                'Login'
              )}
            </button>
            <button type="button" className="signup-button" onClick={toggleForm}>
              Sign Up
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                </>
              ) : (
                'Sign Up'
              )}
            </button>
            <button type="button" className="signup-button" onClick={toggleForm}>
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;