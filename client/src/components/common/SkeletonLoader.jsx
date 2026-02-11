import React from 'react';

const SkeletonLoader = ({
    width = 'w-full',
    height = 'h-4',
    className = '',
    variant = 'rect' 
}) => {
    const baseClasses = "bg-gray-200 animate-pulse";

    const variantClasses = {
        rect: "rounded-md",
        circle: "rounded-full",
        text: "rounded h-4"
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.rect} ${width} ${height} ${className}`;

    return <div className={combinedClasses}></div>;
};

export default SkeletonLoader;
