import React from 'react';
import { motion, useInView } from 'framer-motion';
import { motion, useInView } from 'framer-motion';
import { personalInfo, publications, eventsAndAwards } from '../data/portfolio-data';
import './About.css';

const About = () => {
    // Calculate stats
    const projectCount = publications.filter(p => p.type === 'Projeto').length;
    const eventCount = publications.filter(p => p.type === 'Evento').length + eventsAndAwards.filter(e => e.type === 'event').length;
    const awardCount = publications.filter(p => p.type === 'Premiação').length + eventsAndAwards.filter(e => e.type === 'award').length;

    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section id="about" className="section about">
            <div className="container">
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <motion.h2 className="section-title" variants={itemVariants}>
                        Sobre Mim
                    </motion.h2>

                    <motion.p className="section-subtitle" variants={itemVariants}>
                        Desenvolvedor apaixonado por inovação
                    </motion.p>

                    <div className="about-content">
                        <motion.div className="about-text" variants={itemVariants}>
                            <div className="about-card">
                                <p>{personalInfo.bio}</p>

                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <motion.div
                                            className="stat-number"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                        >
                                            {projectCount}+
                                        </motion.div>
                                        <div className="stat-label">Projetos</div>
                                    </div>

                                    <div className="stat-item">
                                        <motion.div
                                            className="stat-number"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                            transition={{ delay: 0.7, duration: 0.5 }}
                                        >
                                            {eventCount}+
                                        </motion.div>
                                        <div className="stat-label">Eventos</div>
                                    </div>

                                    <div className="stat-item">
                                        <motion.div
                                            className="stat-number"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                            transition={{ delay: 0.9, duration: 0.5 }}
                                        >
                                            {awardCount}+
                                        </motion.div>
                                        <div className="stat-label">Premiações</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
