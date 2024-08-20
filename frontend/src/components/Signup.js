import React, { useState } from 'react';
import api from '../api';

const Signup = ({ onSwitchToLogin, onSuccessfulSignup }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/users/', formData);
            console.log(response.data);
            setFormData({
                name: '',
                email: '',
                password: ''
            });
            onSuccessfulSignup(); // This will switch back to the login page
        } catch (error) {
            console.error('There was an error!', error);
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <div className='signup-card'>
            <div>
                <h2>Sign Up</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
                <p>
                    Already have an account?{' '}
                    <span onClick={onSwitchToLogin} style={{ color: 'blue', cursor: 'pointer' }}>
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Signup;