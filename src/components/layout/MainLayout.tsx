import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background pb-20 pt-16">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-6">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};

export default MainLayout;
