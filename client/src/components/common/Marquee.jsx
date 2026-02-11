import React from 'react';

const Marquee = ({ text = "#TRAVOLLET", className = "" }) => {
    
    const repeatCount = 10;

    return (
        <div className={`overflow-hidden whitespace-nowrap py-0 bg-white ${className}`}>
            <div className="inline-block animate-scroll w-max">
                {[...Array(repeatCount)].map((_, index) => (
                    <span
                        key={index}
                        className="mx-6 text-7xl md:text-9xl font-black uppercase tracking-tight font-display select-none"
                        style={{
                            WebkitTextStroke: '1.5px black',
                            color: 'transparent',
                        }}
                    >
                        {text}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Marquee;
