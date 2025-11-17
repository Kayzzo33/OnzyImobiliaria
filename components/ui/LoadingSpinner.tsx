
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: number;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 48, className = ''}) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <Loader2 size={size} className="text-primary-500 animate-spin" />
        </div>
    );
};

export default LoadingSpinner;
