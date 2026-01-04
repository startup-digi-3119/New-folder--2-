import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Button from '../../components/ui/Button';

const exercises: any[] = [];

const ExerciseLibrary: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Chest', 'Back', 'Legs', 'Cardio', 'Shoulders'];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Exercise Bank</h2>
                <p className="text-gray-500">Browse movements or create your own custom drills.</p>
            </header>

            <div className="space-y-4 sticky top-16 bg-white/80 backdrop-blur-sm z-10 py-2">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all border ${activeCategory === cat
                                ? 'bg-primary text-white border-primary shadow-md'
                                : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {exercises.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200 space-y-4">
                    <Search className="mx-auto text-gray-200" size={60} />
                    <div>
                        <p className="font-bold text-gray-800">Your library is currently empty</p>
                        <p className="text-xs text-gray-400 mt-1">Start by adding your first custom exercise.</p>
                    </div>
                    <Button variant="primary" className="rounded-xl px-8 font-black uppercase italic tracking-widest">
                        Add Exercise
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {/* Exercise cards would go here */}
                </div>
            )}
        </div>
    );
};

export default ExerciseLibrary;
