import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { Bell, Settings, Menu, Download } from 'lucide-react';
import { useUI } from '../../store/UIContext';
import { useAuth } from '../../store/AuthContext';

interface HeaderProps {
    onMenuClick: () => void;
    photoUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, photoUrl }) => {
    const { openModal } = useUI();
    const { user } = useAuth();
    const initials = user?.email?.substring(0, 2).toUpperCase() || 'JD';
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 z-50">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-90 text-gray-600"
                >
                    <Menu size={24} />
                </button>
                <img src={logo} alt="MyPlan" className="h-8 w-auto object-contain" />
                <h1 className="text-xl font-black text-primary tracking-tighter italic hidden sm:block">MyPlan</h1>
            </div>

            <div className="flex items-center gap-1">
                {deferredPrompt && (
                    <button
                        onClick={handleInstallClick}
                        className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-xl text-xs font-bold mr-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 animate-in fade-in zoom-in"
                    >
                        <Download size={14} />
                        <span className="hidden sm:inline">Install App</span>
                        <span className="sm:hidden">Install</span>
                    </button>
                )}
                <button
                    onClick={() => openModal('notifications')}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500 relative"
                >
                    <Bell size={22} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                </button>
                <button
                    onClick={() => openModal('settings')}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500"
                >
                    <Settings size={22} />
                </button>
                <button
                    onClick={() => openModal('profile')}
                    className="ml-1 p-0.5 border-2 border-primary/10 rounded-full hover:border-primary transition-all active:scale-95 overflow-hidden"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary font-black text-xs italic overflow-hidden">
                        {photoUrl ? (
                            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Header;
