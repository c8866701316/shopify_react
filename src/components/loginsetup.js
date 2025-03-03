import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import dotenv from 'dotenv';
// dotenv.config();


const Login = ({setToken,setRole,token}) => {
  if (token) {
    window.history.back()
}
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault(); // Prevent form submission
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/login`,
  //       { email, password }
  //     );

  //     if (response) {
  //       toast.success('Login successful');
  //       localStorage.setItem('access_token', response.data.access_token);
  //       navigate('/dashboard/page1'); // Redirect after successful login
  //     } else {
  //       toast.error('Invalid credentials');
  //     }
  //   } catch (error) {
  //     toast.error('Login failed: ' + (error.response?.data?.message || 'Server error'));
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    // setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { email, password }
      );

      if (response.data.access_token) {
        toast.success('Login successful');
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('client_type', response.data.client_type); // Store client type
        localStorage.setItem('user_id', response.data.user_id); // Store user ID
        setToken(response.data.access_token)
        setRole(response.data.client_type)
        // Redirect based on client type
        if (response.data.client_type === 'admin') {
          navigate('/dashboard/client'); // Redirect admin to ClientPage
        } else if (response.data.client_type === 'client') {
          navigate('/dashboard/page1'); // Redirect client to Page1
        } else {
          navigate('/dashboard/page1'); // Default redirect
        }

        // Clear input fields
        setEmail('');
        setPassword('');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.log(error,"errrr");
      
      toast.error('Login failed: ' + (error.response?.data?.message || 'Server error'));
    } finally {
      // setLoading(false);
    }
  };

  const handlesignup = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/signup`,
        { email, password }
      );
      if (response.status === 201) {
        
        toast.success('sign up successful');
        navigate('/dashboard/page1'); // Redirect after successful login
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed: ' + (error.response?.data?.message || 'Server error'));
    }

  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2> {isLogin ? "Login" : "Sign up"}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {isLogin ?
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="input"
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
            <button type="submit" className="login-button" >
              Login
            </button>
            <button type="submit" className="signup-button" onClick={() => setIsLogin(false)}>SignUp</button>
          </form> :
          <>
            <div>
              <form className="login-form" onSubmit={handlesignup}>
                <input
                  type="email"
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
                <button type="submit" className="login-button" onClick={() => setIsLogin(true)}>Login</button>
                <button type="submit" className="signup-button" onClick={() => setIsLogin(false)}>SignUp</button>
              </form>
            </div>

          </>
        }
      </div>
    </div>
  );
};

export default Login;