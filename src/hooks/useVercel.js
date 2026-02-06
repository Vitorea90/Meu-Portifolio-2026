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
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/data?type=${type}`);
                if (response.ok) {
                    const cloudData = await response.json();
                    if (isMounted && Array.isArray(cloudData) && cloudData.length > 0) {
                        setData(cloudData);
                    }
                }
            } catch (error) {
                console.error(`Error fetching ${type} from Vercel:`, error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
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

    const upsertItem = async (item) => {
        try {
            const response = await fetch(`/api/data?type=${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'upsert', item }),
            });

            if (response.ok) {
                setData(prev => {
                    const exists = prev.find(i => i.id == item.id);
                    if (exists) {
                        return prev.map(i => i.id == item.id ? { ...i, ...item } : i);
                    }
                    return [item, ...prev];
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error upserting ${type} item to Vercel:`, error);
            return false;
        }
    };

    const deleteItem = async (id) => {
        try {
            const response = await fetch(`/api/data?type=${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'delete', id }),
            });

            if (response.ok) {
                setData(prev => prev.filter(i => i.id != id));
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error deleting ${type} item from Vercel:`, error);
            return false;
        }
    };

    const controller = (newData) => saveData(newData);
    controller.save = saveData;
    controller.upsert = upsertItem;
    controller.delete = deleteItem;

    return [data, controller, loading];
};

export const useVercelProjects = () => useVercelData('projects', featuredProjects);
export const useVercelEvents = () => useVercelData('events', eventsAndAwards);
export const useVercelSkills = () => useVercelData('skills', skills);
