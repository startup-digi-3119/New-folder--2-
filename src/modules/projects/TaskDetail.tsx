import React from 'react';
import {
    X,
    MessageSquare,
    AlignLeft,
    CheckSquare,
    Calendar,
    Activity
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
    const [subtasks, setSubtasks] = React.useState<any[]>([]);
    const [newSubtask, setNewSubtask] = React.useState('');
    const [editForm, setEditForm] = React.useState({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        assigned_to: task.assigned_to || '',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });

    const fetchSubtasks = async () => {
        try {
            const result = await neon.query('SELECT * FROM subtasks WHERE task_id = $1 ORDER BY created_at ASC', [task.id]);
            setSubtasks(result.rows || []);
        } catch (err) {
            console.error('Error fetching subtasks:', err);
        }
    };

    React.useEffect(() => {
        fetchSubtasks();
    }, [task.id]);

    const handleSave = async () => {
        try {
            await neon.query(
                'UPDATE tasks SET title = $1, description = $2, priority = $3, assigned_to = $4, due_date = $5 WHERE id = $6',
                [editForm.title, editForm.description, editForm.priority, editForm.assigned_to, editForm.due_date, task.id]
            );
            setIsEditing(false);
            if (onUpdate) onUpdate({ ...task, ...editForm });
        } catch (err) {
            console.error('Error updating task:', err);
            alert('Failed to update task');
        }
    };

    const handleAddSubtask = async () => {
        if (!newSubtask.trim()) return;
        try {
            await neon.query('INSERT INTO subtasks (task_id, title) VALUES ($1, $2)', [task.id, newSubtask]);
            setNewSubtask('');
            fetchSubtasks();
        } catch (err) {
            console.error('Error adding subtask:', err);
        }
    };

    const toggleSubtask = async (id: number, done: boolean) => {
        try {
            await neon.query('UPDATE subtasks SET done = $1 WHERE id = $2', [!done, id]);
            fetchSubtasks();
        } catch (err) {
            console.error('Error toggling subtask:', err);
        }
    };

    const deleteTask = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await neon.query('DELETE FROM tasks WHERE id = $1', [task.id]);
            onClose();
            if (onUpdate) onUpdate(null); // Signal deletion
            window.location.reload();
        } catch (err) {
            console.error('Error deleting task:', err);
            alert('Failed to delete task');
        }
    };

    const deleteSubtask = async (id: number) => {
        try {
            await neon.query('DELETE FROM subtasks WHERE id = $1', [id]);
            fetchSubtasks();
        } catch (err) {
            console.error('Error deleting subtask:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-300">
            <div
                className="bg-white w-full max-w-2xl sm:rounded-3xl h-[90vh] sm:h-auto sm:max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${(task.status || '').toLowerCase() === 'done' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                            <CheckSquare size={20} />
                        </div>
                        <h3 className="font-black text-gray-900 truncate uppercase">TASK ID: {task.id}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit Details</Button>
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
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Task Title</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="text-2xl font-black text-gray-900 w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        ) : (
                            <h2 className="text-3xl font-black text-gray-900 leading-tight uppercase italic tracking-tighter">
                                {task.title}
                            </h2>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {isEditing ? (
                                <div className="space-y-1 w-full">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Priority</label>
                                    <select
                                        value={editForm.priority}
                                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                    >
                                        <option value="high">High Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="low">Low Priority</option>
                                    </select>
                                </div>
                            ) : (
                                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${task.priority === 'high' ? 'bg-red-50 text-red-500' :
                                    task.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'
                                    }`}>
                                    {task.priority || 'medium'} Priority
                                </span>
                            )}
                        </div>
                    </section>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignee</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.assigned_to}
                                    onChange={(e) => setEditForm({ ...editForm, assigned_to: e.target.value })}
                                    placeholder="@username"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold"
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                                        {task.assigned_to ? task.assigned_to[0].toUpperCase() : 'U'}
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">{task.assigned_to ? `@${task.assigned_to}` : 'Unassigned'}</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                            <div className="flex items-center gap-2 text-primary">
                                <Activity size={16} />
                                <span className="text-xs font-black uppercase italic">{task.status || 'Todo'}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</p>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editForm.due_date}
                                    onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold"
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span className="text-xs font-bold">
                                        {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-900">
                            <AlignLeft size={20} className="text-gray-400" />
                            <h4 className="font-black uppercase tracking-widest text-sm italic">Description</h4>
                        </div>
                        <Card className="bg-gray-50 border-none !p-6">
                            {isEditing ? (
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm text-gray-600 font-medium min-h-[120px] resize-none"
                                    placeholder="Add detailed objectives..."
                                />
                            ) : (
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    {task.description || 'No detailed description provided for this task.'}
                                </p>
                            )}
                        </Card>
                    </section>

                    {isEditing && (
                        <div className="flex gap-3">
                            <Button variant="outline" fullWidth onClick={() => {
                                setIsEditing(false);
                                setEditForm({
                                    title: task.title,
                                    description: task.description || '',
                                    priority: task.priority || 'medium',
                                    assigned_to: task.assigned_to || '',
                                    due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                                });
                            }}>Cancel</Button>
                            <Button variant="primary" fullWidth onClick={handleSave}>Apply Updates</Button>
                        </div>
                    )}

                    {/* Subtasks */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-900">
                                <CheckSquare size={20} className="text-gray-400" />
                                <h4 className="font-black uppercase tracking-widest text-sm italic">Sub-Objectives</h4>
                            </div>
                            <p className="text-[10px] font-black text-primary uppercase">
                                {subtasks.length > 0 ? `${subtasks.filter(s => s.done).length}/${subtasks.length} DONE` : 'NO SUBTASKS'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    placeholder="Add new subtask..."
                                    className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                                />
                                <Button size="sm" onClick={handleAddSubtask}>Add</Button>
                            </div>

                            {subtasks.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary/20 transition-all group"
                                >
                                    <button
                                        onClick={() => toggleSubtask(sub.id, sub.done)}
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${sub.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200'}`}
                                    >
                                        {sub.done && <CheckSquare size={12} />}
                                    </button>
                                    <span
                                        onClick={() => toggleSubtask(sub.id, sub.done)}
                                        className={`text-sm font-bold flex-1 cursor-pointer ${sub.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}
                                    >
                                        {sub.title}
                                    </span>
                                    <button
                                        onClick={() => deleteSubtask(sub.id)}
                                        className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Comments Placeholder */}
                    <section className="space-y-6 opacity-80">
                        <div className="flex items-center gap-2 text-gray-900">
                            <MessageSquare size={20} className="text-gray-400" />
                            <h4 className="font-black uppercase tracking-widest text-sm italic">Status Log</h4>
                        </div>
                        <p className="text-center py-4 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-dashed border-gray-100">
                            Activity log coming soon
                        </p>
                    </section>
                </div>

                {/* Footer Actions */}
                <footer className="sticky bottom-0 bg-white border-t border-gray-100 p-6 space-y-4">
                    <div className="flex gap-2">
                        {['todo', 'in_progress', 'done'].map((status) => (
                            <Button
                                key={status}
                                variant={(task.status || '').toLowerCase() === status ? "primary" : "outline"}
                                className={`flex-1 font-black text-[10px] uppercase tracking-widest ${(task.status || '').toLowerCase() === status ? 'shadow-lg shadow-primary/20' : ''}`}
                                onClick={() => onStatusUpdate(status)}
                            >
                                {status === 'in_progress' ? 'Doing' : status}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="ghost"
                        fullWidth
                        className="text-red-500 font-bold uppercase text-[10px] tracking-widest h-12"
                        onClick={deleteTask}
                    >
                        Delete Task
                    </Button>
                </footer>
            </div>
        </div>
    );
};

export default TaskDetail;
