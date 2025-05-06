import { useState } from 'react';
import { IEpic } from '../types/types';
import { useEpicId } from './useEpicId';
import { INITIAL_EPICS } from '../constants/mock-data';

export const useEpic = () => {
    const { getNextEpicId } = useEpicId();
    const [epics, setEpics] = useState<IEpic[]>(INITIAL_EPICS);

    const handleAddEpic = () => {
        const newEpic: IEpic = {
            id: `${getNextEpicId()}`,
            title: 'Новый эпик',
            description: '',
            startDate: '',
            endDate: '',
            color: '#e3e3e3'
        };
        
        setEpics(prev => [...prev, newEpic]);
        return newEpic;
    };

    const handleUpdateEpic = (epicId: string, updates: Partial<IEpic>) => {
        setEpics(prev => prev.map(epic => 
            epic.id === epicId ? { ...epic, ...updates } : epic
        ));
    };

    const handleDeleteEpic = (epicId: string) => {
        setEpics(prev => prev.filter(epic => epic.id !== epicId));
    };

    const getEpicById = (epicId: string) => {
        return epics.find(epic => epic.id === epicId);
    };

    return {
        epics,
        handleAddEpic,
        handleUpdateEpic,
        handleDeleteEpic,
        getEpicById
    };
}; 