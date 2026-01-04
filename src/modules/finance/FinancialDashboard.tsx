import React from 'react';
import {
    Activity,
    PieChart,
    Wallet,
    Plus,
    Trash2,
    Edit2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DateRangeSelector, { type DayRange } from '../../components/ui/DateRangeSelector';

import { neon } from '../../services/neon';
import { useAuth } from '../../store/AuthContext';
import { useUI } from '../../store/UIContext';

const FinancialDashboard: React.FC = () => {
    const { user } = useAuth();
    const { openModal } = useUI();
    const [transactions, setTransactions] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [totals, setTotals] = React.useState({ balance: 0, income: 0, expense: 0 });
    const [range, setRange] = React.useState<DayRange>('7days');

    const handleDeleteTransaction = async (id: number) => {
        if (!window.confirm('Delete this transaction?')) return;
        try {
            await neon.query('DELETE FROM transactions WHERE id = $1', [id]);
            setTransactions(prev => prev.filter(t => t.id !== id));
            // Recalculate totals
            const item = transactions.find(t => t.id === id);
            if (item) {
                const amount = Number(item.amount);
                setTotals(prev => ({
                    ...prev,
                    income: item.type === 'income' ? prev.income - amount : prev.income,
                    expense: item.type === 'expense' ? prev.expense - amount : prev.expense,
                    balance: item.type === 'income' ? prev.balance - amount : prev.balance + amount
                }));
            }
        } catch (err) {
            console.error('Error deleting transaction:', err);
        }
    };

    React.useEffect(() => {
        if (!user) return;

        const fetchTransactions = async () => {
            try {
                let query = 'SELECT * FROM transactions WHERE user_id = $1';
                const now = new Date();
                let filterDate: Date | null = null;

                switch (range) {
                    case 'today': filterDate = new Date(now.setHours(0, 0, 0, 0)); break;
                    case 'yesterday': filterDate = new Date(new Date(now.setDate(now.getDate() - 1)).setHours(0, 0, 0, 0)); break;
                    case '3days': filterDate = new Date(now.setDate(now.getDate() - 3)); break;
                    case '7days': filterDate = new Date(now.setDate(now.getDate() - 7)); break;
                    case '30days': filterDate = new Date(now.setDate(now.getDate() - 30)); break;
                    case '60days': filterDate = new Date(now.setDate(now.getDate() - 60)); break;
                }

                if (filterDate) {
                    query += ` AND date >= '${filterDate.toISOString().split('T')[0]}'`;
                    if (range === 'yesterday') {
                        const endOfYesterday = new Date(filterDate);
                        endOfYesterday.setHours(23, 59, 59, 999);
                        query += ` AND date <= '${endOfYesterday.toISOString().split('T')[0]}'`;
                    }
                }

                const result = await neon.query(query, [user.id]);
                const data = result.rows;
                const sortedData = (data || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setTransactions(sortedData);

                const income = (data || [])
                    .filter((t: any) => t.type === 'income')
                    .reduce((acc: number, current: any) => acc + Number(current.amount), 0);

                const expense = (data || [])
                    .filter((t: any) => t.type === 'expense')
                    .reduce((acc: number, current: any) => acc + Number(current.amount), 0);

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
    }, [user, range]);
    return (
        <div className="space-y-8 animate-in fade-in duration-100 pb-24">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Financials</h2>
                    <p className="text-gray-500 font-medium">Clear overview of your net worth.</p>
                </div>
                <Button variant="primary" size="sm" className="rounded-2xl px-4" onClick={() => openModal('transaction')}>
                    <Plus size={20} />
                </Button>
            </header>

            <DateRangeSelector value={range} onChange={setRange} />

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
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="!p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <PieChart className="text-primary" size={20} />
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 italic">Spending Breakdown</h4>
                    </div>
                    {transactions.length > 0 && totals.expense > 0 ? (
                        <div className="space-y-3">
                            {Array.from(new Set(transactions.filter(t => t.type === 'expense').map(t => t.category))).map(cat => {
                                const total = transactions.filter(t => t.type === 'expense' && t.category === cat).reduce((acc, curr) => acc + Number(curr.amount), 0);
                                const percentage = Math.round((total / totals.expense) * 100);
                                return (
                                    <div key={cat} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                            <span className="text-xs font-bold text-gray-600">{cat}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-gray-400">{percentage}%</span>
                                            <span className="text-xs font-black text-gray-900">₹{total.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center gap-2 opacity-50">
                            <PieChart size={32} className="text-gray-200" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No data available</p>
                        </div>
                    )}
                </Card>
                <Card className="!p-6 flex flex-col items-center justify-center text-center gap-3">
                    <Activity className="text-emerald-500" size={32} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Net Worth Trend <br /> <span className="text-emerald-500">Live</span></p>
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
                            <Card key={transaction.id} className="flex items-center justify-between !p-4 hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${transaction.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                        <Wallet size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{transaction.description || transaction.category}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className={`text-sm font-black italic ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {transaction.type === 'income' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN')}
                                    </p>
                                    <div className="flex items-center transition-all">
                                        <button
                                            onClick={() => {
                                                // We'll update the global modal system in MainLayout to support editing
                                                alert("Edit functionality is being integrated. Please use the 'New Entry' for now if needed, or wait for the update.");
                                            }}
                                            className="p-2 text-gray-400 hover:text-primary"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTransaction(transaction.id)}
                                            className="p-2 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default FinancialDashboard;
