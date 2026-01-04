import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Activity,
    Dumbbell,
    PieChart as PieChartIcon,
    ChevronLeft,
    ArrowUpRight,
    ArrowDownRight,
    Calendar
} from 'lucide-react';
import Card from '../../components/ui/Card';
import { neon } from '../../services/neon';
import { useAuth } from '../../store/AuthContext';
import DateRangeSelector, { type DayRange } from '../../components/ui/DateRangeSelector';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ReportsDashboard: React.FC = () => {
    const { user } = useAuth();
    const [financeStats, setFinanceStats] = useState({ income: 0, expenses: 0, balance: 0 });
    const [fitnessStats, setFitnessStats] = useState({ totalWorkouts: 0, avgCalories: 0, totalTime: 0 });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'finance' | 'fitness'>('finance');
    const [range, setRange] = useState<DayRange>('7days');
    const [financeView, setFinanceView] = useState<'main' | 'income' | 'expenses'>('main');

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
                const filterStr = filterDate ? (() => {
                    const offset = filterDate.getTimezoneOffset() * 60000;
                    return new Date(filterDate.getTime() - offset).toISOString().split('T')[0];
                })() : '';

                // Parallel fetching
                let transQuery = 'SELECT * FROM transactions WHERE user_id = $1';
                if (filterStr) transQuery += ` AND date >= '${filterStr}'`;

                let workoutQuery = 'SELECT * FROM workouts WHERE user_id = $1';
                if (filterStr) workoutQuery += ` AND created_at::date >= '${filterStr}'`;

                const [transRes, workoutRes] = await Promise.all([
                    neon.query(transQuery, [user.id]),
                    neon.query(workoutQuery, [user.id])
                ]);

                const trans = transRes.rows;
                setTransactions(trans);
                const income = trans.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
                const expenses = trans.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
                setFinanceStats({ income, expenses, balance: income - expenses });

                const workouts = workoutRes.rows;
                const totalWorkouts = workouts.length;
                const totalCalories = workouts.reduce((acc: number, w: any) => acc + (w.calories_burned || 0), 0);
                const totalTime = workouts.reduce((acc: number, w: any) => acc + (w.duration_seconds || 0), 0);
                setFitnessStats({
                    totalWorkouts,
                    avgCalories: totalWorkouts ? Math.round(totalCalories / totalWorkouts) : 0,
                    totalTime: Math.round(totalTime / 60)
                });

            } catch (err) {
                console.error('Error fetching report data:', err);
            }
        };

        fetchStats();
    }, [user, range]);

    // Data Helpers
    const getChartData = () => {
        if (financeView === 'main') {
            const hasData = financeStats.income > 0 || financeStats.expenses > 0;
            if (!hasData) {
                return {
                    labels: ['No Data'],
                    datasets: [{
                        data: [1],
                        backgroundColor: ['#f1f5f9'], // light gray
                        borderWidth: 0
                    }]
                };
            }
            return {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [financeStats.income, financeStats.expenses],
                    backgroundColor: ['#10b981', '#f43f5e'],
                    hoverOffset: 4
                }]
            };
        } else {
            const type = financeView === 'income' ? 'income' : 'expense';
            const filtered = transactions.filter(t => t.type === type);
            const categories: Record<string, number> = {};
            filtered.forEach(t => {
                categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
            });

            const labels = Object.keys(categories);
            const data = Object.values(categories);

            if (data.length === 0) {
                return {
                    labels: ['No Data'],
                    datasets: [{
                        data: [1],
                        backgroundColor: ['#f1f5f9'],
                        borderWidth: 0
                    }]
                };
            }

            return {
                labels,
                datasets: [{
                    data,
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
                        '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'
                    ],
                    hoverOffset: 4
                }]
            };
        }
    };

    const handlePieClick = (_event: any, elements: any[]) => {
        if (financeView === 'main' && elements.length > 0) {
            const index = elements[0].index;
            if (index === 0) setFinanceView('income');
            else setFinanceView('expenses');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-100 pb-24">
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
                        <Card className="p-6 bg-emerald-50 border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => setFinanceView('income')}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 mb-1">Total Income</p>
                            <h3 className="text-3xl font-black italic text-emerald-700">₹{financeStats.income.toLocaleString()}</h3>
                            <div className="mt-4 flex items-center gap-2 text-emerald-600">
                                <ArrowUpRight size={16} />
                                <span className="text-xs font-bold font-mono">View Sources →</span>
                            </div>
                        </Card>
                        <Card className="p-6 bg-rose-50 border-rose-100 cursor-pointer hover:bg-rose-100 transition-colors" onClick={() => setFinanceView('expenses')}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600/60 mb-1">Total Expenses</p>
                            <h3 className="text-3xl font-black italic text-rose-700">₹{financeStats.expenses.toLocaleString()}</h3>
                            <div className="mt-4 flex items-center gap-2 text-rose-600">
                                <ArrowDownRight size={16} />
                                <span className="text-xs font-bold font-mono">View Categories →</span>
                            </div>
                        </Card>
                    </div>

                    {/* Finance Visualizations */}
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {financeView !== 'main' && (
                                        <button onClick={() => setFinanceView('main')} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <ChevronLeft size={16} />
                                        </button>
                                    )}
                                    <h4 className="font-black uppercase italic tracking-widest text-sm text-gray-900">
                                        {financeView === 'main' ? 'Income vs Expenses' :
                                            financeView === 'income' ? 'Income by Category' : 'Expenses by Category'}
                                    </h4>
                                </div>
                                <PieChartIcon size={20} className="text-gray-300" />
                            </div>

                            <div className="max-w-md mx-auto aspect-square relative flex items-center justify-center">
                                <Pie
                                    data={getChartData()}
                                    options={{
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    usePointStyle: true,
                                                    padding: 20,
                                                    font: {
                                                        family: 'Inter, sans-serif',
                                                        weight: 'bold',
                                                        size: 10
                                                    }
                                                }
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context: any) => {
                                                        const value = context.raw;
                                                        if (context.label === 'No Data') return ' No records found';
                                                        return ` ₹${value.toLocaleString()}`;
                                                    }
                                                }
                                            }
                                        },
                                        onClick: handlePieClick,
                                        cutout: '60%'
                                    }}
                                />
                                {financeView === 'main' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Savings</p>
                                        <p className="text-lg font-black italic text-gray-900">
                                            {financeStats.income > 0
                                                ? Math.round(((financeStats.income - financeStats.expenses) / financeStats.income) * 100)
                                                : 0}%
                                        </p>
                                    </div>
                                )}
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
                            <BarChart3 size={32} className="text-orange-500 mx-auto mb-4" />
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
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ReportsDashboard;
