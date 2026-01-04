import React from 'react';
import {
    Plus,
    Activity,
    TrendingUp,
    Layout,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import { neon } from '../../services/neon';
import { useAuth } from '../../store/AuthContext';
import { useUI } from '../../store/UIContext';

const ProjectsDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { openModal } = useUI();
    const [projects, setProjects] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState({ activeTasks: 0, velocity: 0 });

    React.useEffect(() => {
        if (!user) return;

        const fetchProjects = async () => {
            try {
                const projResult = await neon.query('SELECT * FROM projects WHERE user_id = $1', [user.id]);
                const data = projResult.rows;
                setProjects(data || []);

                // Fetch total active tasks for stats
                // Fetch total active tasks for stats
                const tasksResult = await neon.query('SELECT * FROM tasks WHERE user_id = $1', [user.id]);
                const activeCount = (tasksResult.rows || []).filter((t: any) => t.status !== 'done').length;
                setStats(prev => ({ ...prev, activeTasks: activeCount }));

            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [user]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Projects</h2>
                    <p className="text-gray-500 font-medium tracking-tight">Manage your professional workflows.</p>
                </div>
                <Button variant="primary" size="sm" className="rounded-2xl px-4" onClick={() => openModal('project')}>
                    <Plus size={20} />
                </Button>
            </header>

            {/* Stats Overview */}
            <section className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="text-primary" size={18} />
                        <span className="text-xs font-bold text-primary uppercase">Active Tasks</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{stats.activeTasks}</p>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="text-emerald-500" size={18} />
                        <span className="text-xs font-bold text-emerald-500 uppercase">Velocity</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{stats.velocity}</p>
                </Card>
            </section>

            {/* Project Grid - Empty State */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-bold text-gray-800 italic">Active Projects</h3>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12"><Activity className="animate-spin text-primary" size={32} /></div>
                ) : projects.length === 0 ? (
                    <Card className="!p-12 border-dashed border-2 bg-gray-50/50 flex flex-col items-center justify-center text-center">
                        <Layout className="text-gray-200 mb-4" size={48} />
                        <p className="text-sm font-bold text-gray-400 mb-6">No active projects found. Start building your vision today.</p>
                        <Button
                            variant="primary"
                            className="rounded-xl px-8 h-12 font-black italic uppercase tracking-widest shadow-lg shadow-primary/20"
                            onClick={() => openModal('project')}
                        >
                            Create Project
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {projects.map(project => (
                            <Card key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className="cursor-pointer group hover:border-primary/30 transition-all">
                                <div className="flex items-start justify-between">
                                    <h4 className="font-bold text-gray-900 group-hover:text-primary">{project.title}</h4>
                                    <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                                        {project.tasks?.[0]?.count || 0} Tasks
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{project.description || 'No description provided.'}</p>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Team Insights - Placeholder */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 px-1 italic underline decoration-primary decoration-4 underline-offset-4">Insights</h3>
                <Card className="flex items-center gap-4 !p-6 border-none shadow-sm bg-indigo-50/50">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <Activity className="text-indigo-500" size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Efficiency</p>
                        <p className="text-sm font-bold text-indigo-900">System Ready for Business Integration</p>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default ProjectsDashboard;
