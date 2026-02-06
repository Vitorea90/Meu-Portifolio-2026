import { useState, useEffect } from 'react';
import { featuredProjects, eventsAndAwards, skills } from '../data/portfolio-data';

/**
 * Hook to manage data via Vercel Postgres API with fallback to static data
 * @param {string} type - DataType (projects, events, skills)
 * @param {any} initialValue - Default static data
 */
export const useVercelData = (type, initialValue) => {
    const [data, setData] = useState(initialValue);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/data?type=${type}`);
                if (response.ok) {
                    const cloudData = await response.json();
                    if (cloudData && cloudData.length > 0) {
                        setData(cloudData);
                    }
                }
            } catch (error) {
                console.error(`Error fetching ${type} from Vercel:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type]);

    const saveData = async (newData) => {
        try {
            const response = await fetch(`/api/data?type=${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: newData }),
            });

            if (response.ok) {
                setData(newData);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error saving ${type} to Vercel:`, error);
            return false;
        }
    };

    return [data, saveData, loading];
};

export const useVercelProjects = () => useVercelData('projects', featuredProjects);
export const useVercelEvents = () => useVercelData('events', eventsAndAwards);
export const useVercelSkills = () => useVercelData('skills', skills);
