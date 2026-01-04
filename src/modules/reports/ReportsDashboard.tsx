import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Activity,
    Dumbbell,
    IndianRupee,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    PieChart
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { neon } from '../../services/neon';
import { useAuth } from '../../store/AuthContext';
import DateRangeSelector, { type DayRange } from '../../components/ui/DateRangeSelector';

const ReportsDashboard: React.FC = () => {
    const { user } = useAuth();
    const [financeStats, setFinanceStats] = useState({ income: 0, expenses: 0, balance: 0 });
    const [fitnessStats, setFitnessStats] = useState({ totalWorkouts: 0, avgCalories: 0, totalTime: 0 });
    const [activeTab, setActiveTab] = useState<'finance' | 'fitness'>('finance');
    const [range, setRange] = useState<DayRange>('7days');

    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            try {
                const now = new Date();
                let filterDate: Date | null = null;
                switch (range) {
                    case 'today': filterDate = new Date(now.setHours(0, 0, 0, 0)); break;
                    case 'yesterday': filterDate = new Date(new Date(now.setDate(now.getDate() - 1)).setHours(0, 0, 0, 0)); break;
                    case '3days': filterDate = new Date(now.setDate(now.getDate() - 3)); break;
                    case '7days': filterDate = new Date(now.setDate(now.getDate() - 7)); break;
                    case '30days': filterDate = new Date(now.setDate(now.getDate() - 30)); break;
                    case '60days': filterDate = new Date(now.setDate(now.getDate() - 60)); break;
                }
                const filterStr = filterDate ? filterDate.toISOString().split('T')[0] : '';

                // Finance Stats
                let transQuery = 'SELECT * FROM transactions WHERE user_id = $1';
                if (filterStr) transQuery += ` AND date >= '${filterStr}'`;
                const transResult = await neon.query(transQuery, [user.id]);
                const trans = transResult.rows;
                const income = trans.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
                const expenses = trans.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
                setFinanceStats({ income, expenses, balance: income - expenses });

                // Fitness Stats
                let workoutQuery = 'SELECT * FROM workouts WHERE user_id = $1';
                if (filterStr) workoutQuery += ` AND created_at::date >= '${filterStr}'`;
                const workoutResult = await neon.query(workoutQuery, [user.id]);
                const workouts = workoutResult.rows;
                const totalWorkouts = workouts.length;
                const totalCalories = workouts.reduce((acc: number, w: any) => acc + (w.calories_burned || 0), 0);
                const totalTime = workouts.reduce((acc: number, w: any) => acc + (w.duration_seconds || 0), 0);
                setFitnessStats({
                    totalWorkouts,
                    avgCalories: totalWorkouts ? Math.round(totalCalories / totalWorkouts) : 0,
                    totalTime: Math.round(totalTime / 60) // in minutes
                });

            } catch (err) {
                console.error('Error fetching report data:', err);
            }
        };

        fetchStats();
    }, [user, range]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">REPORTS</h2>
                    <p className="text-gray-500 font-medium">Data-driven performance insights</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('finance')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'finance' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Finance
                    </button>
                    <button
                        onClick={() => setActiveTab('fitness')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'fitness' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Fitness
                    </button>
                </div>
            </header>

            <DateRangeSelector value={range} onChange={setRange} />

            {activeTab === 'finance' ? (
                <div className="space-y-6">
                    {/* Finance Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="!bg-slate-900 text-white border-none p-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Balance</p>
                            <h3 className="text-3xl font-black italic">₹{financeStats.balance.toLocaleString()}</h3>
                            <div className="mt-4 flex items-center gap-2 text-emerald-400">
                                <TrendingUp size={16} />
                                <span className="text-xs font-bold font-mono">+12.5% vs last month</span>
                            </div>
                        </Card>
                        <Card className="p-6 bg-emerald-50 border-emerald-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 mb-1">Monthly Income</p>
                            <h3 className="text-3xl font-black italic text-emerald-700">₹{financeStats.income.toLocaleString()}</h3>
                            <div className="mt-4 flex items-center gap-2 text-emerald-600">
                                <ArrowUpRight size={16} />
                                <span className="text-xs font-bold font-mono">Top source: Salary</span>
                            </div>
                        </Card>
                        <Card className="p-6 bg-rose-50 border-rose-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600/60 mb-1">Monthly Expenses</p>
                            <h3 className="text-3xl font-black italic text-rose-700">₹{financeStats.expenses.toLocaleString()}</h3>
                            <div className="mt-4 flex items-center gap-2 text-rose-600">
                                <ArrowDownRight size={16} />
                                <span className="text-xs font-bold font-mono">Highest: Rent</span>
                            </div>
                        </Card>
                    </div>

                    {/* Finance Visualizations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="font-black uppercase italic tracking-widest text-sm text-gray-900">Spending Trends</h4>
                                <BarChart3 size={20} className="text-gray-300" />
                            </div>
                            <div className="h-48 flex items-end gap-2 px-2">
                                {[35, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                    <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group transition-all hover:bg-primary/40">
                                        <div style={{ height: `${h}%` }} className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all" />
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            ₹{h * 100}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-tighter px-2">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </Card>

                        <Card className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="font-black uppercase italic tracking-widest text-sm text-gray-900">Categories</h4>
                                <PieChart size={20} className="text-gray-300" />
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Food & Dining', value: 35, color: 'bg-orange-500' },
                                    { label: 'Transport', value: 20, color: 'bg-blue-500' },
                                    { label: 'Entertainment', value: 15, color: 'bg-purple-500' },
                                    { label: 'Shopping', value: 30, color: 'bg-emerald-500' }
                                ].map((cat, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-gray-500">{cat.label}</span>
                                            <span className="text-gray-900">{cat.value}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.value}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Fitness Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="!bg-slate-900 text-white border-none p-6 text-center">
                            <Activity size={32} className="text-primary mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Workouts</p>
                            <h3 className="text-4xl font-black italic">{fitnessStats.totalWorkouts}</h3>
                        </Card>
                        <Card className="!bg-slate-900 text-white border-none p-6 text-center">
                            < IndianRupee size={32} className="text-orange-500 mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Avg Calories</p>
                            <h3 className="text-4xl font-black italic">{fitnessStats.avgCalories} <span className="text-sm uppercase not-italic text-gray-500 tracking-normal opacity-60">kcal</span></h3>
                        </Card>
                        <Card className="!bg-slate-900 text-white border-none p-6 text-center">
                            <Calendar size={32} className="text-blue-500 mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Time Invested</p>
                            <h3 className="text-4xl font-black italic">{fitnessStats.totalTime} <span className="text-sm uppercase not-italic text-gray-500 tracking-normal opacity-60">mins</span></h3>
                        </Card>
                    </div>

                    {/* Fitness Visualization */}
                    <Card className="p-8 space-y-8">
                        <div>
                            <h4 className="font-black uppercase italic tracking-widest text-sm text-gray-900 mb-1">Weekly Frequency</h4>
                            <p className="text-xs text-gray-400 font-medium">Tracking your active days per week</p>
                        </div>
                        <div className="grid grid-cols-7 gap-4">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                <div key={i} className="space-y-3 text-center">
                                    <div className={`aspect-square rounded-2xl flex items-center justify-center border-2 transition-all ${[0, 2, 4, 5].includes(i) ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                                        <Dumbbell size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400">{day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary rounded-full" />
                                    <span className="text-[10px] font-black uppercase text-gray-500">Completed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-100 rounded-full" />
                                    <span className="text-[10px] font-black uppercase text-gray-500">Missed/Rest</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-primary font-black uppercase text-[10px] tracking-widest">
                                Full History →
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ReportsDashboard;
