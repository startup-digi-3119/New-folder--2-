import React, { useState, useEffect } from 'react';
import {
    Bell,
    Camera
} from 'lucide-react';
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
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { activeModal, closeModal } = useUI();
    const { user, signOut, updatePassword } = useAuth();

    // Helper for local date string (YYYY-MM-DD)
    const getLocalDate = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().split('T')[0];
    };

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('General');
    const [date, setDate] = useState(getLocalDate());
    const [time, setTime] = useState('09:00');
    const [stepsValue, setStepsValue] = useState('');
    const [sleepValue, setSleepValue] = useState('');
    const [foodValue, setFoodValue] = useState('');
    const [foodCalories, setFoodCalories] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [projectId, setProjectId] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [duration, setDuration] = useState('');

    const handleSignOut = async () => {
        await signOut();
        closeModal();
    };

    // Fetch initial data
    // Fetch initial data
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const [projRes, profRes, notifRes] = await Promise.all([
                    neon.query('SELECT * FROM projects WHERE user_id = $1', [user.id]),
                    neon.from('profiles').select('*'),
                    neon.from('notifications').select('*')
                ]);

                setProjects(projRes.rows || []);

                if (profRes.data) {
                    const userProf = profRes.data.find((p: any) => p.user_id === user.id);
                    if (userProf) {
                        setFullName(userProf.full_name || '');
                        setBio(userProf.bio || '');
                        setPhotoUrl(userProf.photo_url || '');
                    }
                }

                if (notifRes.data) {
                    setNotifications(notifRes.data.filter((n: any) => n.user_id === user.id));
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
            }
        };
        fetchData();
    }, [user, activeModal]);

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
            window.location.reload();
        } catch (err: any) {
            console.error('Error:', err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await neon.from('tasks').insert({
                user_id: user.id,
                project_id: projectId ? Number(projectId) : null,
                title,
                description,
                assigned_to: assignedTo || null,
                status: 'todo',
                priority: 'medium',
                due_date: date ? `${date}T${time}:00` : null
            });
            if (error) throw error;
            closeModal();
            setTitle('');
            setDescription('');
            setAssignedTo('');
            setProjectId(null);
            window.location.reload();
        } catch (err: any) {
            console.error('Error:', err);
            alert(err.message);
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
            console.error('Error:', err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSteps = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const targetDate = date || getLocalDate();
            // Convert hours to minutes for storage
            const activeMinutes = Math.round((Number(duration) || 0) * 60);

            const { error } = await neon.from('health_stats').insert({
                user_id: user.id,
                date: targetDate,
                steps: Number(stepsValue),
                active_minutes: activeMinutes
            });
            if (error && error.message.includes('unique constraint')) {
                await neon.from('health_stats').update({
                    steps: Number(stepsValue),
                    active_minutes: activeMinutes
                }).match({ user_id: user.id, date: targetDate });
            } else if (error) throw error;
            closeModal();
            setStepsValue('');
            setDuration('');
            window.location.reload();
        } catch (err: any) {
            console.error('Error:', err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSleep = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const targetDate = date || getLocalDate();
            const sleepMinutes = Math.round(Number(sleepValue) * 60);
            const { error } = await neon.from('health_stats').insert({
                user_id: user.id,
                date: targetDate,
                sleep_minutes: sleepMinutes
            });
            if (error && error.message.includes('unique constraint')) {
                await neon.from('health_stats').update({ sleep_minutes: sleepMinutes }).match({ user_id: user.id, date: targetDate });
            } else if (error) throw error;
            closeModal();
            setSleepValue('');
            window.location.reload();
        } catch (err: any) {
            console.error('Error:', err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFood = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const targetDate = date || getLocalDate();
            const { error } = await neon.from('health_stats').insert({
                user_id: user.id,
                date: targetDate,
                calories_consumed: Number(foodCalories)
            });
            if (error && error.message.includes('unique constraint')) {
                const existing = await neon.query('SELECT calories_consumed FROM health_stats WHERE user_id = $1 AND date = $2', [user.id, targetDate]);
                const newTotal = (existing.rows[0]?.calories_consumed || 0) + Number(foodCalories);
                await neon.from('health_stats').update({ calories_consumed: newTotal }).match({ user_id: user.id, date: targetDate });
            } else if (error) throw error;
            closeModal();
            setFoodValue('');
            setFoodCalories('');
            window.location.reload();
        } catch (err: any) {
            console.error('Error:', err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetFitness = async () => {
        if (!user || !window.confirm('Reset all fitness data for today?')) return;
        setLoading(true);
        try {
            const today = getLocalDate();
            // 1. Reset health_stats for today in local time
            await neon.from('health_stats').update({
                steps: 0,
                calories_consumed: 0,
                sleep_minutes: 0,
                active_minutes: 0
            }).match({ user_id: user.id, date: today });

            // 2. Robustly delete workouts created in the last 24 hours (or better, since local midnight)
            // We use a broader range or a targeted query to catch timezone discrepancies
            await neon.query(`
                DELETE FROM workouts 
                WHERE user_id = $1 
                AND (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::date = $2
            `, [user.id, today]);

            // Also deactivate active workouts
            await neon.from('workouts').update({ status: 'cancelled' }).match({ user_id: user.id, status: 'active' });

            closeModal();
            window.location.reload();
        } catch (err) {
            console.error('Error resetting fitness:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const { error: insertError } = await neon.from('profiles').insert({
                user_id: user.id,
                full_name: fullName,
                photo_url: photoUrl,
                bio: bio
            });
            if (insertError) {
                await neon.from('profiles').update({
                    full_name: fullName,
                    photo_url: photoUrl,
                    bio: bio
                }).match({ user_id: user.id });
            }
            closeModal();
            window.location.reload();
        } catch (err: any) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (re) => setPhotoUrl(re.target?.result as string);
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword) return;
        setLoading(true);
        try {
            if (updatePassword) {
                await updatePassword(newPassword);
                alert('Password updated successfully!');
            } else {
                alert('Password update feature coming soon!');
            }
            setNewPassword('');
            closeModal();
        } catch (err: any) {
            alert(`Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await neon.from('notes').insert({
                user_id: user.id,
                title,
                content: description,
                favorite: false
            });
            if (error) throw error;
            closeModal();
            setTitle('');
            setDescription('');
            window.location.reload();
        } catch (err: any) {
            console.error('Error:', err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
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
        } catch (err: any) {
            console.error('Error:', err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header
                onMenuClick={() => setIsSidebarOpen(true)}
                photoUrl={photoUrl}
            />

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
                title="Create Task"
            >
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Task Name</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-gray-900"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Assign To</label>
                        <input
                            type="text"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            placeholder="Person name"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select Project</label>
                        <select
                            value={projectId || ''}
                            onChange={(e) => setProjectId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            required
                        >
                            <option value="" disabled>Choose a project...</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Creating...' : 'Add Task'}
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={activeModal === 'notifications'}
                onClose={closeModal}
                title="Notifications"
            >
                <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar py-2">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif.id} className={`p-4 rounded-3xl border border-gray-100 transition-all ${notif.read ? 'bg-white opacity-60' : 'bg-primary/5 border-primary/10'}`}>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <Bell size={16} className={notif.read ? 'text-gray-400' : 'text-primary'} />
                                    </div>
                                    <div className="space-y-1">
                                        <h5 className="font-bold text-gray-900 leading-tight">{notif.title}</h5>
                                        <p className="text-xs text-gray-500 font-medium">{notif.message}</p>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                            {new Date(notif.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <Bell size={48} className="text-gray-100" />
                            <p className="text-sm font-bold text-gray-400 italic">No new notifications</p>
                        </div>
                    )}
                    <Button variant="ghost" fullWidth onClick={closeModal} className="text-primary font-black uppercase italic tracking-widest text-xs h-14">Close</Button>
                </div>
            </Modal>

            <Modal
                isOpen={activeModal === 'settings'}
                onClose={closeModal}
                title="Settings"
            >
                <div className="space-y-4 py-2">
                    <div className="p-4 bg-slate-50 rounded-3xl border border-gray-100 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Logged in as</p>
                        <p className="font-bold text-gray-900">{user?.email}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Change Password</label>
                        <form onSubmit={handleUpdatePassword} className="flex gap-2">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm"
                            />
                            <Button type="submit" size="sm" disabled={loading || !newPassword}>Update</Button>
                        </form>
                    </div>

                    <div className="pt-2 space-y-2">
                        {['Notification Prefs', 'Theme & Appearance', 'Connected Devices'].map(item => (
                            <button
                                key={item}
                                onClick={() => alert(`${item} is coming soon!`)}
                                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors group border border-gray-50"
                            >
                                <span className="font-bold text-sm text-gray-700">{item}</span>
                                <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <Button variant="ghost" fullWidth onClick={handleSignOut} className="text-red-500 font-black uppercase italic tracking-widest text-xs h-14">Sign Out</Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={activeModal === 'profile'}
                onClose={closeModal}
                title="User Profile"
            >
                <form onSubmit={handleUpdateProfile} className="space-y-6 pt-2 pb-4">
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="w-full h-full rounded-full overflow-hidden bg-primary/10 border-4 border-white shadow-2xl flex items-center justify-center">
                            {photoUrl ? (
                                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black text-primary italic uppercase">{user?.email?.[0]}</span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handlePhotoUpload}
                            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform"
                        >
                            <Camera size={18} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Edit Name"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bio / Status</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium h-24 resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" fullWidth disabled={loading}>
                            {loading ? 'Updating...' : 'Save Profile Changes'}
                        </Button>
                        <Button variant="ghost" fullWidth onClick={handleSignOut} className="text-red-500 font-black uppercase italic tracking-widest text-xs h-12 mt-2">Sign Out</Button>
                    </div>
                </form>
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
                            {(type === 'income'
                                ? ['Salary', 'HM', 'Business', 'Loan', 'Freelance']
                                : ['Food', 'Transport', 'Rent', 'Shopping', 'Health', 'Investment', 'Other']
                            ).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            required
                        />
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
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            required
                        />
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Scheduling...' : 'Set Reminder'}
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

            <Modal
                isOpen={activeModal === 'steps'}
                onClose={closeModal}
                title="Record Steps"
            >
                <form onSubmit={handleCreateSteps} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Total Steps Today</label>
                        <input
                            type="number"
                            value={stepsValue}
                            onChange={(e) => setStepsValue(e.target.value)}
                            placeholder="e.g., 10000"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-2xl"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Duration (Hours)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="e.g., 1.5"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-lg"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            />
                        </div>
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Recording...' : 'Update Steps'}
                    </Button>
                    <Button variant="ghost" fullWidth onClick={handleResetFitness} className="text-red-500 font-black uppercase italic tracking-widest text-xs h-12 mt-2">Reset Today's Stats</Button>
                </form>
            </Modal>

            <Modal
                isOpen={activeModal === 'sleep'}
                onClose={closeModal}
                title="Record Sleep"
            >
                <form onSubmit={handleCreateSleep} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Sleep Duration (Hours)</label>
                        <input
                            type="number"
                            step="0.5"
                            value={sleepValue}
                            onChange={(e) => setSleepValue(e.target.value)}
                            placeholder="e.g., 8"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-2xl"
                            required
                        />
                        <p className="text-[10px] text-gray-400 mt-1 ml-1 font-medium">Enter hours (e.g., 7.5)</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            />
                        </div>
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Recording...' : 'Update Sleep'}
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={activeModal === 'food'}
                onClose={closeModal}
                title="Log Food"
            >
                <form onSubmit={handleCreateFood} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Item Description</label>
                        <input
                            type="text"
                            value={foodValue}
                            onChange={(e) => setFoodValue(e.target.value)}
                            placeholder="e.g., Chicken Salad"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Estimated Calories (kcal)</label>
                        <input
                            type="number"
                            value={foodCalories}
                            onChange={(e) => setFoodCalories(e.target.value)}
                            placeholder="e.g., 350"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-2xl"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs"
                            />
                        </div>
                    </div>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Logging...' : 'Add Food'}
                    </Button>
                </form>
            </Modal>

            <BottomNav />
        </div >
    );
};

export default MainLayout;
