import React, { useState } from 'react';
import {
    Plus,
    Search,
    Tag,
    FileText,
    Activity,
    Trash2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// ... imports
import { useUI } from '../../store/UIContext';
import { useAuth } from '../../store/AuthContext';
import { neon } from '../../services/neon';

const NotesManagement: React.FC = () => {
    const { openModal } = useUI();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNote, setEditingNote] = useState<any | null>(null);

    const fetchNotes = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await neon.from('notes').select();
            if (error) throw error;
            setNotes(data || []);
        } catch (err) {
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchNotes();
    }, [user]);

    const handleDeleteNote = async (id: number) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await neon.from('notes').delete().match({ id });
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    const handleUpdateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await neon.from('notes').update({
                title: editingNote.title,
                content: editingNote.content
            }).match({ id: editingNote.id });
            setEditingNote(null);
            fetchNotes();
        } catch (err) {
            console.error('Error updating note:', err);
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Notes</h2>
                    <p className="text-gray-500 font-medium tracking-tight">Capture your thoughts instantly.</p>
                </div>
                <Button variant="primary" size="sm" className="rounded-2xl px-6" onClick={() => openModal('note')}>
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

            {/* Notes List */}
            {loading ? (
                <div className="flex justify-center p-12"><Activity className="animate-spin text-primary" size={32} /></div>
            ) : filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                        <FileText size={40} className="text-gray-200" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-900">No notes found</h3>
                        <p className="text-sm text-gray-400 max-w-[200px]">Start by creating your first memo or notebook.</p>
                    </div>
                    <Button variant="primary" className="mt-4 rounded-xl px-8 h-12 font-black italic uppercase tracking-widest" onClick={() => openModal('note')}>
                        New Note
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredNotes.map((note) => (
                        <Card
                            key={note.id}
                            onClick={() => setEditingNote(note)}
                            className="relative group hover:border-primary/20 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900">{note.title || 'Untitled Note'}</h4>
                                    <p className="text-sm text-gray-500 line-clamp-2">{note.content}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                    className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Note Editor Modal */}
            {editingNote && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg scale-in flex flex-col gap-4 !p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black italic tracking-tighter text-gray-900 uppercase">Edit Note</h3>
                            <button onClick={() => setEditingNote(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleUpdateNote} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                                <input
                                    type="text"
                                    value={editingNote.title}
                                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-gray-900"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Content</label>
                                <textarea
                                    value={editingNote.content}
                                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium h-64 resize-none"
                                    required
                                />
                            </div>
                            <Button type="submit" fullWidth>Save Changes</Button>
                        </form>
                    </Card>
                </div>
            )}

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
