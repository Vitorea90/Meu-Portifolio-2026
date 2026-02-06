import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills as defaultSkills } from '../data/portfolio-data';
import './Skills.css';

const Skills = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        // Load skills from localStorage
        const loadSkills = () => {
            const saved = localStorage.getItem('portfolio_skills');
            let loadedSkills = [];

            if (saved) {
                loadedSkills = JSON.parse(saved);
            }

            if (!loadedSkills || loadedSkills.length === 0) {
                console.log('Skills: Using default skills');
                loadedSkills = defaultSkills;
                // Optionally save defaults to storage to persist them for editing
                // localStorage.setItem('portfolio_skills', JSON.stringify(defaultSkills));
            } else {
                console.log('Skills: Loaded from storage:', loadedSkills.length);
            }

            setSkills(loadedSkills);
        };

        loadSkills();

        // Listen for storage changes
        window.addEventListener('storage', loadSkills);
        window.addEventListener('portfolioDataUpdated', loadSkills);

        return () => {
            window.removeEventListener('storage', loadSkills);
            window.removeEventListener('portfolioDataUpdated', loadSkills);
        };
    }, []);

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
    }, {});

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    // Don't render section if no skills
    if (skills.length === 0) {
        return null;
    }

    return (
        <section id="skills" className="section skills-section">
            <div className="container">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Habilidades & Tecnologias</h2>
                    <p className="section-subtitle">
                        Tecnologias e ferramentas que uso no dia a dia
                    </p>

                    <div className="skills-categories">
                        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                            <motion.div
                                key={category}
                                className="skill-category"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <h3 className="category-title">{category}</h3>
                                <div className="skills-list">
                                    {categorySkills.map((skill) => (
                                        <motion.div
                                            key={skill.id}
                                            className="skill-item"
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <div className="skill-header">
                                                <span className="skill-name">{skill.name}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
