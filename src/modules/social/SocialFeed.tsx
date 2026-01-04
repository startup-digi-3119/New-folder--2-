import React, { useState } from 'react';
import {
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    Plus,
    Users,
    Award,
    Activity
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useUI } from '../../store/UIContext';

const posts = [
    {
        id: 1,
        user: { name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?u=sarah', badge: 'Elite' },
        type: 'Workout',
        activity: 'Morning Run • 8.5 km',
        content: 'Feeling energized today! The new route by the river is amazing. 🏃‍♂️✨',
        stats: { calories: 450, time: '45m', pace: '5:18' },
        likes: 24,
        comments: 6,
        time: '2h ago',
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 2,
        user: { name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?u=alex', badge: 'Pro' },
        type: 'Achievement',
        activity: 'Goal Reached!',
        content: 'Finished the 30-day Hypertrophy Max challenge! Gains are real. 💪',
        stats: { sets: 120, weight: '+2kg', level: 15 },
        likes: 56,
        comments: 12,
        time: '5h ago',
        image: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?w=500&auto=format&fit=crop&q=60'
    }
];

const SocialFeed: React.FC = () => {
    const { openModal } = useUI();
    const [activeTab, setActiveTab] = useState('Explore');

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">Social</h2>
                    <p className="text-gray-500 font-medium tracking-tight">Connect with the community.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="rounded-2xl bg-white shadow-sm border border-gray-100" onClick={() => openModal('post')}>
                        <Plus size={20} className="text-primary" />
                    </Button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-100 sticky top-16 bg-background z-10 py-2">
                {['Following', 'Explore', 'Challenges'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-1 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-400'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>}
                    </button>
                ))}
            </div>

            {/* Main Feed */}
            <div className="space-y-6">
                {posts.map(post => (
                    <Card key={post.id} className="!p-0 overflow-hidden group">
                        {/* Post Header */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5">
                                    <img src={post.user.avatar} alt={post.user.name} className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <h4 className="font-bold text-gray-900 text-sm">{post.user.name}</h4>
                                        <span className="text-[8px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                            {post.user.badge}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.time}</p>
                                </div>
                            </div>
                            <button className="p-1 text-gray-300">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        {/* Activity Banner */}
                        <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
                            <div className="p-1 bg-white rounded-md shadow-sm">
                                <Activity size={12} className="text-emerald-500" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 tracking-tight">{post.activity}</span>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">{post.content}</p>

                            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 relative">
                                <img src={post.image} alt="post content" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>

                            {/* Stats Row */}
                            <div className="flex gap-4 p-3 bg-gray-50 rounded-2xl">
                                {Object.entries(post.stats).map(([k, v]) => (
                                    <div key={k} className="flex-1 text-center border-r last:border-none border-gray-200">
                                        <p className="text-[8px] font-black text-gray-400 uppercase">{k}</p>
                                        <p className="text-xs font-black text-gray-900">{v}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between p-4 border-t border-gray-50">
                            <div className="flex items-center gap-6">
                                <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart size={20} />
                                    <span className="text-xs font-bold">{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors">
                                    <MessageCircle size={20} />
                                    <span className="text-xs font-bold">{post.comments}</span>
                                </button>
                            </div>
                            <button className="text-gray-300 hover:text-gray-600">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Community Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 px-1">Active Challenges</h3>
                <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20 relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Award size={20} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Social Challenge</span>
                            </div>
                            <h4 className="text-xl font-black italic uppercase">100km Run Challenge</h4>
                            <p className="text-xs text-white/70 font-medium">Join 2,450 others this month</p>
                        </div>
                        <Button variant="accent" size="sm" className="rounded-full shadow-lg">Join</Button>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-10">
                        <Users size={120} />
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default SocialFeed;
