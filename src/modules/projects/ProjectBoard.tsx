import React, { useState } from 'react';
import {
    ChevronLeft,
    Layout,
    Users,
    MoreHorizontal
} from 'lucide-react';
import TaskDetail from './TaskDetail';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';

import { supabase } from '../../services/supabase';
import { useAuth } from '../../store/AuthContext';

const ProjectBoard: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);

    React.useEffect(() => {
        if (!user || !id) return;

        const fetchData = async () => {
            try {
                // Fetch project details
                const { data: projData } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single();
                setProject(projData);

                // Fetch tasks
                const { data: taskData } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('project_id', id);
                setTasks(taskData || []);

            } catch (err) {
                console.error('Error fetching board data:', err);
            }
        };

        fetchData();
    }, [user, id]);

    const columns = [
        { id: 'todo', title: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
        { id: 'in_progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'in_progress') },
        { id: 'done', title: 'Done', tasks: tasks.filter(t => t.status === 'done') },
    ];

    return (
        <div className="h-screen flex flex-col bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
            <header className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/projects')} className="p-2 hover:bg-gray-100 rounded-xl">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tighter italic">{project?.title || `Project #${id?.slice(0, 4)}`}</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{project?.description || 'Master Workflow'}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary"><Users size={20} /></button>
                    <button className="p-2 text-primary font-black italic uppercase tracking-widest text-[10px] border-2 border-primary/10 rounded-xl px-4">Sprint Set</button>
                </div>
            </header>

            <div className="flex-1 overflow-x-auto p-4 flex gap-4 no-scrollbar">
                {columns.map(column => (
                    <div key={column.id} className="min-w-[300px] w-[300px] flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 italic">{column.title}</h3>
                                <span className="bg-gray-200 text-gray-500 text-[10px] font-black px-2 py-0.5 rounded-full">{column.tasks.length}</span>
                            </div>
                            <button className="text-gray-300"><MoreHorizontal size={18} /></button>
                        </div>

                        <div className="flex-1 bg-white/50 rounded-3xl p-3 border border-gray-100 flex flex-col gap-3 overflow-y-auto no-scrollbar">
                            {column.tasks.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 opacity-50">
                                    <Layout size={32} className="text-gray-200" />
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No tasks yet</p>
                                </div>
                            ) : (
                                column.tasks.map(task => (
                                    <Card
                                        key={task.id}
                                        onClick={() => setSelectedTask(task)}
                                        className="!p-4 cursor-pointer hover:border-primary/30 transition-all active:scale-95"
                                    >
                                        <h4 className="text-sm font-bold text-gray-900">{task.title}</h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-50 text-red-500' :
                                                task.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </Card>
                                ))
                            )}
                            <button className="text-[10px] font-black text-primary uppercase italic tracking-widest mt-2 py-2 hover:bg-primary/5 rounded-xl transition-colors">+ Add Task</button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedTask && (
                <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
            )}
        </div>
    );
};

export default ProjectBoard;
