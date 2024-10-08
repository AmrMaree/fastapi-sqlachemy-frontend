import React, { useState } from 'react';
import api from '../api';

const Login = ({ onSwitchToSignup, onSuccessfulLogin }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const formData = new URLSearchParams();
            formData.append('username', loginData.email);
            formData.append('password', loginData.password);

            const response = await api.post('/users/login/', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('userId', response.data.userId)
            console.log(response.data);
            onSuccessfulLogin();
        } catch (error) {
            console.error('There was an error!', error);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className='login-card'>
            <div>
                <h2>Login</h2>
                {error && <p className="login-error">{error}</p>}
                <form onSubmit={handleLoginSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p>
                    Don't have an account?{' '}
                    <span onClick={onSwitchToSignup} style={{ color: 'blue', cursor: 'pointer' }}>
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;