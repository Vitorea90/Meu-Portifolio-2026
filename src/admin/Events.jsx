import React, { useState } from 'react';
import { useVercelEvents } from '../hooks/useVercel';

const Events = () => {
    const [events, setEvents, loading] = useVercelEvents();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        type: 'Event',
        icon: '',
        award: '',
        image: '',
        images: []
    });

    const types = ['Event', 'Hackathon', 'Award', 'Certificate', 'Other'];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            setEvents.upsert({
                id: editingId,
                ...formData,
                image: formData.images && formData.images.length > 0 ? formData.images[0] : formData.image
            });
            setEditingId(null);
        } else {
            const newEvent = {
                id: Date.now(),
                ...formData,
                image: formData.images && formData.images.length > 0 ? formData.images[0] : formData.image
            };
            setEvents.upsert(newEvent);
        }

        resetForm();
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            type: event.type || 'Event',
            icon: event.icon || '',
            award: event.award || '',
            image: event.image || '',
            images: event.images || (event.image ? [event.image] : [])
        });
        setEditingId(event.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este evento?')) {
            setEvents.delete(id);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', date: '', type: 'Event', icon: '', award: '', image: '', images: [] });
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
                                <label>Ícone / Emoji</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="Ex: 🚀, 🏆"
                                    className="form-input"
                                />
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

                        <div className="form-group">
                            <label>Fotos do Evento (para Carrossel)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    if (files.length > 0) {
                                        const newImages = [];
                                        let processedCount = 0;

                                        files.forEach(file => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                newImages.push(reader.result);
                                                processedCount++;
                                                if (processedCount === files.length) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        images: [...(prev.images || []), ...newImages],
                                                        image: prev.image || newImages[0]
                                                    }));
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        });
                                    }
                                }}
                                className="form-input"
                            />
                            <div className="image-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginTop: '10px' }}>
                                {formData.images && formData.images.map((img, index) => (
                                    <div key={index} className="image-preview-item" style={{ position: 'relative' }}>
                                        <img src={img} alt={`Preview ${index}`} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = formData.images.filter((_, i) => i !== index);
                                                setFormData({
                                                    ...formData,
                                                    images: newImages,
                                                    image: index === 0 ? (newImages[0] || '') : formData.image
                                                });
                                            }}
                                            className="btn-remove-image"
                                            style={{
                                                position: 'absolute',
                                                top: '-5px',
                                                right: '-5px',
                                                background: 'red',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px'
                                            }}
                                        >
                                            ×
                                        </button>
                                        {index === 0 && <span style={{ position: 'absolute', bottom: '0', left: '0', background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', padding: '2px 4px', borderTopRightRadius: '4px' }}>Capa</span>}
                                    </div>
                                ))}
                            </div>
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
                        {event.images && event.images.length > 0 && (
                            <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                                📷 {event.images.length} foto(s)
                            </div>
                        )}
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
