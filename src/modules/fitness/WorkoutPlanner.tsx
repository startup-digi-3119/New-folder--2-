import React, { useState } from 'react';
import {
    ChevronRight,
    Dumbbell,
    Play,
    RotateCcw,
    Info,
    CheckCircle2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { WORKOUT_PLAN } from '../../data/workoutPlan';
import type { WeeklyPlan } from '../../data/workoutPlan';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { neon } from '../../services/neon';

const WorkoutPlanner: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedPhase, setSelectedPhase] = useState<WeeklyPlan>(WORKOUT_PLAN[0]);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);
    const [completedWorkoutTitles, setCompletedWorkoutTitles] = useState<string[]>([]);

    React.useEffect(() => {
        if (!user) return;
        const fetchCompleted = async () => {
            try {
                const { data } = await neon.from('workouts').select('name');
                if (data) {
                    setCompletedWorkoutTitles(data.map((w: any) => w.name));
                }
            } catch (err) {
                console.error('Error fetching completed workouts:', err);
            }
        };
        fetchCompleted();
    }, [user]);

    const isCompleted = (title: string) => completedWorkoutTitles.includes(title);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            <header className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">My Plan</h2>
                        <p className="text-gray-500 font-medium">8-Week Transformation</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 font-bold uppercase text-[10px] tracking-widest" onClick={() => window.location.reload()}>
                        <RotateCcw size={14} className="mr-1" /> Reset
                    </Button>
                </div>

                {/* Phase Selector */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {WORKOUT_PLAN.map(phase => (
                        <button
                            key={phase.id}
                            onClick={() => setSelectedPhase(phase)}
                            className={`flex-shrink-0 px-4 py-3 rounded-2xl border transition-all text-left min-w-[160px] ${selectedPhase.id === phase.id
                                ? 'bg-slate-900 text-white border-slate-900 ring-4 ring-slate-900/10'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                                }`}
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Phase</p>
                            <p className="text-sm font-bold truncate">{phase.title}</p>
                        </button>
                    ))}
                </div>
            </header>

            {/* Current Phase Info */}
            <Card className="!bg-slate-900 text-white border-none p-6 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2">
                        <Info size={16} className="text-emerald-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Phase Guidelines</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-90">
                        {selectedPhase.description}
                    </p>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </Card>

            {/* Weekly Schedule */}
            <div className="space-y-3">
                {selectedPhase.schedule.map((day) => (
                    <Card key={day.day} className={`transition-all duration-300 overflow-hidden ${expandedDay === day.day ? 'ring-2 ring-primary/20' : ''}`}>
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50"
                            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg italic ${isCompleted(day.title) ? 'bg-emerald-500 text-white' :
                                        day.title.includes('Rest') ? 'bg-emerald-50 text-emerald-500' : 'bg-primary/10 text-primary'
                                    }`}>
                                    {isCompleted(day.title) ? <CheckCircle2 size={24} /> : day.day}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{day.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{day.focus}</p>
                                </div>
                            </div>
                            <ChevronRight
                                size={20}
                                className={`text-gray-300 transition-transform duration-300 ${expandedDay === day.day ? 'rotate-90' : ''}`}
                            />
                        </div>

                        {/* Expanded Details */}
                        {expandedDay === day.day && !day.title.includes('Rest') && (
                            <div className="bg-gray-50 border-t border-gray-100 p-4 space-y-4 animate-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    {day.exercises.map((ex, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-gray-100 rounded-lg text-gray-400">
                                                    <Dumbbell size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-800 uppercase">{ex.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">{ex.sets} sets × {ex.reps}</p>
                                                </div>
                                            </div>
                                            {ex.notes && <Info size={14} className="text-gray-300" />}
                                        </div>
                                    ))}
                                    {day.abs && day.abs.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-2 pl-1">Core Finisher</p>
                                            {day.abs.map((ex, idx) => (
                                                <div key={'abs' + idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                                    <p className="text-xs font-black text-gray-800 uppercase">{ex.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">{ex.sets} × {ex.reps}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {day.hiit && (
                                        <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-orange-600">
                                            <p className="text-[10px] font-black uppercase tracking-widest mb-1">HIIT Session</p>
                                            <p className="text-xs font-bold">{day.hiit}</p>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    fullWidth
                                    variant="primary"
                                    className="rounded-xl shadow-lg shadow-primary/20"
                                    onClick={() => navigate(`/fitness/session/${selectedPhase.id}-${day.day}`)}
                                >
                                    <Play size={18} className="mr-2" /> Start Workout
                                </Button>
                            </div>
                        )}

                        {/* Rest Day Message */}
                        {expandedDay === day.day && day.title.includes('Rest') && (
                            <div className="bg-emerald-50 border-t border-emerald-100 p-6 text-center">
                                <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                                <h4 className="font-bold text-emerald-800">Rest & Recover</h4>
                                <p className="text-xs text-emerald-600 mt-1 max-w-[200px] mx-auto">
                                    Sleep, stretch, and eat well today. Your muscles grow while you rest.
                                </p>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default WorkoutPlanner;
