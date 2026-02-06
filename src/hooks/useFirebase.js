import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

/**
 * Hook para gerenciar dados no Firebase com fallback para LocalStorage e dado estático
 * @param {string} collectionName - Nome da coleção (ex: 'portfolio')
 * @param {string} docId - ID do documento (ex: 'projects')
 * @param {any} initialValue - Valor inicial estático
 */
export const useFirebaseData = (collectionName, docId, initialValue) => {
    const [data, setData] = useState(() => {
        // Inicializa com o que tiver no LocalStorage primeiro (para velocidade)
        const local = localStorage.getItem(`fb_cache_${docId}`);
        return local ? JSON.parse(local) : initialValue;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Escuta mudanças em tempo real no Firebase
        const unsub = onSnapshot(doc(db, collectionName, docId), (docSnap) => {
            if (docSnap.exists()) {
                const cloudData = docSnap.data().items || [];
                setData(cloudData);
                // Cache local para offline/velocidade
                localStorage.setItem(`fb_cache_${docId}`, JSON.stringify(cloudData));
            } else {
                // Se documento não existe na nuvem, inicializa com o estático
                setData(initialValue);
            }
            setLoading(false);
        }, (error) => {
            console.error(`Erro ao ler ${docId} do Firebase:`, error);
            setLoading(false);
        });

        return () => unsub();
    }, [collectionName, docId]);

    // Função para salvar dados na nuvem
    const saveData = async (newData) => {
        try {
            await setDoc(doc(db, collectionName, docId), {
                items: newData,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error(`Erro ao salvar ${docId} no Firebase:`, error);
            // Fallback: se falhar o Firebase (ex: sem internet ou config errada), salva no local
            localStorage.setItem(`fb_cache_${docId}`, JSON.stringify(newData));
            alert("⚠️ Erro ao salvar na nuvem. Os dados foram salvos apenas localmente.");
            return false;
        }
    };

    return [data, saveData, loading];
};

// Helpers específicos para facilitar a substituição
import { featuredProjects, eventsAndAwards, skills } from '../data/portfolio-data';

export const useFirebaseProjects = () => useFirebaseData('portfolio', 'projects', featuredProjects);
export const useFirebaseEvents = () => useFirebaseData('portfolio', 'events', eventsAndAwards);
export const useFirebaseSkills = () => useFirebaseData('portfolio', 'skills', skills);
