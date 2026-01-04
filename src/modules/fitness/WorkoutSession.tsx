import React, { useState, useEffect } from 'react';
import {
    Play,
    Pause,
    ChevronRight,
    X,
    Timer,
    Dumbbell,
    CheckCircle2,
    Flame,
    Info,
    Activity
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { neon } from '../../services/neon';
import { useAuth } from '../../store/AuthContext';
import { WORKOUT_PLAN } from '../../data/workoutPlan';
import { bluetoothManager } from '../../services/bluetooth';
import type { Exercise } from '../../data/workoutPlan';

const WorkoutSession: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Format: week-phaseId-day
    const { user } = useAuth();

    // Timer State
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // Bluetooth State
    const [heartRate, setHeartRate] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [btError, setBtError] = useState<string | null>(null);

    // Workout State
    const [currentDay, setCurrentDay] = useState<any>(null);
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
    const [completedSets, setCompletedSets] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Final Form
    const [calories, setCalories] = useState('300'); // Default estimtate
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        // Parse ID: e.g. "week-1-2-1" -> Phase "week-1-2", Day 1
        // We know the ID format is set in WorkoutPlanner as `${selectedPhase.id}-${day.day}`.
        // But wait, the ID might contain hyphens.
        // Let's split by hyphen. 
        // Best approach: Iterate phases, check if ID starts with phase ID.

        let foundPhase = WORKOUT_PLAN.find(p => id.startsWith(p.id));
        if (foundPhase) {
            const dayNum = parseInt(id.replace(foundPhase.id + '-', ''));
            const dayData = foundPhase.schedule.find(d => d.day === dayNum);
            if (dayData) {
                setCurrentDay(dayData);
                // Combine regular exercises and abs
                const exercises = [...dayData.exercises];
                if (dayData.abs) exercises.push(...dayData.abs);
                setAllExercises(exercises);
            }
        }
    }, [id]);

    // Timer Logic
    useEffect(() => {
        let interval: any = null;
        if (isActive && !isFinished) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, isFinished]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const checkBluetoothSupport = () => {
        // Feature detection for Web Bluetooth
        if (!('bluetooth' in navigator)) {
            setBtError('Bluetooth API not supported in this browser. Please use Chrome, Edge, or Bluefy on iOS.');
            return false;
        }
        return true;
    };

    const startBluetoothSync = async () => {
        setBtError(null);
        if (!checkBluetoothSupport()) return;

        setIsSyncing(true);
        try {
            console.log('Requesting Fire-Boltt/Standard Heart Rate device...');
            // We scan for the standard Heart Rate Service (0x180D) which Fire-Boltt supports
            await bluetoothManager.requestDevice();
            await bluetoothManager.connect((bpm) => {
                setHeartRate(bpm);
            });
        } catch (error: any) {
            console.error('BT Sync Error:', error);
            setBtError(error.message || 'Failed to connect. Ensure your watch is awake.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleNext = () => {
        const currentEx = allExercises[currentExerciseIdx];
        if (currentEx) {
            // Check if we finished all sets for this exercise
            // For simplicity, we assume user clicks "Next" after completing the full exercise or a set.
            // Let's implement set-based tracking.
            if (completedSets < currentEx.sets - 1) {
                setCompletedSets(prev => prev + 1);
            } else {
                // Exercise Complete
                if (currentExerciseIdx < allExercises.length - 1) {
                    setCurrentExerciseIdx(prev => prev + 1);
                    setCompletedSets(0);
                } else {
                    // Workout Complete
                    setIsFinished(true);
                    setIsActive(false);
                }
            }
        }
    };

    const saveWorkout = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const { error } = await neon.from('workouts').insert({
                user_id: user.id,
                name: currentDay?.title || `Workout Session`,
                duration_seconds: seconds,
                calories_burned: parseInt(calories),
                average_hr: 0, // Manual entry doesn't have HR usually
            });

            if (error) throw error;
            navigate('/fitness');
        } catch (err: any) {
            console.error('Failed to save workout:', err);
            alert(`Failed to save: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (!currentDay) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                Loading Plan...
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                    <CheckCircle2 size={48} />
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Workout Crushed!</h1>
                    <p className="text-gray-400">Great job completing {currentDay.title}.</p>
                </div>

                <Card className="bg-white/10 border-none text-white w-full max-w-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-400 uppercase text-xs tracking-widest">Duration</span>
                        <span className="font-black text-xl font-mono">{formatTime(seconds)}</span>
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-gray-400 uppercase text-xs tracking-widest flex items-center gap-2">
                            <Flame size={14} className="text-orange-500" /> Calories Burnt
                        </label>
                        <input
                            type="number"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-center font-black text-2xl outline-none focus:border-emerald-500 transition-colors"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-500 text-center">Enter value from your smartwatch</p>
                    </div>
                </Card>

                <Button
                    fullWidth
                    variant="primary"
                    className="h-14 font-black uppercase italic tracking-widest text-lg rounded-2xl"
                    onClick={saveWorkout}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save & Finish'}
                </Button>
            </div>
        )
    }

    const currentEx = allExercises[currentExerciseIdx];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            {/* Header */}
            <header className="p-6 flex items-center justify-between z-10">
                <button onClick={() => navigate('/fitness')} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                    <X size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xs font-black uppercase tracking-widest text-emerald-400 italic">Day {currentDay.day}</h2>
                    <p className="text-sm font-bold">{currentDay.focus}</p>
                </div>
                <div className="w-10"></div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 relative">
                {/* Background Decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

                {/* Timer */}
                <div className="text-center space-y-2 relative z-10" onClick={() => setIsActive(!isActive)}>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer ${isActive ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                        <Timer size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">{isActive ? 'Active' : 'Paused'}</span>
                    </div>
                    <h1 className="text-8xl font-black tracking-tighter tabular-nums font-mono italic text-white drop-shadow-2xl">
                        {formatTime(seconds)}
                    </h1>
                </div>

                {/* Fire-Boltt Connection Panel */}
                <div className="text-center space-y-4 relative z-10 w-full max-w-sm px-6">
                    {btError && (
                        <div className="bg-red-500/10 border border-red-500/30 p-2 rounded-xl text-[10px] text-red-500 font-bold mb-2">
                            {btError}
                        </div>
                    )}

                    {!heartRate ? (
                        <div
                            onClick={startBluetoothSync}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                    <Activity size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-black uppercase text-white/50 tracking-widest">Smart Watch</p>
                                    <p className="text-sm font-bold text-white">Connect Fire-Boltt</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-white/30" />
                        </div>
                    ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity size={18} className="text-emerald-500 animate-pulse" />
                                <div className="text-left">
                                    <p className="text-xs font-black uppercase text-emerald-500/50 tracking-widest">Heart Rate</p>
                                    <p className="text-lg font-black text-emerald-400">{heartRate} BPM</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Current Exercise Card */}
                {currentEx && (
                    <div className="w-full max-w-sm space-y-4 animate-in slide-in-from-bottom-8 duration-500">
                        <Card className="bg-white/10 border-white/5 backdrop-blur-xl p-6 border-none text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white/10 rounded-2xl">
                                        <Dumbbell size={24} />
                                    </div>
                                    <span className="text-4xl font-black italic opacity-20">#{currentExerciseIdx + 1}</span>
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight mb-1">{currentEx.name}</h3>
                                <p className="text-sm text-gray-400 font-medium mb-6">Target: {currentEx.reps} reps</p>

                                {currentEx.notes && (
                                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 mb-6">
                                        <p className="text-xs text-blue-300 font-bold flex gap-2">
                                            <Info size={14} /> {currentEx.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {Array.from({ length: currentEx.sets }).map((_, i) => (
                                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < completedSets ? 'bg-emerald-500' : i === completedSets ? 'bg-white animate-pulse' : 'bg-white/10'
                                            }`} />
                                    ))}
                                </div>
                                <div className="mt-2 flex justify-between text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                    <span>Set {completedSets + 1} of {currentEx.sets}</span>
                                    <span>{Math.round(((currentExerciseIdx) / allExercises.length) * 100)}% Complete</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 flex gap-4">
                <Button
                    variant="ghost"
                    className="h-16 w-20 rounded-2xl bg-white/5 hover:bg-white/10 text-white"
                    onClick={() => setIsActive(!isActive)}
                >
                    {isActive ? <Pause size={24} /> : <Play size={24} />}
                </Button>

                <Button
                    variant="primary"
                    fullWidth
                    className="h-16 rounded-2xl text-lg font-black italic uppercase tracking-wider shadow-xl shadow-primary/20"
                    onClick={handleNext}
                >
                    {/* Logic: if last set of last exercise -> Finish, else Next Set/Exercise */}
                    {completedSets >= (currentEx?.sets || 1) - 1
                        ? (currentExerciseIdx >= allExercises.length - 1 ? 'Finish Workout' : 'Next Exercise')
                        : 'Next Set'
                    }
                    <ChevronRight size={20} className="ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default WorkoutSession;
