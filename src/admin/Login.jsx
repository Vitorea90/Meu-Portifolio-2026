import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Slight artificial delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        const success = login(password);

        if (success) {
            window.location.href = '/admin';
        } else {
            setError('Senha incorreta');
            setPassword('');
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <motion.div
                className="login-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="login-box">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="login-title">Admin</h1>
                        <p className="login-subtitle">Bem-vindo de volta, Vitor Emanuel</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="password">Chave de Acesso</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="login-input"
                                autoFocus
                                required
                            />
                        </div>

                        {error && (
                            <motion.div
                                className="login-error"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={isLoading}
                            style={{ opacity: isLoading ? 0.7 : 1 }}
                        >
                            {isLoading ? 'Acessando...' : 'Entrar no Painel'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
