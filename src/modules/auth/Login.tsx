import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, Chrome, Eye, EyeOff, Activity } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

import { firebase } from '../../services/firebase';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await firebase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col justify-center px-2 py-10 animate-in fade-in duration-500">
            <div className="mb-10 text-center space-y-2">
                <div className="inline-flex p-3 bg-primary/10 rounded-3xl text-primary mb-2">
                    <Activity size={32} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
                <p className="text-gray-500 font-medium">Elevate your productivity today.</p>
            </div>

            <Card className="!p-6 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs font-bold animate-in slide-in-from-top-2">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-bold text-gray-700">Password</label>
                            <Link to="/reset-password" title="Forgot Password" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-1">
                        <input type="checkbox" id="remember" className="rounded-md border-gray-300 text-primary focus:ring-primary h-4 w-4" />
                        <label htmlFor="remember" className="text-xs font-bold text-gray-500">Keep me logged in</label>
                    </div>

                    <Button type="submit" fullWidth size="lg" className="shadow-lg shadow-primary/20 mt-4" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={20} className={loading ? 'animate-pulse' : ''} />
                    </Button>
                </form>

                <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <span className="relative px-4 bg-white text-xs font-bold text-gray-400 uppercase">Or continue with</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" fullWidth className="border-gray-100 hover:bg-gray-50 text-gray-700">
                        <Chrome size={20} /> Google
                    </Button>
                    <Button variant="outline" fullWidth className="border-gray-100 hover:bg-gray-50 text-gray-700">
                        <Github size={20} /> Github
                    </Button>
                </div>
            </Card>

            <p className="mt-8 text-center text-sm font-medium text-gray-500">
                New to MyPlan? <Link to="/register" className="text-primary font-bold hover:underline">Create an account</Link>
            </p>
        </div>
    );
};

export default Login;
