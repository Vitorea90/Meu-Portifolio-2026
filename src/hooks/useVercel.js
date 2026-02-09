import { useState, useEffect } from 'react';
import { featuredProjects, eventsAndAwards, skills, publications } from '../data/portfolio-data';

// Global flag to track if API is offline to avoid repeated console spam and delays
let apiOffline = false;

/**
 * Hook to manage data via Vercel Postgres API with fallback to static data
 * @param {string} type - DataType (projects, events, skills)
 * @param {any} initialValue - Default static data
 */
export const useVercelData = (type, initialValue) => {
    const [data, setData] = useState(initialValue);
    const [loading, setLoading] = useState(!apiOffline); // Only show loading if we don't know it's offline

    useEffect(() => {
        if (apiOffline) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        const fetchData = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            try {
                const response = await fetch(`/api/data?type=${type}`, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const cloudData = await response.json();
                    if (isMounted && Array.isArray(cloudData) && cloudData.length > 0) {
                        setData(cloudData);
                    }
                } else if (response.status === 502 || response.status === 504) {
                    // 502/504 means the local proxy failed to connect to the backend
                    apiOffline = true;
                }
            } catch (error) {
                // Connection errors or timeouts
                apiOffline = true;
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [type]);

    const saveData = async (newData) => {
        if (apiOffline) return false;
        try {
            const response = await fetch(`/api/data?type=${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: newData }),
            });
            if (response.ok) {
                setData(newData);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const upsertItem = async (item) => {
        if (apiOffline) return false;
        try {
            const response = await fetch(`/api/data?type=${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            return false;
        }
    };

    const deleteItem = async (id) => {
        if (apiOffline) return false;
        try {
            const response = await fetch(`/api/data?type=${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id }),
            });
            if (response.ok) {
                setData(prev => prev.filter(i => i.id != id));
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const controller = (newData) => saveData(newData);
    controller.save = saveData;
    controller.upsert = upsertItem;
    controller.delete = deleteItem;

    return [data, controller, loading];
};

export const useVercelItem = (type, id, initialData = []) => {
    const findInStatic = () => {
        // Search in primary list
        let item = initialData.find(i => String(i.id) === String(id));
        if (item) return item;

        // Search in all secondary lists
        const allLocal = [...featuredProjects, ...eventsAndAwards, ...(publications || [])];
        return allLocal.find(i => String(i.id) === String(id));
    };

    const staticItem = findInStatic();
    const [item, setItem] = useState(staticItem);
    const [loading, setLoading] = useState(!staticItem && !apiOffline);

    useEffect(() => {
        if (!id || apiOffline) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        const fetchItem = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            try {
                const response = await fetch(`/api/data?type=${type}&id=${id}`, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const cloudData = await response.json();
                    if (isMounted && cloudData && (cloudData.id || cloudData._id)) {
                        setItem(cloudData);
                    }
                } else if (response.status === 502 || response.status === 504) {
                    apiOffline = true;
                }
            } catch (error) {
                apiOffline = true;
                // Final lookup effort if fetch failed and we still don't have the item
                if (isMounted && !item) {
                    const retry = findInStatic();
                    if (retry) setItem(retry);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchItem();
        return () => { isMounted = false; };
    }, [type, id]);

    return [item, loading];
};

export const useVercelProjects = () => useVercelData('projects', featuredProjects);
export const useVercelProject = (id) => useVercelItem('projects', id, featuredProjects);
export const useVercelEvents = () => useVercelData('events', eventsAndAwards);
export const useVercelEvent = (id) => useVercelItem('events', id, eventsAndAwards);
export const useVercelSkills = () => useVercelData('skills', skills);
