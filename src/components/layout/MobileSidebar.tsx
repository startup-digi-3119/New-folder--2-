import React from 'react';
import logo from '../../assets/logo.png';
import { NavLink } from 'react-router-dom';
import {
    X,
    Home,
    Activity,
    Briefcase,
    Users,
    Calendar,
    FileText,
    Wallet,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
    const { signOut } = useAuth();

    const menuItems = [
        { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Activity size={20} />, label: 'Fitness', path: '/fitness' },
        { icon: <Briefcase size={20} />, label: 'Projects', path: '/projects' },
        { icon: <Users size={20} />, label: 'Social Feed', path: '/social' },
        { icon: <Calendar size={20} />, label: 'Calendar', path: '/calendar' },
        { icon: <FileText size={20} />, label: 'Notes', path: '/notes' },
        { icon: <Wallet size={20} />, label: 'Financials', path: '/finance' },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="MyPlan" className="h-8 w-auto object-contain" />
                            <span className="text-xl font-black text-gray-900 italic tracking-tighter">MyPlan</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${isActive
                                        ? 'bg-primary/5 text-primary'
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`
                                }
                            >
                                {item.icon}
                                <span className="text-sm">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={() => {
                                signOut();
                                onClose();
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
                        >
                            <LogOut size={20} />
                            <span className="text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default MobileSidebar;
