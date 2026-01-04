import React, { useState } from 'react';
import {
    Sparkles,
    Dumbbell,
    Target,
    Info,
    Check,
    Zap,
    Flame,
    Scale
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const WorkoutPlanner: React.FC = () => {
    const [goal, setGoal] = useState('muscle');
    const [level, setLevel] = useState('intermediate');
    const [days, setDays] = useState(4);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    const generatePlan = async () => {
        setIsGenerating(true);
        setAiResponse(null);
        try {
            const response = await fetch('/api/generate-workout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an elite fitness coach. Generate a structured workout plan based on the user parameters. Return a concise plan with exercise names, sets, and reps.'
                        },
                        {
                            role: 'user',
                            content: `Generate a ${days}-day per week workout plan for a ${level} level user with the goal: ${goal}.`
                        }
                    ]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = typeof data.error === 'string'
                    ? data.error
                    : data.error?.message || JSON.stringify(data.error) || 'AI request failed';
                throw new Error(errorMessage);
            }

            setAiResponse(data.choices[0].message.content);
        } catch (err: any) {
            console.error('AI Generation failed:', err);
            const displayError = err.message || 'Unknown error occurred';
            setAiResponse(`Failed to connect to AI: ${displayError}. Please ensure your PERPLEXITY_API_KEY is configured in your Vercel Project Settings.`);
        } finally {
            setIsGenerating(false);
        }
    };

    const goals = [
        { id: 'muscle', label: 'Build Muscle', icon: <Dumbbell size={20} />, color: 'text-primary' },
        { id: 'weight', label: 'Lose Weight', icon: <Flame size={20} />, color: 'text-orange-500' },
        { id: 'strength', label: 'Max Strength', icon: <Zap size={20} />, color: 'text-emerald-500' },
        { id: 'tone', label: 'Body Toning', icon: <Scale size={20} />, color: 'text-purple-500' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            <header className="flex flex-col gap-2 px-1">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Sparkles className="text-primary animate-pulse" size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Generator</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900">Custom Plan</h2>
                <p className="text-gray-500 font-medium">Create your perfect workout in seconds.</p>
            </header>

            {/* Goal Selection */}
            <section className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Main Goal</label>
                <div className="grid grid-cols-2 gap-4">
                    {goals.map(g => (
                        <button
                            key={g.id}
                            onClick={() => setGoal(g.id)}
                            className={`flex flex-col items-start gap-4 p-6 rounded-3xl transition-all border-2 text-left ${goal === g.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white shadow-sm'
                                }`}
                        >
                            <div className={`p-3 rounded-2xl bg-white shadow-sm ${g.color}`}>
                                {g.icon}
                            </div>
                            <span className="font-bold text-gray-900">{g.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Difficulty Level */}
            <section className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Experience Level</label>
                <div className="flex p-1 bg-gray-100 rounded-2xl gap-1">
                    {['beginner', 'intermediate', 'advanced'].map(l => (
                        <button
                            key={l}
                            onClick={() => setLevel(l)}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold capitalize transition-all ${level === l ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </section>

            {/* Schedule Selection */}
            <section className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Days per Week</label>
                    <span className="text-lg font-black text-primary">{days} Days</span>
                </div>
                <input
                    type="range"
                    min="2"
                    max="7"
                    step="1"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none accent-primary cursor-pointer border-none"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                    <span>Weekend Warrior</span>
                    <span>Professional Athlete</span>
                </div>
            </section>

            {/* Blueprint Card */}
            <Card className="!bg-slate-900 text-white border-none !p-8 relative overflow-hidden min-h-[240px]">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Target className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Your Blueprint</h4>
                            <p className="text-xs text-white/50">{isGenerating ? 'AI is crafting your routine...' : 'Ready to build'}</p>
                        </div>
                    </div>

                    {isGenerating ? (
                        <div className="flex flex-col gap-3 py-4 animate-in fade-in duration-500">
                            <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                            <div className="h-4 bg-white/5 rounded-full w-2/3 animate-pulse"></div>
                        </div>
                    ) : aiResponse ? (
                        <div className="text-sm text-white/90 whitespace-pre-wrap font-mono leading-relaxed max-h-[300px] overflow-y-auto pr-2 custom-scrollbar animate-in zoom-in-95 duration-500">
                            {aiResponse}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Check size={16} className="text-emerald-400" />
                                <span className="text-white/80 font-medium capitalize">{goal.replace('_', ' ')} Focus</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Check size={16} className="text-emerald-400" />
                                <span className="text-white/80 font-medium capitalize">{level} Experience</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Check size={16} className="text-emerald-400" />
                                <span className="text-white/80 font-medium">{days} Days / Week</span>
                            </div>
                        </div>
                    )}
                </div>
                <Sparkles className={`absolute -right-8 -top-8 text-primary/20 transition-all duration-1000 ${isGenerating ? 'scale-125 rotate-12' : ''}`} size={160} />
            </Card>

            <div className="space-y-4 pt-4">
                <Button
                    variant="primary"
                    fullWidth
                    disabled={isGenerating}
                    className="py-5 rounded-3xl text-lg font-black italic uppercase tracking-widest shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
                    onClick={generatePlan}
                >
                    {isGenerating ? 'Generating...' : 'Generate My Plan'} <Sparkles className={`${isGenerating ? 'animate-spin' : ''}`} size={20} />
                </Button>
                <p className="text-center text-[10px] font-bold text-gray-400 flex items-center justify-center gap-2">
                    <Info size={14} /> Powered by Perplexity AI
                </p>
            </div>
        </div>
    );
};

export default WorkoutPlanner;
