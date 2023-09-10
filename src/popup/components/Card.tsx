import React from 'react';

// Define Card component interface for type checking
interface ICardProps {
    className?: string;
    children: React.ReactNode;
    [x: string]: any;
}

// Define Card stateless functional component
const Card: React.FC<ICardProps> = ({ children, className, ...rest }) => {
    const defaultClass = 'card text-center';
    const combinedClasses = className ? `${defaultClass} ${className}` : defaultClass;
    // Render Card component
    return (
        <div className={combinedClasses} {...rest}>
            {children}
        </div>
    );
}

// Export Card component
export default Card;