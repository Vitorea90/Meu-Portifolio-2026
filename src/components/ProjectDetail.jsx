import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ProjectDetail.css';
import Loading from './Loading';
import { useVercelProject } from '../hooks/useVercel';

const ProjectDetail = ({ projectId }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [project, loading] = useVercelProject(projectId);

    // No need for useEffect filtering anymore as hook handles find by id on server


    const handleBack = () => {
        window.location.href = '/';
    };

    const images = project ? (project.images && project.images.length > 0 ? project.images : (project.image ? [project.image] : [])) : [];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    if (loading && !project) {
        return <Loading />;
    }

    if (!project) {
        return (
            <div className="project-detail-page">
                <div className="project-detail-error">
                    <h2>Projeto não encontrado</h2>
                    <button onClick={handleBack} className="btn-back-error">
                        ← Voltar para Home
                    </button>
                </div>
            </div>
        );
    }

    // Defensive check for title before splitting
    const title = project.title || 'Projeto';
    const titleWords = title.split(' ');
    const lastWord = titleWords.length > 0 ? titleWords.pop() : '';
    const restOfTitle = titleWords.join(' ');

    return (
        <div className="project-detail-page">
            {/* Hero Section */}
            {/* Hero Section (Carousel) */}
            {/* Hero Section (Carousel) */}
            <section className="project-hero">
                {/* Blur Background */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`blur-${currentImageIndex}`}
                        className="hero-blur-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
                    />
                </AnimatePresence>

                <div className="hero-overlay-gradient"></div>

                {/* Main Image Container */}
                <div className="hero-main-container">
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={currentImageIndex}
                            src={images[currentImageIndex]}
                            alt={`Project visualization ${currentImageIndex + 1}`}
                            className="hero-image-slide"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                        />
                    </AnimatePresence>
                </div>



                {images.length > 1 && (
                    <>
                        <button className="carousel-btn prev" onClick={prevImage}>❮</button>
                        <button className="carousel-btn next" onClick={nextImage}>❯</button>
                        <div className="carousel-indicators">
                            {images.map((_, index) => (
                                <span
                                    key={index}
                                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </>
                )}


            </section>

            {/* Content Sections */}
            <div className="project-content-wrapper">
                {/* Header Section (Moved from Hero) */}
                <motion.div
                    className="project-header-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {project.techStack && project.techStack[0] && (
                        <span className="project-category-inline">• {project.techStack[0].toUpperCase()}</span>
                    )}
                    <h1 className="project-page-title">
                        {restOfTitle} <span className="highlight-inline">{lastWord}</span>
                    </h1>
                </motion.div>
                {/* About Section */}
                <motion.section
                    className="project-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="section-title-detail">Sobre o Projeto</h2>
                    <p className="section-text">{project.description}</p>
                </motion.section>

                {/* Technologies Section */}
                {project.techStack && project.techStack.length > 0 && (
                    <motion.section
                        className="project-section tech-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h2 className="section-title-detail">Tecnologias Utilizadas</h2>
                        <div className="tech-grid-detail">
                            {project.techStack.map((tech, index) => (
                                <motion.div
                                    key={index}
                                    className="tech-item-detail"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <span className="tech-icon">◆</span>
                                    <span className="tech-name">{tech}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Links Section */}
                <div className="project-links-section">
                    {project.link && (
                        <motion.section
                            className="project-section link-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-external-link">
                                <span className="link-icon">🌐</span>
                                <div>
                                    <span className="link-title">Ver Projeto Online</span>
                                    <span className="link-desc">Acesse a versão demonstrativa</span>
                                </div>
                                <span className="link-arrow">→</span>
                            </a>
                        </motion.section>
                    )}

                    {project.github && (
                        <motion.section
                            className="project-section github-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="github-link-large">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                <div>
                                    <span className="github-title">Ver no GitHub</span>
                                    <span className="github-desc">Explore o código-fonte e documentação técnica</span>
                                </div>
                                <span className="github-arrow">→</span>
                            </a>
                        </motion.section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;

