// Simple routing wrapper without React Router for now
// Will work with manual URL navigation

import React from 'react';
import { AuthProvider } from './contexts/AuthContext';

// Import portfolio components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProjectsCarousel from './components/ProjectsCarousel';
import EventsAwards from './components/EventsAwards';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import EventDetail from './components/EventDetail';

// Import admin components
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import { ProtectedRoute } from './contexts/AuthContext';

function AppContent() {
    const path = window.location.pathname;

    // Admin routes
    if (path === '/admin/login') {
        return <Login />;
    }

    if (path === '/admin' || path.startsWith('/admin/')) {
        return (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        );
    }

    // Project detail page
    if (path.startsWith('/projeto/')) {
        const projectId = path.split('/projeto/')[1];
        return (
            <div className="app">
                <Navbar activeSection="projects" />
                <ProjectDetail projectId={projectId} />
            </div>
        );
    }

    // Event detail page
    if (path.startsWith('/evento/')) {
        const eventId = path.split('/evento/')[1];
        return (
            <div className="app">
                <Navbar activeSection="events" />
                <EventDetail eventId={eventId} />
            </div>
        );
    }

    // Portfolio (default)
    return (
        <div className="app">
            <Navbar activeSection="home" />
            <main>
                <Hero />
                <About />
                <ProjectsCarousel />
                <EventsAwards />
            </main>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
