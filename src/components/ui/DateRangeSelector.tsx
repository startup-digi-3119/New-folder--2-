import React from 'react';

export type DayRange = 'today' | 'yesterday' | '3days' | '7days' | '30days' | '60days';

interface DateRangeSelectorProps {
    value: DayRange;
    onChange: (range: DayRange) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ value, onChange }) => {
    const options: { label: string; value: DayRange }[] = [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 3 Days', value: '3days' },
        { label: 'Last 7 Days', value: '7days' },
        { label: 'Last 30 Days', value: '30days' },
        { label: 'Last 60 Days', value: '60days' },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${value === opt.value
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

export default DateRangeSelector;
