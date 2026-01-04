import React, { createContext, useContext, useState } from 'react';

type ModalType = 'project' | 'task' | 'transaction' | 'event' | 'notifications' | 'settings' | 'profile' | 'post' | 'note' | 'steps' | 'sleep' | 'food' | null;

interface UIContextType {
    activeModal: ModalType;
    openModal: (type: ModalType) => void;
    closeModal: () => void;
    deferredPrompt: any;
    setDeferredPrompt: (prompt: any) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    const openModal = (type: ModalType) => setActiveModal(type);
    const closeModal = () => setActiveModal(null);

    return (
        <UIContext.Provider value={{ activeModal, openModal, closeModal, deferredPrompt, setDeferredPrompt }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};
