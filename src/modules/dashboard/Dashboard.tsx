import React from 'react';
import {
    Activity,
    Plus,
    Flame,
    Footprints,
    Moon,
    CreditCard,
    BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const stats = [
        { label: 'Steps', value: '0', icon: <Footprints className="text-primary" />, trend: '0%', color: 'bg-primary/10' },
        { label: 'Calories', value: '0', icon: <Flame className="text-orange-500" />, trend: '0%', color: 'bg-orange-500/10' },
        { label: 'Sleep', value: '0h 0m', icon: <Moon className="text-secondary" />, trend: '0%', color: 'bg-secondary/10' },
        { label: 'Heart Rate', value: '-- bpm', icon: <Activity className="text-red-500" />, trend: 'Waiting', color: 'bg-red-500/10' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Section */}
            <section className="flex items-end justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        Welcome Back!
                    </h2>
                    <p className="text-gray-500 font-medium">Ready to start your day?</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="bg-primary/5 text-primary font-black uppercase tracking-widest text-[10px] rounded-xl px-4 h-10 border-2 border-primary/10"
                    onClick={() => navigate('/reports')}
                >
                    <BarChart3 size={14} className="mr-2" /> Reports
                </Button>
            </section>

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-xl ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-gray-400">
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </Card>
                ))}
            </section>

            {/* Activity Chart Section - Empty State */}
            <section>
                <Card title="Activity Analytics" subtitle="Track your performance throughout the week">
                    <div className="h-48 mt-4 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Activity size={32} className="text-gray-300 mb-2" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No activity data recorded</p>
                    </div>
                </Card>
            </section>

            {/* Key Focus Areas - Empty State */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-bold text-gray-800 tracking-tighter italic">Pending Status</h3>
                </div>
                <div className="space-y-3">
                    <Card className="!p-8 bg-gray-50 border-gray-100 border-dashed border-2 flex flex-col items-center justify-center text-center">
                        <Activity className="text-gray-200 mb-3" size={32} />
                        <p className="text-sm font-bold text-gray-400">No active sessions or tasks found.</p>
                        <Button variant="ghost" size="sm" className="mt-4 text-primary font-black uppercase italic tracking-widest">Add First Task</Button>
                    </Card>
                </div>
            </section>

            {/* Finance Quick Entry */}
            <section>
                <Card className="bg-gray-900 text-white overflow-hidden relative border-none">
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-xl">
                                <CreditCard size={20} className="text-emerald-400" />
                            </div>
                            <h3 className="font-bold">Finance Summary</h3>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-black tracking-tighter italic text-white">₹0.00</p>
                                <p className="text-xs font-medium text-gray-400 italic">No balance record this month</p>
                            </div>
                            <Button variant="ghost" className="bg-white/10 text-white rounded-xl px-4 h-12">
                                <Plus size={18} />
                            </Button>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default Dashboard;
