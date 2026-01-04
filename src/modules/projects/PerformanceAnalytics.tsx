import React from 'react';
import {
    Target,
    ArrowUpRight,
    ChevronRight,
    Zap,
    Calendar
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import Card from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PerformanceAnalytics: React.FC = () => {
    const navigate = useNavigate();

    const velocityData = {
        labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6'],
        datasets: [
            {
                label: 'Completed Points',
                data: [42, 38, 55, 48, 62, 58],
                borderColor: '#1E40AF',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Commitment',
                data: [45, 45, 50, 50, 60, 60],
                borderColor: 'rgba(148, 163, 184, 0.5)',
                borderDash: [5, 5],
                fill: false,
            }
        ],
    };

    const tasksByType = {
        labels: ['Features', 'Bugs', 'Refactor', 'DevOps', 'Planning'],
        datasets: [
            {
                label: 'Distribution',
                data: [25, 8, 12, 5, 10],
                backgroundColor: [
                    '#1E40AF',
                    '#EF4444',
                    '#10B981',
                    '#6366F1',
                    '#F59E0B',
                ],
                borderRadius: 8,
            },
        ],
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Zap className="text-primary" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Advanced Analytics</span>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900">Performance</h2>
                    <p className="text-gray-500 font-medium">Sprint velocity and project health.</p>
                </div>
                <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400">
                    <Calendar size={20} />
                </button>
            </header>

            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Avg Velocity', value: '52 pts', change: '+12%', color: 'text-primary' },
                    { label: 'Efficiency', value: '94%', change: '+3%', color: 'text-emerald-500' },
                    { label: 'Active Bugs', value: '8', change: '-2', color: 'text-red-500' },
                    { label: 'Compliance', value: '100%', change: 'Stable', color: 'text-indigo-500' },
                ].map((stat, i) => (
                    <Card key={i} className="!p-4 space-y-2">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <div className="flex items-baseline justify-between">
                            <h4 className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
                            <span className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Velocity Chart */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-bold text-gray-800">Sprint Velocity</h3>
                    <button className="text-xs font-bold text-primary flex items-center gap-1">
                        Full Report <ArrowUpRight size={14} />
                    </button>
                </div>
                <Card className="p-6">
                    <div className="h-64">
                        <Line
                            data={velocityData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true, grid: { color: '#F1F5F9' } }, x: { grid: { display: false } } }
                            }}
                        />
                    </div>
                </Card>
            </section>

            {/* Logic Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 px-1">Task Distribution</h3>
                    <Card className="p-6">
                        <div className="h-64">
                            <Bar
                                data={tasksByType}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { display: false }, x: { grid: { display: false } } }
                                }}
                            />
                        </div>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 px-1">Project Health</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Core Infrastructure', progress: 95, status: 'On Track' },
                            { name: 'API Integration', progress: 78, status: 'At Risk' },
                            { name: 'UI/UX Polish', progress: 45, status: 'On Track' },
                        ].map((project, i) => (
                            <Card key={i} className="flex items-center gap-4 group cursor-pointer hover:border-primary/30">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                    <Target className={project.status === 'On Track' ? 'text-primary' : 'text-orange-500'} size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-sm text-gray-900">{project.name}</h4>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${project.status === 'On Track' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${project.status === 'On Track' ? 'bg-primary' : 'bg-orange-500'}`}
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PerformanceAnalytics;
