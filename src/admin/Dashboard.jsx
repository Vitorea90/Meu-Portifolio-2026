import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Submissions from './Submissions';
import Skills from './Skills';
import Projects from './Projects';
import Events from './Events';
import DataManagement from './DataManagement';
import './Dashboard.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('submissions');
    const { logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Tem certeza que deseja sair?')) {
            logout();
            window.location.href = '/';
        }
    };

    const tabs = [
        { id: 'submissions', label: 'Formulários', icon: '📨' },
        { id: 'skills', label: 'Habilidades', icon: '💡' },
        { id: 'projects', label: 'Projetos', icon: '🚀' },
        { id: 'events', label: 'Eventos', icon: '🏆' },
        { id: 'data', label: 'Dados', icon: '💾' },
    ];

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Admin Panel</h2>
                    <p className="sidebar-subtitle">Gerenciamento</p>
                </div>

                <nav className="sidebar-nav">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{tab.icon}</span>
                            <span className="nav-label">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <span>🚪</span>
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1 className="page-title">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h1>
                    <a href="/" className="view-site-btn" target="_blank" rel="noopener noreferrer">
                        Ver Site
                    </a>
                </header>

                <div className="dashboard-content">
                    {activeTab === 'submissions' && <Submissions />}
                    {activeTab === 'skills' && <Skills />}
                    {activeTab === 'projects' && <Projects />}
                    {activeTab === 'events' && <Events />}
                    {activeTab === 'data' && <DataManagement />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
