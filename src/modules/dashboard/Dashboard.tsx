import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-gray-800">Welcome back, Hari! 👋</h2>
                <p className="text-gray-500">Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-400">Steps</p>
                    <p className="text-2xl font-bold text-primary">8,432</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-400">Calories</p>
                    <p className="text-2xl font-bold text-secondary">450 kcal</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold mb-3">Today's Workout</h3>
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">FE</div>
                    <div>
                        <p className="font-semibold">Full Body Endurance</p>
                        <p className="text-xs text-gray-500">45 mins • Intermediate</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
