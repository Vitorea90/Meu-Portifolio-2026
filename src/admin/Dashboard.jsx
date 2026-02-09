import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Submissions from './Submissions';
import Skills from './Skills';
import Projects from './Projects';
import Events from './Events';
import DataManagement from './DataManagement';
import './Dashboard.css';

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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Vitor.Dev</h2>
                </div>

                <nav className="sidebar-nav">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setMobileMenuOpen(false);
                            }}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                            ☰
                        </button>
                        <h1 className="page-title">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h1>
                    </div>

                    <div className="header-actions">
                        <a href="/" className="view-site-btn" target="_blank" rel="noopener noreferrer">
                            <span>👁️</span> Ver Site
                        </a>
                    </div>
                </header>

                <div className="dashboard-content">
                    {activeTab === 'submissions' && <Submissions />}
                    {activeTab === 'skills' && <Skills />}
                    {activeTab === 'projects' && <Projects />}
                    {activeTab === 'events' && <Events />}
                    {activeTab === 'data' && <DataManagement />}
                </div>
            </main>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 40
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
