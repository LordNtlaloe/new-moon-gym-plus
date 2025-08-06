'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GuestNameContextType {
    guestName: string;
    setGuestName: (name: string) => void;
    isGuest: boolean;
}

const GuestNameContext = createContext<GuestNameContextType | undefined>(undefined);

export const useGuestName = () => {
    const context = useContext(GuestNameContext);
    if (context === undefined) {
        throw new Error('useGuestName must be used within a GuestNameProvider');
    }
    return context;
};

interface GuestNameProviderProps {
    children: ReactNode;
}

export const GuestNameProvider = ({ children }: GuestNameProviderProps) => {
    const [guestName, setGuestNameState] = useState('');

    // Load guest name from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedGuestName = localStorage.getItem('stream-guest-name');
            if (savedGuestName) {
                setGuestNameState(savedGuestName);
            }
        }
    }, []);

    const setGuestName = (name: string) => {
        setGuestNameState(name);
        if (typeof window !== 'undefined') {
            if (name.trim()) {
                localStorage.setItem('stream-guest-name', name.trim());
            } else {
                localStorage.removeItem('stream-guest-name');
            }
        }
    };

    const isGuest = !!guestName && typeof window !== 'undefined' && !localStorage.getItem('clerk-user');

    return (
        <GuestNameContext.Provider value={{ guestName, setGuestName, isGuest }}>
            {children}
        </GuestNameContext.Provider>
    );
};

export default GuestNameProvider;