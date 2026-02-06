import React, { useRef } from 'react';
import { useFirebaseProjects, useFirebaseEvents, useFirebaseSkills } from '../hooks/useFirebase';

const DataManagement = () => {
    const fileInputRef = useRef(null);
    const [projects, setProjects] = useFirebaseProjects();
    const [events, setEvents] = useFirebaseEvents();
    const [skills, setSkills] = useFirebaseSkills();

    const handleExport = () => {
        const data = {
            events,
            projects,
            skills,
            submissions: JSON.parse(localStorage.getItem('portfolio_submissions') || '[]'),
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-firebase-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (window.confirm('Isso substituirá todos os dados na NUVEM (Firebase). Deseja continuar?')) {
                    if (data.events) await setEvents(data.events);
                    if (data.projects) await setProjects(data.projects);
                    if (data.skills) await setSkills(data.skills);

                    alert('Dados sincronizados com a nuvem com sucesso!');
                }
            } catch (error) {
                console.error('Erro ao importar dados:', error);
                alert('Erro ao ler o arquivo ou sincronizar com Firebase.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2 className="section-title">Nuvem & Backup</h2>
            </div>

            <div className="firebase-setup-guide" style={{
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                marginBottom: '2rem',
                color: 'white'
            }}>
                <h3 style={{ marginBottom: '1rem' }}>🔥 Configuração do Banco de Dados</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.9 }}>
                    O sistema está pronto para usar o Firebase. Para ativar a sincronização entre dispositivos, você precisa colar suas chaves em: <br />
                    <code>src/firebase/config.js</code>
                </p>
                <ol style={{ fontSize: '0.85rem', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                    <li>Vá ao <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>Console do Firebase</a></li>
                    <li>Crie um projeto e adicione um "Web App"</li>
                    <li>Copie o objeto <code>firebaseConfig</code></li>
                    <li>Crie um banco de dados <b>Firestore</b> em "Produção" ou "Modo Teste"</li>
                </ol>
            </div>

            <div className="data-management-card" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>📤 Exportar da Nuvem</h3>
                    <p style={{ color: '#aaa', marginBottom: '1rem', lineHeight: '1.6' }}>
                        Baixe uma cópia de segurança de tudo o que está salvo atualmente no Firebase.
                    </p>
                    <button onClick={handleExport} className="btn btn-primary">
                        Baixar Backup JSON
                    </button>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>📥 Sincronizar Arquivo com Nuvem</h3>
                    <p style={{ color: '#aaa', marginBottom: '1rem', lineHeight: '1.6' }}>
                        Suba um backup antigo para atualizar instantaneamente o banco de dados na nuvem.
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
                        Importar para o Firebase
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataManagement;
