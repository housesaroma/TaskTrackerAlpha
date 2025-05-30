import { useState } from 'react';

export const useCardId = () => {
    const [nextId, setNextId] = useState(12);

    const getNextId = () => {
        const currentId = nextId;
        setNextId(prev => prev + 1);
        return currentId;
    };

    return { getNextId };
}; 