import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Authenticate user
      const loginResponse = await fetch('http://localhost:9090/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: formData.email,
          password: formData.password
        })
      });

      if (!loginResponse.ok) {
        alert('Login failed. Please check your credentials.');
        return;
      }

      // Step 2: Fetch user details using parentEmail
      const userResponse = await fetch(`http://localhost:9090/api/auth/parentEmail/${formData.email}`);
      if (!userResponse.ok) {
        alert('Failed to fetch user details.');
        return;
      }

      const user = await userResponse.json();

      // Step 3: Store data in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('parentEmail', formData.email);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userId', user.username); // Optional

      alert('Login successful!');
      navigate('/dashboard'); // Redirect to first game
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="form-group">
          <label>Parent's Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>

        <div className="link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
