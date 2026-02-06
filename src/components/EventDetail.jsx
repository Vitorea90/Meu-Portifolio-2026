import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EventDetail.css';
import { useVercelEvents } from '../hooks/useVercel';

const EventDetail = ({ eventId }) => {
    const [event, setEvent] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [events, , loading] = useVercelEvents();

    useEffect(() => {
        if (!loading && events) {
            const found = events.find(e => e.id === parseInt(eventId));
            setEvent(found);
        }
    }, [eventId, events, loading]);

    const handleBack = () => {
        window.location.href = '/';
    };

    const getEventTypeInfo = (event) => {
        if (event?.icon) {
            return { icon: event.icon, label: event.type || 'Evento', cssClass: 'custom' };
        }
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

    const images = event.images && event.images.length > 0
        ? event.images
        : (event.image ? [event.image] : []);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // Split title to highlight last word
    const titleWords = event.title.split(' ');
    const lastWord = titleWords.pop();
    const restOfTitle = titleWords.join(' ');

    return (
        <div className="event-detail-page">
            {/* Hero Section (Carousel) */}
            <section className="event-hero">
                {images.length > 0 ? (
                    <>
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
                                    alt={`Event visualization ${currentImageIndex + 1}`}
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
                    </>
                ) : (
                    // Fallback if no images
                    <div className="hero-overlay-gradient" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h1 style={{ color: 'rgba(255,255,255,0.1)', fontSize: '5rem' }}>No Images</h1>
                    </div>
                )}
            </section>

            {/* Content Sections */}
            <div className="event-content-wrapper">
                {/* Header Section */}
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
