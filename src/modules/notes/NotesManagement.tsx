import React, { useState } from 'react';
import {
    Plus,
    Search,
    Tag,
    FileText,
    Activity
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const NotesManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Notes</h2>
                    <p className="text-gray-500 font-medium tracking-tight">Capture your thoughts instantly.</p>
                </div>
                <Button variant="primary" size="sm" className="rounded-2xl px-6">
                    <Plus size={20} />
                </Button>
            </header>

            {/* Search */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search all notes..."
                        className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-10 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-primary transition-colors">
                    <Tag size={20} />
                </button>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                    <FileText size={40} className="text-gray-200" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">No notes found</h3>
                    <p className="text-sm text-gray-400 max-w-[200px]">Start by creating your first memo or notebook.</p>
                </div>
                <Button variant="primary" className="mt-4 rounded-xl px-8 h-12 font-black italic uppercase tracking-widest">
                    New Note
                </Button>
            </div>

            {/* Recent Categories */}
            <Card className="!p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-none text-white relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                        <Activity className="text-emerald-400" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Knowledge Base</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">Productivity Sync</h4>
                        <p className="text-xs text-gray-400">All your notes are encrypted and synced with your cloud workspace.</p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            </Card>
        </div>
    );
};

export default NotesManagement;
