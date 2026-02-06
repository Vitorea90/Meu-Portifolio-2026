import React from 'react';
import { motion } from 'framer-motion';
import { personalInfo } from '../data/portfolio-data';
import './Hero.css';

const Hero = () => {
    return (
        <section id="home" className="hero">
            <div className="hero-bg-accent"></div>

            <div className="container hero-container">
                <div className="hero-content">
                    {/* Texto à Esquerda */}
                    <div className="hero-text-wrapper">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="hero-title">
                                Olá, eu sou <br />
                                <span className="text-gradient">Vitor Emanuel</span>
                            </h1>
                            <p className="hero-subtitle">
                                Desenvolvedor Full Stack, Designer e Inovador
                            </p>

                            <div className="hero-buttons">
                                <a href="#projects" className="btn btn-primary">Ver Projetos</a>
                                <a href="#about" className="btn btn-outline">Sobre Mim</a>
                            </div>

                            <div className="hero-socials">
                                <a href={personalInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                                    <img src="/instagram.png" alt="Instagram" />
                                </a>
                                <a href={personalInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                                    <img src="/linkedin.png" alt="LinkedIn" />
                                </a>
                                <a href={personalInfo.socialMedia.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                                    <img src="/github.png" alt="GitHub" />
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Imagem à Direita */}
                    <div className="hero-image-wrapper">
                        <motion.div
                            className="image-box"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <img src="/profile.png" alt="Vitor Emanuel" className="hero-profile-img" />
                            <div className="hero-glow"></div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
