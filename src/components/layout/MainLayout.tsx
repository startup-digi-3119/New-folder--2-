import React, { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import MobileSidebar from './MobileSidebar';
import { useUI } from '../../store/UIContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { neon } from '../../services/neon';
import { useAuth } from '../../store/AuthContext';

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { activeModal, closeModal } = useUI();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        closeModal();
    };

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('General');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('09:00');
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState<string | null>(null);
    const [postLocation, setPostLocation] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await neon.from('projects').insert({
                user_id: user.id,
                title,
                description,
                status: 'active'
            });
            if (error) throw error;
            closeModal();
            setTitle('');
            setDescription('');
            window.location.reload(); // Quick refresh to show new data
        } catch (err) {
            console.error('Error creating project:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            // For simplicity, we'll try to find an active project or just insert without one if allowed
            // Real implementation would need project selection
            const { error } = await neon.from('tasks').insert({
                user_id: user.id,
                title,
                description,
                status: 'todo',
                priority: 'medium'
            });
            if (error) throw error;
            closeModal();
            setTitle('');
            setDescription('');
            window.location.reload();
        } catch (err) {
            console.error('Error creating task:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await neon.from('transactions').insert({
                user_id: user.id,
                amount: Number(amount),
                type,
                category,
                description: title,
                date
            });
            if (error) throw error;
            closeModal();
            setAmount('');
            setTitle('');
            window.location.reload();
        } catch (err: any) {
            console.error('Error creating transaction:', err);
            alert(`Failed to add transaction: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            // We'll treat calendar events as tasks for now or just log them
            const { error } = await neon.from('tasks').insert({
                user_id: user.id,
                title,
                description: `Event: ${description}`,
                status: 'todo',
                priority: 'high',
                due_date: `${date}T${time}:00`
            });
            if (error) throw error;
            closeModal();
            setTitle('');
            setDescription('');
            window.location.reload();
        } catch (err) {
            console.error('Error creating event:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async () => {
        // ...Existing note logic (simulated for now as per previous version)
        console.log('Creating note:', { title, description });
        await new Promise(resolve => setTimeout(resolve, 500));
        closeModal();
        setTitle('');
        setDescription('');
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await neon.from('posts').insert({
                user_id: user.id,
                content: postContent,
                image: postImage,
                location: postLocation,
                type: 'Update',
                likes: 0,
                comments: 0
            });
            if (error) throw error;
            closeModal();
            setPostContent('');
            setPostImage(null);
            setPostLocation(null);
            window.location.reload();
        } catch (err: any) {
            console.error('Error creating post:', err);
            alert(`Failed to create post: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectImage = () => {
        const url = window.prompt("Enter image URL (mocking file upload for PWA):");
        if (url) setPostImage(url);
    };

    const handleGetLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setPostLocation(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
            });
        } else {
            alert("Geolocation not supported");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />

            <MobileSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="pt-16 pb-24 px-4 max-w-lg mx-auto min-h-screen">
                {children}
            </main>

            {/* Global Modals */}
            <Modal
                isOpen={activeModal === 'project'}
                onClose={closeModal}
                title="New Project"
            >
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Project Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., E-commerce Redesign"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this project about?"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium h-32"
                        />
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Creating...' : 'Launch Project'}
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={activeModal === 'task'}
                onClose={closeModal}
                title="Quick Task"
            >
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Task Name</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Update logo assets"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            required
                        />
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Adding...' : 'Add to Inbox'}
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={activeModal === 'notifications'}
                onClose={closeModal}
                title="Notifications"
            >
                <div className="space-y-4 py-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">AI</div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Workout Plan Ready!</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">2 minutes ago</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex items-center gap-4 opacity-50">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 font-black">S</div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">System Update Complete</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">1 hour ago</p>
                        </div>
                    </div>
                    <Button variant="ghost" fullWidth onClick={closeModal} className="text-primary font-black uppercase italic tracking-widest text-xs">Mark all as read</Button>
                </div>
            </Modal>

            <Modal
                isOpen={activeModal === 'settings'}
                onClose={closeModal}
                title="Settings"
            >
                <div className="space-y-2 py-2">
                    {['Account Security', 'Notification Prefs', 'Theme & Appearance', 'Connected Devices'].map(item => (
                        <button
                            key={item}
                            onClick={() => alert(`${item} is coming soon in the next update!`)}
                            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors group"
                        >
                            <span className="font-bold text-gray-700">{item}</span>
                            <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    ))}
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <Button variant="ghost" fullWidth onClick={handleSignOut} className="text-red-500 font-black uppercase italic tracking-widest text-xs">Sign Out</Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={activeModal === 'profile'}
                onClose={closeModal}
                title="User Profile"
            >
                <div className="text-center py-6 space-y-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center text-3xl font-black text-primary italic border-4 border-white shadow-xl">
                        {user?.email?.substring(0, 2).toUpperCase() || 'JD'}
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-gray-900 tracking-tighter italic">{user?.email?.split('@')[0]}</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">{user?.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                        <div className="p-4 bg-slate-50 rounded-3xl border border-gray-100">
                            <p className="text-2xl font-black text-primary italic leading-none">12</p>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Workouts</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-3xl border border-gray-100">
                            <p className="text-2xl font-black text-emerald-500 italic leading-none">5</p>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Projects</p>
                        </div>
                    </div>
                    <Button fullWidth onClick={() => alert('Profile editing coming soon!')} className="mt-4">Edit Profile</Button>
                </div>
            </Modal>

            <Modal
                isOpen={activeModal === 'transaction'}
                onClose={closeModal}
                title="New Transaction"
            >
                <form onSubmit={handleCreateTransaction} className="space-y-4">
                    <div className="flex bg-gray-100 p-1 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'}`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'income' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400'}`}
                        >
                            Income
                        </button>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-2xl"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                        >
                            {['General', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Investment'].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Grocery Shopping"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            required
                        />
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Recording...' : 'Add Transaction'}
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={activeModal === 'event'}
                onClose={closeModal}
                title="Schedule Event"
            >
                <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Name</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Team Sync"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            required
                        />
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Scheduling...' : 'Set Reminder'}
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={activeModal === 'post'}
                onClose={closeModal}
                title="Create Post"
            >
                <form onSubmit={handleCreatePost} className="space-y-4">
                    <div className="flex items-center gap-3 p-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black italic">
                            {user?.email?.substring(0, 2).toUpperCase() || 'JD'}
                        </div>
                        <span className="font-bold text-gray-900">{user?.email?.split('@')[0]}</span>
                    </div>
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What's on your mind? Share your progress..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium h-40 resize-none"
                        required
                    />
                    {postImage && (
                        <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100">
                            <img src={postImage} alt="Post preview" className="w-full h-full object-cover" />
                            <button onClick={() => setPostImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">✕</button>
                        </div>
                    )}
                    {postLocation && (
                        <div className="text-[10px] font-black uppercase text-primary bg-primary/5 p-2 rounded-xl inline-block px-3 italic tracking-widest">
                            📍 {postLocation}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button type="button" onClick={handleSelectImage} variant="ghost" className="flex-1 bg-gray-50 text-gray-400 text-xs">📷 Add Photo</Button>
                        <Button type="button" onClick={handleGetLocation} variant="ghost" className="flex-1 bg-gray-50 text-gray-400 text-xs">📍 Location</Button>
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Posting...' : 'Post to Feed'}
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={activeModal === 'note'}
                onClose={closeModal}
                title="New Note"
            >
                <form onSubmit={handleCreateNote} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Content</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write something..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium h-48 resize-none"
                            required
                        />
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Saving...' : 'Save Note'}
                    </Button>
                </form>
            </Modal>

            <BottomNav />
        </div>
    );
};

export default MainLayout;
