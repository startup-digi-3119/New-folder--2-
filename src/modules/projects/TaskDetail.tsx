import React from 'react';
import {
    X,
    Clock,
    Paperclip,
    MessageSquare,
    AlignLeft,
    CheckSquare,
    ChevronRight,
    Calendar
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { neon } from '../../services/neon';

interface TaskDetailProps {
    task: any;
    onClose: () => void;
    onStatusUpdate: (newStatus: string) => void;
    onUpdate?: (updatedTask: any) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose, onStatusUpdate, onUpdate }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        assigned_to: task.assigned_to || ''
    });

    const handleSave = async () => {
        try {
            const { error } = await neon.from('tasks').update(editForm).match({ id: task.id });
            if (error) throw error;
            setIsEditing(false);
            if (onUpdate) onUpdate({ ...task, ...editForm });
        } catch (err) {
            console.error('Error updating task:', err);
            alert('Failed to update task');
        }
    };
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-300">
            <div
                className="bg-white w-full max-w-2xl sm:rounded-3xl h-[90vh] sm:h-auto sm:max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-500 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${task.status === 'Done' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                            <CheckSquare size={20} />
                        </div>
                        <h3 className="font-black text-gray-900 truncate">TASK-{task.id}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
                        )}
                        <button onClick={onClose} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </header>

                <div className="p-8 space-y-10">
                    {/* Title Section */}
                    <section className="space-y-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="text-2xl font-black text-gray-900 w-full bg-gray-50 border-none rounded-xl p-2 focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        ) : (
                            <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                {task.title}
                            </h2>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {isEditing ? (
                                <select
                                    value={editForm.priority}
                                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                    className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full outline-none"
                                >
                                    <option value="high">High Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="low">Low Priority</option>
                                </select>
                            ) : (
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${task.priority === 'high' ? 'bg-red-50 text-red-500' :
                                    task.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'
                                    }`}>
                                    {task.priority || 'medium'} Priority
                                </span>
                            )}
                        </div>
                    </section>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignee</p>
                            <div className="flex items-center gap-2">
                                <img src="https://i.pravatar.cc/100?u=me" className="w-8 h-8 rounded-full" alt="me" />
                                <span className="text-xs font-bold text-gray-900">You</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reporter</p>
                            <div className="flex items-center gap-2">
                                <img src="https://i.pravatar.cc/100?u=boss" className="w-8 h-8 rounded-full" alt="boss" />
                                <span className="text-xs font-bold text-gray-900">Alex</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</p>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="text-xs font-bold">Jan 15, 2026</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estimation</p>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Clock size={16} className="text-gray-400" />
                                <span className="text-xs font-bold">5 Points</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-900">
                            <AlignLeft size={20} className="text-gray-400" />
                            <h4 className="font-black uppercase tracking-widest text-sm">Description</h4>
                        </div>
                        <Card className="bg-gray-50 border-none !p-6">
                            {isEditing ? (
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm text-gray-600 font-medium min-h-[100px] resize-none"
                                    placeholder="Add a detailed description..."
                                />
                            ) : (
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    {task.description || 'No description provided.'}
                                </p>
                            )}
                        </Card>
                    </section>

                    {isEditing && (
                        <div className="flex gap-3">
                            <Button variant="outline" fullWidth onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button variant="primary" fullWidth onClick={handleSave}>Save Changes</Button>
                        </div>
                    )}

                    {/* Subtasks */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-900">
                                <CheckSquare size={20} className="text-gray-400" />
                                <h4 className="font-black uppercase tracking-widest text-sm">Subtasks</h4>
                            </div>
                            <p className="text-[10px] font-black text-primary uppercase">2/3 Done</p>
                        </div>
                        <div className="space-y-2">
                            {[
                                { title: 'Create Toast Component', done: true },
                                { title: 'Integrate into Auth Service', done: true },
                                { title: 'Add unit tests for error cases', done: false },
                            ].map((sub, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary/20 transition-all cursor-pointer">
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${sub.done ? 'bg-primary border-primary text-white' : 'border-gray-200'}`}>
                                        {sub.done && <CheckSquare size={12} />}
                                    </div>
                                    <span className={`text-sm font-bold flex-1 ${sub.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{sub.title}</span>
                                    <ChevronRight size={16} className="text-gray-200" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Comments */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-gray-900">
                            <MessageSquare size={20} className="text-gray-400" />
                            <h4 className="font-black uppercase tracking-widest text-sm">Comments</h4>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <img src="https://i.pravatar.cc/100?u=alex" className="w-10 h-10 rounded-full" alt="alex" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-black text-sm">Alex Chen</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">2h ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl rounded-tl-none font-medium">
                                        I think we should also consider the offline case. If the user is offline, the toast should show a different message.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <img src="https://i.pravatar.cc/100?u=me" className="w-10 h-10 rounded-full" alt="me" />
                            <div className="flex-1 relative">
                                <textarea
                                    placeholder="Add a comment..."
                                    className="w-full bg-white border-2 border-gray-100 rounded-3xl py-4 pl-6 pr-14 outline-none focus:border-primary transition-all text-sm font-medium min-h-[100px] resize-none"
                                />
                                <div className="absolute top-4 right-4 text-gray-400 hover:text-primary cursor-pointer rotate-12">
                                    <Paperclip size={20} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2">
                    {['Todo', 'InProgress', 'Done'].map((status) => (
                        <Button
                            key={status}
                            variant={task.status === status ? "primary" : "outline"}
                            className={`flex-1 ${task.status === status ? 'shadow-xl shadow-primary/20' : ''}`}
                            onClick={() => onStatusUpdate(status)}
                        >
                            {status === 'InProgress' ? 'Doing' : status}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
