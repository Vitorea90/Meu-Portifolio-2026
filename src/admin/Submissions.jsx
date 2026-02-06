import React from 'react';
import { useSubmissions } from '../hooks/useLocalStorage';

const Submissions = () => {
    const [submissions, setSubmissions] = useSubmissions();

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta submissão?')) {
            setSubmissions(submissions.filter(sub => sub.id !== id));
        }
    };

    const toggleRead = (id) => {
        setSubmissions(submissions.map(sub =>
            sub.id === id ? { ...sub, read: !sub.read } : sub
        ));
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('pt-BR');
    };

    if (submissions.length === 0) {
        return (
            <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p className="empty-title">Nenhum formulário recebido</p>
                <p className="empty-text">Quando alguém preencher o formulário de contato, aparecerá aqui</p>
            </div>
        );
    }

    return (
        <div className="submissions-container">
            <div className="submissions-stats">
                <div className="stat-card">
                    <span className="stat-number">{submissions.length}</span>
                    <span className="stat-label">Total</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{submissions.filter(s => !s.read).length}</span>
                    <span className="stat-label">Não Lidos</span>
                </div>
            </div>

            <div className="submissions-list">
                {submissions.map((submission) => (
                    <div key={submission.id} className={`submission-card ${submission.read ? 'read' : 'unread'}`}>
                        <div className="submission-header">
                            <div className="submission-info">
                                <h3 className="submission-name">{submission.name}</h3>
                                <span className="submission-date">{formatDate(submission.timestamp)}</span>
                            </div>
                            <div className="submission-actions">
                                <button
                                    onClick={() => toggleRead(submission.id)}
                                    className="btn-icon"
                                    title={submission.read ? 'Marcar como não lido' : 'Marcar como lido'}
                                >
                                    {submission.read ? '📭' : '📬'}
                                </button>
                                <button
                                    onClick={() => handleDelete(submission.id)}
                                    className="btn-icon btn-danger"
                                    title="Excluir"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        <div className="submission-details">
                            <p className="submission-field">
                                <strong>Email:</strong>
                                <a href={`mailto:${submission.email}`}>{submission.email}</a>
                            </p>
                            <p className="submission-field">
                                <strong>Telefone:</strong>
                                <a href={`tel:${submission.phone}`}>{submission.phone}</a>
                            </p>
                            <p className="submission-field">
                                <strong>Mensagem:</strong>
                                <span className="submission-message">{submission.message}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Submissions;
