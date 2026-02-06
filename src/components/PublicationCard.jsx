import React from 'react';
import { motion } from 'framer-motion';
import './PublicationCard.css';

const PublicationCard = ({ publication, index }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.6, -0.05, 0.01, 0.99],
            },
        },
    };

    const getBadgeClass = (type) => {
        switch (type) {
            case 'Projeto':
                return 'badge-primary';
            case 'Evento':
                return 'badge-secondary';
            case 'Premiação':
                return 'badge-accent';
            default:
                return 'badge-primary';
        }
    };

    return (
        <motion.div
            className="publication-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
        >
            <div className="publication-image">
                <div className="image-placeholder-pub">
                    <span>{publication.type}</span>
                </div>
                <div className="publication-overlay"></div>
            </div>

            <div className="publication-content">
                <div className="publication-header">
                    <span className={`badge ${getBadgeClass(publication.type)}`}>
                        {publication.type}
                    </span>
                    <span className="publication-date">{publication.date}</span>
                </div>

                <h3 className="publication-title">{publication.title}</h3>
                <p className="publication-description">{publication.description}</p>

                {publication.tags && (
                    <div className="publication-tags">
                        {publication.tags.map((tag, idx) => (
                            <span key={idx} className="tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <motion.div
                    className="publication-glow"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </motion.div>
    );
};

export default PublicationCard;
