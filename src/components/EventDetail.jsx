import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './EventDetail.css';

const EventDetail = ({ eventId }) => {
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const events = JSON.parse(localStorage.getItem('portfolio_events') || '[]');
        const found = events.find(e => e.id === parseInt(eventId));
        setEvent(found);
    }, [eventId]);

    const handleBack = () => {
        window.location.href = '/';
    };

    const getEventTypeInfo = (event) => {
        const type = event?.type?.toLowerCase() || 'event';
        if (type === 'award' || type === 'certificate') {
            return { icon: '🏆', label: 'Premiação', cssClass: 'award', color: '#ffd700' };
        }
        return { icon: '🎤', label: 'Evento', cssClass: 'event', color: 'var(--color-primary)' };
    };

    const getYear = (event) => {
        if (event?.year) return event.year;
        if (event?.date) {
            return new Date(event.date).getFullYear();
        }
        return '';
    };

    if (!event) {
        return (
            <div className="event-detail-page">
                <div className="event-detail-error">
                    <h2>Evento não encontrado</h2>
                    <button onClick={handleBack} className="btn-back-error-event">
                        ← Voltar para Home
                    </button>
                </div>
            </div>
        );
    }

    const typeInfo = getEventTypeInfo(event);

    // Split title to highlight last word
    const titleWords = event.title.split(' ');
    const lastWord = titleWords.pop();
    const restOfTitle = titleWords.join(' ');

    return (
        <div className="event-detail-page">
            {/* Hero Section */}
            <motion.section
                className={`event-hero ${typeInfo.cssClass}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="event-hero-overlay"></div>
                <div className="event-hero-content">
                    <div className="detail-nav-header">
                    </div>

                    <div className="detail-nav-header">
                    </div>
                </div>
            </motion.section>

            {/* Content Sections */}
            <div className="event-content-wrapper">
                {/* Header Section (Moved from Hero) */}
                <motion.div
                    className="event-header-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="event-type-header-inline">
                        <span className={`event-type-tag ${typeInfo.cssClass}`}>
                            {typeInfo.icon} {typeInfo.label.toUpperCase()}
                        </span>
                        <span className="event-year-tag-inline">{getYear(event)}</span>
                    </div>

                    <h1 className="event-page-title">
                        {restOfTitle} <span className={`highlight-event-inline ${typeInfo.cssClass}`}>{lastWord}</span>
                    </h1>
                </motion.div>
                {/* Description Section */}
                <motion.section
                    className="event-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="section-title-event">Sobre o Evento</h2>
                    <p className="section-text-event">{event.description}</p>
                </motion.section>

                {/* Date & Details Section */}
                <motion.section
                    className="event-section details-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="section-title-event">Detalhes</h2>
                    <div className="event-details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Tipo</span>
                            <span className="detail-value">{event.type || typeInfo.label}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Ano</span>
                            <span className="detail-value">{getYear(event)}</span>
                        </div>
                        {event.date && (
                            <div className="detail-item">
                                <span className="detail-label">Data Completa</span>
                                <span className="detail-value">
                                    {new Date(event.date).toLocaleDateString('pt-BR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Award Highlight Section */}
                {event.award && (
                    <motion.section
                        className="event-section award-highlight-section"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="award-highlight-card">
                            <span className="award-icon-large">🏆</span>
                            <div className="award-content">
                                <h3>Premiação Conquistada</h3>
                                <p>{event.award}</p>
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
};

export default EventDetail;
