import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Skills.css';
import { useVercelSkills } from '../hooks/useVercel';

const Skills = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const [skills, , loading] = useVercelSkills();

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

                    <div className="skills-grid-flat">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.id}
                                className="skill-item"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="skill-name">{skill.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
