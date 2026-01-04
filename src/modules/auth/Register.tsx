import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

import { firebase } from '../../services/firebase';

const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await firebase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col justify-center px-2 py-10 animate-in fade-in duration-500">
            <div className="mb-10 text-center space-y-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h1>
                <p className="text-gray-500 font-medium">Start your journey to a better you.</p>
            </div>

            <Card className="!p-6 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs font-bold animate-in slide-in-from-top-2">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-xs font-bold animate-in slide-in-from-top-2">
                        Registration successful! Redirecting to login...
                    </div>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
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

                    <div className="flex items-start gap-2 ml-1 py-1">
                        <input type="checkbox" id="terms" className="rounded-md border-gray-300 text-primary focus:ring-primary mt-1 h-4 w-4" required />
                        <label htmlFor="terms" className="text-xs font-bold text-gray-500 leading-tight">
                            I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </label>
                    </div>

                    <Button type="submit" fullWidth size="lg" className="shadow-lg shadow-primary/20 mt-4" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'} <ShieldCheck size={20} className={loading ? 'animate-pulse' : ''} />
                    </Button>
                </form>
            </Card>

            <p className="mt-8 text-center text-sm font-medium text-gray-500">
                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
            </p>
        </div>
    );
};

export default Register;
