import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import './EventsAwards.css';

const EventsAwards = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    // Get events from localStorage ONLY - no fallback
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Load events from localStorage
        const loadEvents = () => {
            const savedEvents = JSON.parse(localStorage.getItem('portfolio_events') || '[]');
            console.log('EventsAwards: Loaded events:', savedEvents);
            setEvents(savedEvents);
        };

        loadEvents();

        // Listen for storage changes
        window.addEventListener('storage', loadEvents);
        window.addEventListener('portfolioDataUpdated', loadEvents);

        return () => {
            window.removeEventListener('storage', loadEvents);
            window.removeEventListener('portfolioDataUpdated', loadEvents);
        };
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    // Determine event type icon and label
    const getEventTypeInfo = (event) => {
        if (event.icon) {
            return { icon: event.icon, label: event.type || 'Evento', cssClass: 'custom' };
        }
        const type = event.type?.toLowerCase() || 'event';
        if (type === 'award' || type === 'certificate') {
            return { icon: '🏆', label: 'Premiação', cssClass: 'award' };
        }
        return { icon: '🎤', label: 'Evento', cssClass: 'event' };
    };

    // Get year from date or year field
    const getYear = (event) => {
        if (event.year) return event.year;
        if (event.date) {
            return new Date(event.date).getFullYear();
        }
        return '';
    };

    // Don't render section if no events
    if (events.length === 0) {
        return null;
    }

    return (
        <section id="events" className="section events-awards">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Eventos & Premiações</h2>
                    <p className="section-subtitle">
                        Participações em eventos importantes e reconhecimentos recebidos
                    </p>

                    <motion.div
                        className="timeline"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {events.map((item, index) => {
                            const typeInfo = getEventTypeInfo(item);
                            return (
                                <motion.div
                                    key={item.id || index}
                                    className={`timeline-item ${typeInfo.cssClass}`}
                                    variants={itemVariants}
                                >
                                    <div className="timeline-marker">
                                        <motion.div
                                            className="marker-dot"
                                            whileHover={{ scale: 1.5 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            {typeInfo.icon}
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        className="timeline-content"
                                        whileHover={{ x: 10, transition: { duration: 0.3 } }}
                                        onClick={() => window.location.href = `/evento/${item.id}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="timeline-card">
                                            <div className="timeline-header">
                                                <span className={`type-badge ${typeInfo.cssClass}`}>
                                                    {item.type || typeInfo.label}
                                                </span>
                                                <span className="timeline-year">{getYear(item)}</span>
                                            </div>

                                            <h3 className="timeline-title">{item.title}</h3>
                                            <p className="timeline-description">{item.description}</p>

                                            {item.award && (
                                                <div className="event-award-badge">
                                                    🏆 {item.award}
                                                </div>
                                            )}

                                            <div className="timeline-image-placeholder">
                                                <span>{typeInfo.label}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default EventsAwards;
