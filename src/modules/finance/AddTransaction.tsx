import React, { useState } from 'react';
import {
    X,
    ChevronDown,
    Camera,
    Calendar,
    CreditCard,
    Check,
    Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const categories = [
    { id: 'food', label: 'Food & Dining', icon: '🍔', color: 'bg-orange-100 text-orange-600' },
    { id: 'transport', label: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-600' },
    { id: 'fitness', label: 'Fitness', icon: '🏋️‍♂️', color: 'bg-emerald-100 text-emerald-600' },
    { id: 'software', label: 'Software/Sub', icon: '☁️', color: 'bg-purple-100 text-purple-600' },
    { id: 'rent', label: 'Rent/Bills', icon: '🏠', color: 'bg-slate-100 text-slate-600' },
    { id: 'income', label: 'Income/Salary', icon: '💰', color: 'bg-emerald-100 text-emerald-600' },
];

const AddTransaction: React.FC = () => {
    const navigate = useNavigate();
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');

    return (
        <div className="min-h-screen bg-background animate-in slide-in-from-bottom-8 duration-200">
            <header className="flex items-center justify-between p-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
                    <X size={24} />
                </button>
                <h2 className="text-xl font-black text-gray-900">Add Transaction</h2>
                <div className="w-10"></div>
            </header>

            <div className="px-6 space-y-8 pb-24">
                {/* Toggle & Amount */}
                <div className="space-y-6 text-center">
                    <div className="inline-flex bg-gray-100 p-1 rounded-2xl">
                        <button
                            onClick={() => setType('expense')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${type === 'expense' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                        >
                            Expense
                        </button>
                        <button
                            onClick={() => setType('income')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${type === 'income' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                        >
                            Income
                        </button>
                    </div>

                    <div className="relative inline-block">
                        <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-300">$</span>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="bg-transparent text-6xl font-black text-gray-900 border-none outline-none w-full max-w-[250px] text-center placeholder:text-gray-200"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <section className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <div className="grid grid-cols-3 gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-3xl transition-all border-2 ${category === cat.id ? 'border-primary bg-primary/5' : 'border-transparent bg-white shadow-sm'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${cat.color}`}>
                                    {cat.icon}
                                </div>
                                <span className="text-[10px] font-bold text-gray-800">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Details List */}
                <Card className="!p-0 overflow-hidden divide-y divide-gray-50">
                    <div className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-all">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <Calendar size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                            <p className="font-bold text-gray-800">Today</p>
                        </div>
                        <ChevronDown size={20} className="text-gray-300" />
                    </div>

                    <div className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-all">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <Tag size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</p>
                            <input
                                type="text"
                                placeholder="E.g. Monthly Rent"
                                className="w-full bg-transparent border-none outline-none font-bold text-gray-800 placeholder:text-gray-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-all">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <CreditCard size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Method</p>
                            <p className="font-bold text-gray-800">Mastercard **** 4242</p>
                        </div>
                        <ChevronDown size={20} className="text-gray-300" />
                    </div>
                </Card>

                {/* Receipt Upload */}
                <button className="w-full py-8 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-all">
                    <Camera size={32} />
                    <span className="text-xs font-bold uppercase tracking-widest">Add Receipt Photo</span>
                </button>

                {/* Action Button */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100">
                    <Button variant="primary" fullWidth className="py-4 shadow-xl shadow-primary/20" onClick={() => navigate(-1)}>
                        <Check size={20} className="mr-2" /> Save Transaction
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;
