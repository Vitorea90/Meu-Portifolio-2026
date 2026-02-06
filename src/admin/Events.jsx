import React, { useState } from 'react';
import { useEvents } from '../hooks/useLocalStorage';

const Events = () => {
    const [events, setEvents] = useEvents();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        type: 'Event',
        award: ''
    });

    const types = ['Event', 'Hackathon', 'Award', 'Certificate', 'Other'];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            setEvents(events.map(event =>
                event.id === editingId ? { ...event, ...formData } : event
            ));
            setEditingId(null);
        } else {
            const newEvent = {
                id: Date.now(),
                ...formData
            };
            setEvents([newEvent, ...events]);
        }

        resetForm();
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            type: event.type || 'Event',
            award: event.award || ''
        });
        setEditingId(event.id);
        setIsAdding(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este evento?')) {
            setEvents(events.filter(event => event.id !== id));
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', date: '', type: 'Event', award: '' });
        setIsAdding(false);
        setEditingId(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="events-container">
            <div className="section-header">
                <h2 className="section-title">Eventos & Prêmios</h2>
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)} className="btn btn-primary">
                        + Adicionar Evento
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="form-card">
                    <h3 className="form-card-title">
                        {editingId ? 'Editar Evento' : 'Novo Evento'}
                    </h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Título</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Nome do evento ou prêmio"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tipo</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="form-input"
                                >
                                    {types.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Data</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descrição</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descreva o evento ou conquista..."
                                rows="3"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Prêmio / Posição (opcional)</label>
                            <input
                                type="text"
                                value={formData.award}
                                onChange={(e) => setFormData({ ...formData, award: e.target.value })}
                                placeholder="Ex: 1º Lugar, Menção Honrosa"
                                className="form-input"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Salvar' : 'Adicionar'}
                            </button>
                            <button type="button" onClick={resetForm} className="btn btn-secondary">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="events-list">
                {sortedEvents.map((event) => (
                    <div key={event.id} className="event-card">
                        <div className="event-header">
                            <div className="event-info">
                                <h3 className="event-title">{event.title}</h3>
                                <div className="event-meta">
                                    <span className="event-type">{event.type}</span>
                                    <span className="event-date">{formatDate(event.date)}</span>
                                </div>
                            </div>
                            {event.award && (
                                <div className="event-award">🏆 {event.award}</div>
                            )}
                        </div>
                        <p className="event-description">{event.description}</p>
                        <div className="event-actions">
                            <button onClick={() => handleEdit(event)} className="btn-small">
                                ✏️ Editar
                            </button>
                            <button onClick={() => handleDelete(event.id)} className="btn-small btn-danger">
                                🗑️ Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && !isAdding && (
                <div className="empty-state">
                    <span className="empty-icon">🏆</span>
                    <p className="empty-title">Nenhum evento cadastrado</p>
                    <p className="empty-text">Adicione seus eventos e conquistas</p>
                </div>
            )}
        </div>
    );
};

export default Events;
