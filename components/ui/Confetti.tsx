import React from 'react';

const ConfettiPiece: React.FC<{ delay: number, color: string }> = ({ delay, color }) => {
    const left = Math.random() * 100;
    const duration = Math.random() * 2 + 1; // 1s to 3s
    
    return (
        <div
            className={`absolute top-0 w-2 h-4 ${color} animate-[confetti-burst_${duration}s_ease-out_forwards]`}
            style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                transform: `rotate(${Math.random() * 360}deg)`
            }}
        />
    );
};

const Confetti: React.FC = () => {
    const colors = ['bg-yellow-400', 'bg-green-400', 'bg-cyan-400', 'bg-purple-400'];
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        color: colors[i % colors.length]
    }));

    return (
        <div className="absolute inset-0 flex justify-center pointer-events-none z-50">
            <div className="relative w-full h-1/2">
                {pieces.map(p => (
                    <ConfettiPiece key={p.id} delay={p.delay} color={p.color} />
                ))}
            </div>
        </div>
    );
};

export default Confetti;