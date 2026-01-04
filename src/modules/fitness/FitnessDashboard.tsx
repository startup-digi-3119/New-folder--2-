import React from 'react';
import {
    Activity,
    Flame,
    Footprints,
    Timer,
    Target,
    Plus,
    Info
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const FitnessDashboard: React.FC = () => {
    const navigate = useNavigate();

    const dailyStats = [
        { label: 'Energy', value: '0', unit: 'kcal', icon: <Flame size={18} />, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Steps', value: '0', unit: 'steps', icon: <Footprints size={18} />, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Time', value: '0', unit: 'min', icon: <Timer size={18} />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Fitness</h2>
                    <p className="text-gray-500 font-medium">Your health journey starts today.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/fitness/exercises')}>Library</Button>
                    <Button variant="primary" size="sm" className="rounded-2xl" onClick={() => navigate('/fitness/create-plan')}>
                        <Plus size={20} />
                    </Button>
                </div>
            </header>

            {/* Daily stats summary */}
            <div className="grid grid-cols-3 gap-3">
                {dailyStats.map((stat, i) => (
                    <Card key={i} className={`flex flex-col items-center justify-center !p-4 border-none shadow-sm ${stat.bg}`}>
                        <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                        <p className="text-xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{stat.unit}</p>
                    </Card>
                ))}
            </div>

            {/* Current Workout Plan - Empty State */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 px-1 italic italic">Current Plan</h3>
                <Card className="!p-8 border-dashed border-2 flex flex-col items-center justify-center text-center bg-gray-50/50">
                    <Activity className="text-gray-200 mb-3" size={40} />
                    <p className="text-sm font-bold text-gray-400 mb-4">You haven't generated a plan yet.</p>
                    <Button
                        variant="primary"
                        size="sm"
                        className="rounded-xl px-6 h-12 font-black italic uppercase tracking-widest"
                        onClick={() => navigate('/fitness/create-plan')}
                    >
                        View My 8-Week Plan
                    </Button>
                </Card>
            </section>

            {/* Goals - Empty State */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-bold text-gray-800 italic">Health Goals</h3>
                    <Button variant="ghost" size="sm" className="text-primary font-bold"><Plus size={16} /> Add Goal</Button>
                </div>
                <Card className="flex items-center gap-4 !p-6 bg-white border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Target size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weight Goal</p>
                        <p className="text-sm font-black text-gray-900 italic">No target set</p>
                    </div>
                </Card>
            </section>

            {/* Progress Tip */}
            <Card className="bg-slate-900 border-none text-white p-6 relative overflow-hidden">
                <div className="relative z-10 flex gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl h-fit">
                        <Info size={24} className="text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold">Developer Tip</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Start by generating an AI Workout Plan to see your daily activities and track sets in real-time.
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </Card>
        </div>
    );
};

export default FitnessDashboard;
