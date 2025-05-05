import { useState } from 'react';

export const useEpicId = () => {
    const [nextId, setNextId] = useState(3);

    const getNextEpicId = () => {
        const currentId = nextId;
        setNextId(prev => prev + 1);
        return currentId;
    };

    return { getNextEpicId };
}; 