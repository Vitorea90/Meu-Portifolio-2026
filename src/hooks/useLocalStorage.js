import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            // Dispatch custom event for same-window updates
            window.dispatchEvent(new Event('portfolioDataUpdated'));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
            if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                alert('⚠️ Limite de memória atingido! Sua alteração não foi salva. Tente carregar fotos menores ou remover algumas imagens antigas.');
            } else {
                alert('Erro ao salvar no navegador: ' + error.message);
            }
        }
    }, [key, value]);

    return [value, setValue];
};

// Specific hooks for different data types
import { publications, eventsAndAwards, featuredProjects, skills } from '../data/portfolio-data';

export const useSubmissions = () => useLocalStorage('portfolio_submissions', []);
export const useSkills = () => useLocalStorage('portfolio_skills', skills || []);
export const useProjects = () => useLocalStorage('portfolio_projects', featuredProjects || []);
export const useEvents = () => useLocalStorage('portfolio_events', eventsAndAwards || []);
