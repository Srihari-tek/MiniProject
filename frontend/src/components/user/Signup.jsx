import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        studentName: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        password: '',
        disorder: '',
        age: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(formData.parentPhone)) {
            alert('Phone number must be exactly 10 digits.');
            return;
        }

        try {
            const response = await fetch('http://localhost:9090/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const userResponse = await fetch(`http://localhost:9090/api/auth/parentEmail/${formData.parentEmail}`);
                if (!userResponse.ok) {
                    alert('Failed to fetch user details.');
                    return;
                }

                const user = await userResponse.json();

                // Step 3: Store data in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('parentEmail', formData.email);
                localStorage.setItem('username', user.username);
                localStorage.setItem('userId', user.username); // Store the user ID

            console.log('Signup response:', response);

            if (response.ok) {
                alert('Signup successful! Please login.');
                navigate('/memory');
            } else if (response.status === 409) {
                alert('Email is already registered.');
            } else {
                const error = await response.text();
                alert('Signup failed: ' + error);
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup.');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Student Signup</h2>

                <div className="form-group">
                    <label>Student Name</label>
                    <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Parent's Name</label>
                    <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Parent's Email</label>
                    <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Parent's Phone Number</label>
                    <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Type of Disorder</label>
                    <div className="radio-group">
                        <div className="radio-option">
                            <input type="radio" id="adhd" name="disorder" value="ADHD" onChange={handleChange} required />
                            <label htmlFor="adhd">ADHD</label>
                        </div>
                        <div className="radio-option">
                            <input type="radio" id="autism" name="disorder" value="Autism" onChange={handleChange} required />
                            <label htmlFor="autism">Autism</label>
                        </div>
                        <div className="radio-option">
                            <input type="radio" id="dyslexia" name="disorder" value="Dyslexia" onChange={handleChange} required />
                            <label htmlFor="dyslexia">Dyslexia</label>
                        </div>
                    </div>
                </div>

                <button type="submit">Sign Up</button>

                <div className="link">
                    Already have an account? <a href="/login">Login</a>
                </div>
            </form>
        </div>
    );
}

export default Signup;
