import React, { useRef, useState } from 'react';
import { useVercelProjects, useVercelEvents, useVercelSkills } from '../hooks/useVercel';

const DataManagement = () => {
    const fileInputRef = useRef(null);
    const [isInitializing, setIsInitializing] = useState(false);

    const [projects, setProjects] = useVercelProjects();
    const [events, setEvents] = useVercelEvents();
    const [skills, setSkills] = useVercelSkills();

    const handleExport = () => {
        const data = {
            events,
            projects,
            skills,
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

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (window.confirm('Isso substituirá todos os dados na nuvem (Vercel Postgres). Deseja continuar?')) {
                    if (data.projects) await setProjects(data.projects);
                    if (data.events) await setEvents(data.events);
                    if (data.skills) await setSkills(data.skills);

                    alert('Dados importados para a nuvem com sucesso! A página será recarregada.');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Erro ao importar dados:', error);
                alert('Erro ao ler o arquivo. Verifique se é um backup válido.');
            }
        };
        reader.readAsText(file);
    };

    const handleInitDB = async () => {
        if (!window.confirm('Deseja inicializar/atualizar as tabelas do banco de dados na Vercel?')) return;

        setIsInitializing(true);
        try {
            const response = await fetch('/api/init');
            const result = await response.json();
            if (response.ok) {
                alert('Banco de dados inicializado com sucesso!');
            } else {
                alert('Erro ao inicializar: ' + (result.error || 'Erro desconhecido. Você conectou o Postgres no painel da Vercel?'));
            }
        } catch (error) {
            alert('Erro de conexão: ' + error.message);
        } finally {
            setIsInitializing(false);
        }
    };

    const handleSyncFromLocal = async () => {
        try {
            // Import here to avoid issues if not needed
            const dataModule = await import('../data/portfolio-data');
            const localData = {
                projects: dataModule.featuredProjects,
                events: dataModule.eventsAndAwards,
                skills: dataModule.skills
            };

            if (window.confirm('Isso copiará todos os dados do arquivo local (portfolio-data.js) para o Vercel Postgres, substituindo os dados existentes na nuvem. Deseja continuar?')) {
                setIsInitializing(true);
                if (localData.projects) await setProjects(localData.projects);
                if (localData.events) await setEvents(localData.events);
                if (localData.skills) await setSkills(localData.skills);

                alert('Sincronização concluída com sucesso!');
            }
        } catch (error) {
            console.error('Erro na sincronização:', error);
            alert('Erro ao carregar dados locais: ' + error.message);
        } finally {
            setIsInitializing(false);
        }
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2 className="section-title">Gerenciamento de Nuvem (Vercel Postgres)</h2>
            </div>

            <div className="data-management-card" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '2rem'
            }}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>⚙️ Configuração do Banco</h3>
                <p style={{ color: '#aaa', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Se esta é a primeira vez usando o Vercel Postgres ou se você resetou o banco, use o botão abaixo para criar as tabelas necessárias.
                </p>
                <button
                    onClick={handleInitDB}
                    className="btn btn-secondary"
                    disabled={isInitializing}
                    style={{ background: '#333', borderColor: '#444', marginRight: '1rem' }}
                >
                    {isInitializing ? 'Processando...' : 'Re-inicializar Tabelas'}
                </button>
                <button
                    onClick={handleSyncFromLocal}
                    className="btn btn-primary"
                    disabled={isInitializing}
                >
                    {isInitializing ? 'Sincronizando...' : 'Sincronizar com Dados Locais'}
                </button>
            </div>
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
    );
};

export default DataManagement;
