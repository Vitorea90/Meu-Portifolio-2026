import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(password);

        if (success) {
            window.location.href = '/admin';
        } else {
            setError('Senha incorreta');
            setPassword('');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    <h1 className="login-title">Admin Dashboard</h1>
                    <p className="login-subtitle">Acesse seu painel administrativo</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                className="login-input"
                                autoFocus
                                required
                            />
                        </div>

                        {error && <p className="login-error">{error}</p>}

                        <button type="submit" className="btn btn-primary login-btn">
                            Entrar
                        </button>
                    </form>

                    <p className="login-hint">Senha padrão: admin123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
