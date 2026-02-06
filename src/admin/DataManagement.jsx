import React, { useRef } from 'react';

const DataManagement = () => {
    const fileInputRef = useRef(null);

    const handleExport = () => {
        const data = {
            events: JSON.parse(localStorage.getItem('portfolio_events') || '[]'),
            projects: JSON.parse(localStorage.getItem('portfolio_projects') || '[]'),
            skills: JSON.parse(localStorage.getItem('portfolio_skills') || '[]'),
            submissions: JSON.parse(localStorage.getItem('portfolio_submissions') || '[]')
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (window.confirm('Isso substituirá todos os dados atuais. Deseja continuar?')) {
                    if (data.events) localStorage.setItem('portfolio_events', JSON.stringify(data.events));
                    if (data.projects) localStorage.setItem('portfolio_projects', JSON.stringify(data.projects));
                    if (data.skills) localStorage.setItem('portfolio_skills', JSON.stringify(data.skills));
                    if (data.submissions) localStorage.setItem('portfolio_submissions', JSON.stringify(data.submissions));

                    alert('Dados importados com sucesso! A página será recarregada.');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Erro ao importar dados:', error);
                alert('Erro ao ler o arquivo. Verifique se é um backup válido.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2 className="section-title">Gerenciamento de Dados</h2>
            </div>

            <div className="data-management-card" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>📤 Exportar Dados (Backup)</h3>
                    <p style={{ color: '#aaa', marginBottom: '1rem', lineHeight: '1.6' }}>
                        Baixe um arquivo contendo todos os seus projetos, eventos e habilidades.
                        Use isso para salvar suas alterações ou transferir dados do Localhost para o site ao vivo.
                    </p>
                    <button onClick={handleExport} className="btn btn-primary">
                        Baixar Backup
                    </button>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>📥 Importar Dados</h3>
                    <p style={{ color: '#aaa', marginBottom: '1rem', lineHeight: '1.6' }}>
                        Carregue um arquivo de backup para restaurar seus dados.
                        <strong>Atenção:</strong> Isso substituirá os dados atuais deste navegador.
                    </p>
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImport}
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="btn btn-secondary"
                        style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        Selecionar Arquivo e Importar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataManagement;
