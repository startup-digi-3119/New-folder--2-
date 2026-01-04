import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Activity, Briefcase, StickyNote, Plus } from 'lucide-react';
import { useUI } from '../../store/UIContext';

const BottomNav: React.FC = () => {
    const { openModal } = useUI();
    const navItems = [
        { icon: <Home size={24} />, label: 'Home', path: '/dashboard' },
        { icon: <Activity size={24} />, label: 'Fitness', path: '/fitness' },
        { icon: null, label: '', path: '', isFab: true },
        { icon: <Briefcase size={24} />, label: 'Projects', path: '/projects' },
        { icon: <StickyNote size={24} />, label: 'Notes', path: '/notes' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50 pb-safe">
            {navItems.map((item) => {
                if (item.isFab) {
                    return (
                        <button
                            key="fab"
                            onClick={() => openModal('task')}
                            className="absolute -top-6 bg-accent text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 z-50"
                        >
                            <Plus size={28} />
                        </button>
                    );
                }

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="text-[10px] font-medium">{item.label}</span>
                        <div className={`w-1 h-1 rounded-full bg-primary mt-0.5 transition-opacity duration-300 ${item.isFab ? 'hidden' : ''} opacity-0`}></div>
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default BottomNav;
