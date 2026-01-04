import React, { useState, useEffect } from 'react';
import {
    Play,
    Pause,
    RotateCcw,
    ChevronRight,
    X,
    Timer,
    Flame,
    Activity,
    ShieldAlert
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { bluetoothManager } from '../../services/bluetooth';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../store/AuthContext';

const WorkoutSession: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [heartRate, setHeartRate] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [btError, setBtError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const saveWorkout = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const { error } = await supabase.from('workouts').insert({
                user_id: user.id,
                name: `Workout Session #${id?.slice(0, 4) || 'New'}`,
                duration_seconds: seconds,
                average_hr: heartRate,
                calories_burned: Math.floor(seconds * (heartRate > 0 ? 0.1 : 0.05)),
            });

            if (error) throw error;
            navigate('/fitness');
        } catch (err: any) {
            console.error('Failed to save workout:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const checkBluetoothSupport = () => {
        if (!navigator.bluetooth) {
            setBtError('Bluetooth API not supported in this browser. Try Chrome or Edge.');
            return false;
        }
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            setBtError('Web Bluetooth requires a secure HTTPS connection. Please deploy or use local testing.');
            return false;
        }
        return true;
    };

    const startBluetoothSync = async () => {
        setBtError(null);
        if (!checkBluetoothSupport()) return;

        setIsSyncing(true);
        try {
            await bluetoothManager.requestDevice();
            await bluetoothManager.connect((bpm) => {
                setHeartRate(bpm);
            });
        } catch (error: any) {
            console.error('BT Sync Error:', error);
            setBtError(error.message || 'Failed to connect to device.');
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const exercise: any = null; // Purged demo exercise

    return (
        <div className="min-h-screen bg-slate-900 text-white animate-in slide-in-from-right duration-500">
            <header className="p-6 flex items-center justify-between border-b border-white/10">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-xl">
                    <X size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-sm font-black uppercase tracking-widest text-emerald-400 italic">No Session Active</h2>
                    <p className="text-[10px] font-bold text-white/50 uppercase">Session #{id || '0'}</p>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="p-6 space-y-8 pb-32">
                {/* Timer UI */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-white/70">
                        <Timer size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest underline decoration-emerald-500/50 underline-offset-4">Timer Ready</span>
                    </div>
                    <h1 className="text-7xl font-black tracking-tighter tabular-nums font-mono italic">
                        {formatTime(seconds)}
                    </h1>
                </div>

                {/* Empty State Card */}
                {!exercise ? (
                    <Card className="bg-white/5 border-white/10 p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed">
                        <Activity className="text-white/10" size={60} />
                        <div className="space-y-1">
                            <h3 className="text-lg font-black italic uppercase tracking-tight">Empty Session</h3>
                            <p className="text-xs text-white/40 font-bold max-w-xs">Return to the Fitness Dashboard to start a generated workout plan or select exercises manually.</p>
                        </div>
                        <Button variant="ghost" className="bg-white/10 text-white rounded-xl px-6 h-12" onClick={() => navigate('/fitness')}>Return to Fitness</Button>
                    </Card>
                ) : (
                    <Card className="bg-white/5 border-white/10 p-0 overflow-hidden relative group">
                        <div className="p-12 text-center text-white/20">
                            Session details not available
                        </div>
                    </Card>
                )}

                {/* Bluetooth Error Alert */}
                {btError && (
                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                        <ShieldAlert className="text-red-500 shrink-0" size={20} />
                        <div className="space-y-1">
                            <p className="text-xs font-black text-red-500 uppercase tracking-widest">Security Restriction</p>
                            <p className="text-[10px] font-bold text-red-400 leading-relaxed">{btError}</p>
                        </div>
                    </div>
                )}

                {/* Real-time Heatrate / Smartwatch */}
                <div className="grid grid-cols-2 gap-4">
                    <Card
                        className={`p-4 flex items-center gap-3 transition-all cursor-pointer group ${heartRate > 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                        onClick={startBluetoothSync}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${heartRate > 0 ? 'bg-emerald-500/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                            <Activity size={20} className={`${heartRate > 0 ? 'text-emerald-500 animate-pulse' : 'text-white/40 group-hover:text-white/60'}`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-tighter">{isSyncing ? 'Linking...' : 'Sync Watch'}</p>
                            <p className="text-lg font-black italic">{heartRate || '--'} <span className="text-[10px] text-white/50 not-italic uppercase">bpm</span></p>
                        </div>
                    </Card>
                    <Card className="bg-white/5 border-white/10 p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                            <Flame size={20} className="text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-tighter">Energy</p>
                            <p className="text-lg font-black italic">-- <span className="text-[10px] text-white/50 not-italic uppercase">kcal</span></p>
                        </div>
                    </Card>
                </div>

                {/* Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 flex gap-4">
                    <Button
                        variant="ghost"
                        className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center p-0 transition-transform active:scale-95"
                        onClick={() => setIsActive(!isActive)}
                    >
                        {isActive ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
                    </Button>

                    <Button
                        variant="primary"
                        fullWidth
                        disabled={isSaving}
                        className="h-16 rounded-3xl text-lg font-black italic uppercase tracking-wider shadow-2xl shadow-emerald-500/20 disabled:opacity-50"
                        onClick={saveWorkout}
                    >
                        {isSaving ? 'Saving...' : 'Finish Session'}
                        <ChevronRight size={24} className="ml-2" />
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center p-0 transition-transform active:scale-95"
                        onClick={() => {
                            setSeconds(0);
                            setIsActive(false);
                        }}
                    >
                        <RotateCcw size={28} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutSession;
