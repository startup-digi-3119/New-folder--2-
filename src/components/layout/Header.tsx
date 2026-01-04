import React from 'react';
import { UserCircle, Bell, Settings, Menu } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-50">
            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600">
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-bold text-primary tracking-tight">MyPlan</h1>
            </div>

            <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500 relative">
                    <Bell size={24} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500">
                    <Settings size={24} />
                </button>
                <button className="ml-1 p-1 hover:bg-gray-50 rounded-full transition-colors text-gray-600">
                    <UserCircle size={32} />
                </button>
            </div>
        </header>
    );
};

export default Header;
