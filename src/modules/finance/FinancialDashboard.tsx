import React from 'react';
import {
    Activity,
    PieChart,
    Wallet,
    Plus
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import { neon } from '../../services/neon';
import { useAuth } from '../../store/AuthContext';
import { useUI } from '../../store/UIContext';

const FinancialDashboard: React.FC = () => {
    const { user } = useAuth();
    const { openModal } = useUI();
    const [transactions, setTransactions] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [totals, setTotals] = React.useState({ balance: 0, income: 0, expense: 0 });

    React.useEffect(() => {
        if (!user) return;

        const fetchTransactions = async () => {
            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('date', { ascending: false });

                if (error) throw error;
                setTransactions(data || []);

                const income = (data || [])
                    .filter(t => t.type === 'income')
                    .reduce((acc, current) => acc + Number(current.amount), 0);

                const expense = (data || [])
                    .filter(t => t.type === 'expense')
                    .reduce((acc, current) => acc + Number(current.amount), 0);

                setTotals({
                    income,
                    expense,
                    balance: income - expense
                });

            } catch (err) {
                console.error('Error fetching transactions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [user]);
    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Financials</h2>
                    <p className="text-gray-500 font-medium">Clear overview of your net worth.</p>
                </div>
                <Button variant="primary" size="sm" className="rounded-2xl px-4" onClick={() => openModal('transaction')}>
                    <Plus size={20} />
                </Button>
            </header>

            {/* Total Balance Card */}
            <Card className="!bg-slate-900 text-white border-none p-8 relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-white/10 rounded-xl">
                            <Wallet className="text-emerald-400" size={24} />
                        </div>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50">Master Account</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Current Balance</p>
                        <h3 className="text-5xl font-black italic tracking-tighter">₹{totals.balance.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <div className="flex-1 p-3 bg-white/10 rounded-2xl border border-white/20">
                            <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">Income</p>
                            <p className="text-sm font-bold text-emerald-400">+₹{totals.income.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex-1 p-3 bg-white/10 rounded-2xl border border-white/20">
                            <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">Expense</p>
                            <p className="text-sm font-bold text-red-400">-₹{totals.expense.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </Card>

            {/* Categories & Insights */}
            <section className="grid grid-cols-2 gap-4">
                <Card className="!p-6 flex flex-col items-center justify-center text-center gap-3">
                    <PieChart className="text-gray-200" size={32} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">No Spending Categories</p>
                </Card>
                <Card className="!p-6 flex flex-col items-center justify-center text-center gap-3">
                    <Activity className="text-gray-200" size={32} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Net Worth Trend <br /> Waiting for data</p>
                </Card>
            </section>

            {/* Recent Transactions - Empty State */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-bold text-gray-800 italic">Recent Entries</h3>
                    <Button variant="ghost" size="sm" className="text-primary font-bold">See All</Button>
                </div>
                <div className="space-y-3">
                    {loading ? (
                        <div className="flex justify-center p-8"><Activity className="animate-spin text-primary" size={24} /></div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl text-center space-y-4">
                            <Wallet size={40} className="text-gray-100" />
                            <p className="text-sm font-bold text-gray-400">No transactions recorded yet.</p>
                            <Button variant="ghost" className="text-primary font-black uppercase italic tracking-widest" onClick={() => openModal('transaction')}>New Entry</Button>
                        </div>
                    ) : (
                        transactions.map(transaction => (
                            <Card key={transaction.id} className="flex items-center justify-between !p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${transaction.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                        <Wallet size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{transaction.description || transaction.category}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className={`text-sm font-black italic ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {transaction.type === 'income' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN')}
                                </p>
                            </Card>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default FinancialDashboard;
