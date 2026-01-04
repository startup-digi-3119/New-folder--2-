import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, title, subtitle, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
        >
            {(title || subtitle) && (
                <div className="mb-4">
                    {title && <h3 className="text-lg font-bold text-gray-800 tracking-tight">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
