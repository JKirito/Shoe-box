import { setCredentials } from '@/lib/features/auth/authSlice';
import authService from '@/services/authService';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = await authService.login(email, password);
            if(userData) {
                dispatch(setCredentials({user: userData.user, token: userData.token}));
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;