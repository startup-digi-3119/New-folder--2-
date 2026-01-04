import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Activity,
    Trash2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useUI } from '../../store/UIContext';
import { useAuth } from '../../store/AuthContext';
import { neon } from '../../services/neon';

const CalendarView: React.FC = () => {
    const { openModal } = useUI();
    const { user } = useAuth();
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [currentDate] = useState(new Date());
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingEvent, setViewingEvent] = useState<any | null>(null);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    React.useEffect(() => {
        if (!user) return;
        const fetchEvents = async () => {
            setLoading(true);
            try {
                // Fetch tasks for the selected date
                const year = currentDate.getFullYear();
                const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                const dateStr = `${year}-${month}-${selectedDay.toString().padStart(2, '0')}`;
                const result = await neon.query(
                    'SELECT * FROM tasks WHERE user_id = $1 AND due_date::date = $2',
                    [user.id, dateStr]
                );
                setEvents(result.rows || []);
            } catch (err) {
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [user, selectedDay]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Calendar</h2>
                    <p className="text-gray-500 font-medium">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            {/* Date Picker (Horizontal) */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 py-2">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex flex-col items-center justify-center min-w-[50px] h-[75px] rounded-2xl transition-all border ${selectedDay === day
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                            : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{weekDays[(day + 5) % 7]}</span>
                        <span className="text-lg font-black">{day}</span>
                        {day === selectedDay && <div className="w-1 h-1 rounded-full mt-1 bg-white"></div>}
                    </button>
                ))}
            </div>

            {/* Today's Schedule - Empty State */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-bold text-gray-800 italic">Timeline</h3>
                    <Button variant="ghost" size="sm" className="text-primary font-black uppercase italic tracking-widest" onClick={() => openModal('event')}>
                        <Plus size={18} /> New Event
                    </Button>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="flex justify-center p-12"><Activity className="animate-spin text-primary" size={32} /></div>
                    ) : events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-100 rounded-3xl text-center space-y-4">
                            <CalendarIcon size={48} className="text-gray-100" />
                            <p className="text-sm font-bold text-gray-400">No events scheduled for this day.</p>
                            <Button variant="ghost" className="text-primary font-bold" onClick={() => openModal('event')}>Quick Schedule</Button>
                        </div>
                    ) : (
                        events.map(event => (
                            <Card key={event.id} onClick={() => setViewingEvent(event)} className="flex items-center gap-4 !p-4 group relative cursor-pointer hover:border-primary/30 transition-all">
                                <div className="p-3 bg-primary/5 rounded-2xl text-primary font-black italic text-xs">
                                    {event.due_date ? new Date(event.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-gray-900">{event.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{event.description || 'No additional details'}</p>
                                </div>
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Delete this event?')) {
                                            await neon.query('DELETE FROM tasks WHERE id = $1', [event.id]);
                                            setEvents(events.filter(ev => ev.id !== event.id));
                                        }
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </Card>
                        ))
                    )}
                </div>
            </section>

            {/* Event Preview Modal */}
            {viewingEvent && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setViewingEvent(null)}
                >
                    <Card
                        className="w-full max-w-lg scale-in flex flex-col gap-8 !p-10 shadow-2xl relative border-none !bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setViewingEvent(null)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                        >
                            <Trash2 size={20} onClick={() => {
                                if (window.confirm('Delete this event?')) {
                                    neon.query('DELETE FROM tasks WHERE id = $1', [viewingEvent.id]);
                                    setEvents(events.filter(ev => ev.id !== viewingEvent.id));
                                    setViewingEvent(null);
                                }
                            }} className="text-red-400 hover:text-red-600" />
                        </button>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">Upcoming Event</p>
                                </div>
                                <h3 className="text-4xl font-black italic text-gray-900 uppercase tracking-tighter leading-tight">
                                    {viewingEvent.title}
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                                    <CalendarIcon size={16} className="text-primary" />
                                    <span className="text-xs font-bold text-gray-700">
                                        {new Date(viewingEvent.due_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                                    <Activity size={16} className="text-secondary" />
                                    <span className="text-xs font-bold text-gray-700">
                                        {new Date(viewingEvent.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes & Objectives</h4>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-gray-100">
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                        {viewingEvent.description || "No additional notes have been added to this event."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    fullWidth
                                    className="rounded-2xl h-14 font-black uppercase tracking-widest italic"
                                    onClick={() => setViewingEvent(null)}
                                >
                                    Dismiss
                                </Button>
                                <Button
                                    variant="outline"
                                    className="px-8 rounded-2xl h-14"
                                    onClick={() => {
                                        setViewingEvent(null);
                                        openModal('event'); // In a real app, we'd pass the event to edit it
                                    }}
                                >
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Productivity View */}
            <Card className="bg-primary/5 border-primary/10 p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
                    <Activity size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Daily Efficiency</h4>
                    <p className="text-xs text-gray-500">Scheduled events will populate your productivity score here.</p>
                </div>
            </Card>
        </div>
    );
};

export default CalendarView;
