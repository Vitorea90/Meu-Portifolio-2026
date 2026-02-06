import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save to localStorage for admin dashboard
        const submissions = JSON.parse(localStorage.getItem('portfolio_submissions') || '[]');
        const newSubmission = {
            id: Date.now(),
            ...formData,
            timestamp: new Date().toISOString(),
            read: false
        };
        submissions.unshift(newSubmission);
        localStorage.setItem('portfolio_submissions', JSON.stringify(submissions));

        setFormStatus('Mensagem enviada com sucesso! Entrarei em contato em breve.');

        // Limpar formulário
        setTimeout(() => {
            setFormData({ name: '', email: '', phone: '', message: '' });
            setFormStatus('');
        }, 5000);
    };

    return (
        <footer id="contact" className="footer">
            <div className="footer-background">
                <div className="footer-gradient"></div>
            </div>

            <div className="container">
                <div className="footer-content">
                    <motion.div
                        className="footer-main"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="footer-subtitle">
                            Vamos conversar
                        </p>
                        <p className="footer-description">
                            Estou sempre animado para fazer novos projetos e colaborações
                        </p>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Seu Nome"
                                        required
                                        className="form-input"
                                    />
                                </motion.div>

                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Seu Email"
                                        required
                                        className="form-input"
                                    />
                                </motion.div>
                            </div>

                            <motion.div
                                className="form-group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Seu Telefone"
                                    required
                                    className="form-input"
                                />
                            </motion.div>

                            <motion.div
                                className="form-group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                            >
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Sua Mensagem"
                                    rows="5"
                                    required
                                    className="form-input form-textarea"
                                ></textarea>
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="btn btn-primary form-submit"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Enviar Mensagem
                            </motion.button>

                            {formStatus && (
                                <motion.p
                                    className="form-status"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    ✓ {formStatus}
                                </motion.p>
                            )}
                        </form>
                    </motion.div>

                    <motion.div
                        className="footer-bottom"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="footer-divider"></div>
                        <p className="copyright">
                            © {currentYear} Vitor Emanuel. Feito com{' '}
                            <span className="heart">❤️</span> e React
                        </p>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
