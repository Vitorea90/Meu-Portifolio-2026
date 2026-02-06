import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import './ProjectsCarousel.css';
import { useVercelProjects } from '../hooks/useVercel';

const ProjectsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const [projects, , loading] = useVercelProjects();

    const nextSlide = () => {
        if (projects.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % projects.length);
        }
    };

    const prevSlide = () => {
        if (projects.length > 0) {
            setCurrentIndex((prev) =>
                prev === 0 ? projects.length - 1 : prev - 1
            );
        }
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const [direction, setDirection] = useState(0);

    const handleNext = () => {
        setDirection(1);
        nextSlide();
    };

    const handlePrev = () => {
        setDirection(-1);
        prevSlide();
    };

    // Don't render section if no projects
    if (projects.length === 0) {
        return null;
    }

    return (
        <section id="projects" className="section projects-carousel-section">
            <div className="container">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Projetos em Destaque</h2>
                    <p className="section-subtitle">
                        Principais projetos que demonstram minhas habilidades e criatividade
                    </p>

                    <div className="carousel-container">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentIndex}
                                className="carousel-slide"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: 'spring', stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                }}
                            >
                                <div
                                    className="project-card-large clickable"
                                    onClick={() => window.location.href = `/projeto/${projects[currentIndex].id}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="project-image-large">
                                        {projects[currentIndex]?.image ? (
                                            <img src={projects[currentIndex].image} alt={projects[currentIndex].title} />
                                        ) : (
                                            <div className="image-placeholder-carousel">
                                                <span>Projeto</span>
                                            </div>
                                        )}
                                        <div className="project-overlay-large"></div>
                                    </div>

                                    <div className="project-content-large">
                                        <h3 className="project-name">
                                            {projects[currentIndex]?.title}
                                        </h3>
                                        <p className="project-description">
                                            {projects[currentIndex]?.description}
                                        </p>

                                        <div className="project-tech">
                                            {(projects[currentIndex]?.techStack || []).map((tech, idx) => (
                                                <span key={idx} className="tech-badge">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        {(projects[currentIndex]?.link || projects[currentIndex]?.github) && (
                                            <div className="project-links-carousel">
                                                {projects[currentIndex]?.link && (
                                                    <a href={projects[currentIndex].link} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                                                        Ver Projeto
                                                    </a>
                                                )}
                                                {projects[currentIndex]?.github && (
                                                    <a href={projects[currentIndex].github} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                                                        GitHub
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <motion.button
                            className="carousel-btn prev"
                            onClick={handlePrev}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ←
                        </motion.button>

                        <motion.button
                            className="carousel-btn next"
                            onClick={handleNext}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            →
                        </motion.button>

                        {/* Dots */}
                        <div className="carousel-dots">
                            {projects.map((_, idx) => (
                                <motion.button
                                    key={idx}
                                    className={`dot ${idx === currentIndex ? 'active' : ''}`}
                                    onClick={() => {
                                        setDirection(idx > currentIndex ? 1 : -1);
                                        goToSlide(idx);
                                    }}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ProjectsCarousel;
