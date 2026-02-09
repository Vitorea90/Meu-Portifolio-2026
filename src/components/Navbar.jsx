import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = ({ activeSection: initialActive }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [active, setActive] = useState(initialActive || 'home');

    // Update active state based on prop changes (for non-home pages)
    useEffect(() => {
        if (initialActive) setActive(initialActive);
    }, [initialActive]);

    const navItems = [
        { id: 'home', label: 'Início' },
        { id: 'about', label: 'Sobre' },
        { id: 'projects', label: 'Projetos' },
        { id: 'events', label: 'Eventos' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setScrolled(scrollPosition > 50);

            // Logic to determine active section only if we are on the main page
            if (initialActive === 'home' || !initialActive) {
                const sections = navItems.map(item => document.getElementById(item.id));

                for (const section of sections) {
                    if (section) {
                        const top = section.offsetTop - 100; // Offset for navbar height
                        const bottom = top + section.offsetHeight;

                        if (scrollPosition >= top && scrollPosition < bottom) {
                            setActive(section.id);
                            break;
                        }
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Call once on mount to set initial state
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [initialActive]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
            setActive(id); // Optimistic update
        }
    };

    const handleNavClick = (e, id) => {
        e.preventDefault();

        // If we're already on the home page, just scroll
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            scrollToSection(id);
        } else {
            // Otherwise, navigate to home with the hash
            window.location.href = `/#${id}`;
        }
    };

    const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';

    return (
        <motion.nav
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container navbar-content">
                <motion.div
                    className="navbar-logo"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <a
                        href={isHome ? "/#home" : `/#${active}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        onClick={(e) => {
                            if (isHome) {
                                e.preventDefault();
                                scrollToSection('home');
                            }
                        }}
                    >
                        <span className="logo-text">Portfolio</span>
                    </a>
                </motion.div>

                {/* Only show menu items on Home page */}
                {isHome && (
                    <>
                        {/* Desktop Menu */}
                        <ul className="navbar-menu desktop-menu">
                            {navItems.map((item) => (
                                <motion.li
                                    key={item.id}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <a
                                        href={`/#${item.id}`}
                                        className={active === item.id ? 'active' : ''}
                                        onClick={(e) => handleNavClick(e, item.id)}
                                    >
                                        {item.label}
                                        {active === item.id && (
                                            <motion.div
                                                className="active-indicator"
                                                layoutId="activeIndicator"
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Mobile Menu Button */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span className={mobileMenuOpen ? 'open' : ''}></span>
                            <span className={mobileMenuOpen ? 'open' : ''}></span>
                            <span className={mobileMenuOpen ? 'open' : ''}></span>
                        </button>
                    </>
                )}
            </div>

            {/* Mobile Menu - Only on Home */}
            {isHome && mobileMenuOpen && (
                <motion.div
                    className="mobile-menu"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ul>
                        {navItems.map((item, index) => (
                            <motion.li
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <a
                                    href={`/#${item.id}`}
                                    className={active === item.id ? 'active' : ''}
                                    onClick={(e) => handleNavClick(e, item.id)}
                                >
                                    {item.label}
                                </a>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
