import React from 'react';
import {
    Activity,
    Plus,
    Flame,
    Footprints,
    Moon,
    CreditCard,
    BarChart3,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DateRangeSelector, { type DayRange } from '../../components/ui/DateRangeSelector';
import { useUI } from '../../store/UIContext';

import { neon } from '../../services/neon';
import { useAuth } from '../../store/AuthContext';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { openModal } = useUI();
    const [realStats, setRealStats] = React.useState({
        steps: '0',
        calories: '0',
        tasks: '0',
        balance: '₹0',
        sleep: '0h 0m'
    });
    const [range, setRange] = React.useState<DayRange>('today');
    const [pendingTask, setPendingTask] = React.useState<any>(null);

    React.useEffect(() => {
        if (!user) return;

        const fetchDashboardData = async () => {
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

                // 1. Calories from workouts
                let calorieQuery = 'SELECT SUM(calories_burned) as total FROM workouts WHERE user_id = $1';
                if (filterStr) calorieQuery += ` AND created_at::date >= '${filterStr}'`;
                const workoutRes = await neon.query(calorieQuery, [user.id]);
                const calories = workoutRes.rows[0]?.total || 0;

                // 2. Health Stats (Steps, Sleep, Consumed)
                let healthQuery = 'SELECT SUM(steps) as steps, SUM(sleep_minutes) as sleep, SUM(calories_consumed) as consumed FROM health_stats WHERE user_id = $1';
                if (filterStr) healthQuery += ` AND date >= '${filterStr}'`;
                const healthRes = await neon.query(healthQuery, [user.id]);
                const hStats = healthRes.rows[0] || { steps: 0, sleep: 0, consumed: 0 };

                // 3. Active Tasks
                const taskRes = await neon.query('SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND status != $2', [user.id, 'done']);

                // 4. Financial Balance
                const transRes = await neon.query('SELECT * FROM transactions WHERE user_id = $1', [user.id]);
                const trans = transRes.rows;
                const income = trans.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
                const expense = trans.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + Number(t.amount), 0);

                // 5. Latest Pending Task
                const pendingRes = await neon.query('SELECT * FROM tasks WHERE user_id = $1 AND status != $2 ORDER BY created_at DESC LIMIT 1', [user.id, 'done']);
                setPendingTask(pendingRes.rows[0]);

                const sleepHrs = Math.floor(hStats.sleep / 60);
                const sleepMins = hStats.sleep % 60;

                setRealStats({
                    steps: (hStats.steps || 0).toLocaleString(),
                    calories: (Number(calories) + Number(hStats.consumed || 0)).toString(),
                    tasks: taskRes.rows[0]?.count.toString() || '0',
                    balance: `₹${(income - expense).toLocaleString()}`,
                    sleep: `${sleepHrs}h ${sleepMins}m`
                });
            } catch (err) {
                console.error('Error:', err);
            }
        };

        fetchDashboardData();
    }, [user, range]);

    const stats = [
        { id: 'food', label: range === 'today' ? 'Today\'s Calories' : 'Calories', value: realStats.calories, icon: <Flame className="text-orange-500" />, color: 'bg-orange-500/10' },
        { id: 'task', label: 'Active Tasks', value: realStats.tasks, icon: <Activity className="text-primary" />, color: 'bg-primary/10' },
        { id: 'steps', label: 'Steps', value: realStats.steps, icon: <Footprints className="text-emerald-500" />, color: 'bg-emerald-500/10' },
        { id: 'sleep', label: 'Sleep', value: realStats.sleep, icon: <Moon className="text-secondary" />, color: 'bg-secondary/10' },
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

            <DateRangeSelector value={range} onChange={setRange} />

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="flex flex-col gap-3 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-xl ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-primary/10 transition-colors">
                                <Plus size={14} className="text-gray-300 group-hover:text-primary" />
                            </div>
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
                    {!pendingTask ? (
                        <Card className="!p-8 bg-gray-50 border-gray-100 border-dashed border-2 flex flex-col items-center justify-center text-center">
                            <Activity className="text-gray-200 mb-3" size={32} />
                            <p className="text-sm font-bold text-gray-400">No active sessions or tasks found.</p>
                            <Button variant="ghost" size="sm" className="mt-4 text-primary font-black uppercase italic tracking-widest" onClick={() => navigate('/projects')}>Add First Task</Button>
                        </Card>
                    ) : (
                        <Card onClick={() => navigate('/projects')} className="cursor-pointer border-primary/20 bg-primary/5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Active Objective</p>
                                    </div>
                                    <h4 className="text-lg font-black italic text-gray-900 uppercase tracking-tighter">{pendingTask.title}</h4>
                                    <p className="text-xs font-bold text-gray-400">{pendingTask.assigned_to ? `@${pendingTask.assigned_to}` : 'Unassigned'}</p>
                                </div>
                                <ChevronRight className="text-primary" size={24} />
                            </div>
                        </Card>
                    )}
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
                                <p className="text-3xl font-black tracking-tighter italic text-white">{realStats.balance}</p>
                                <p className="text-xs font-medium text-gray-400 italic">Total Balance</p>
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
