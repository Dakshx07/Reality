import React, { useRef, useEffect } from 'react';
import { HeroShieldIcon, DocumentTextIcon, PhotoIcon, CubeTransparentIcon, TagIcon } from '../Icons';

interface HeroSectionProps {
  onLaunch: () => void;
}

const Planet: React.FC<{
    icon: React.ReactNode;
    orbitRadius: number;
    orbitDuration: number;
    initialRotation: number;
}> = ({ icon, orbitRadius, orbitDuration, initialRotation }) => {
    return (
        <div 
            className="absolute top-1/2 left-1/2"
            style={{
                animation: `orbit ${orbitDuration}s linear infinite`,
                transform: `rotate(${initialRotation}deg)`,
            }}
        >
            <div 
                className="absolute"
                style={{
                    transform: `translateX(${orbitRadius}px) translateY(-50%)`,
                }}
            >
                <div 
                    className="w-16 h-16 md:w-20 md:h-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/15 hover:border-cyan-400/50 hover:scale-110"
                    style={{
                        animation: `counter-orbit ${orbitDuration}s linear infinite`,
                        transform: `rotate(${-initialRotation}deg)`,
                    }}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};

const HeroSection: React.FC<HeroSectionProps> = ({ onLaunch }) => {
    const sceneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!sceneRef.current) return;
            const { clientWidth, clientHeight } = document.documentElement;
            const x = (e.clientX - clientWidth / 2) / clientWidth;
            const y = (e.clientY - clientHeight / 2) / clientHeight;
            sceneRef.current.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const planets = [
        { icon: <DocumentTextIcon className="w-8 h-8 text-cyan-300"/>, radius: 140, duration: 25, rotation: 0 },
        { icon: <PhotoIcon className="w-8 h-8 text-cyan-300"/>, radius: 220, duration: 35, rotation: 120 },
        { icon: <CubeTransparentIcon className="w-8 h-8 text-cyan-300"/>, radius: 300, duration: 45, rotation: 240 },
        { icon: <TagIcon className="w-8 h-8 text-cyan-300"/>, radius: 380, duration: 55, rotation: 60 },
    ];

    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden [perspective:1000px]">
             {/* Starfield Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[200%] animate-[star-drift_200s_linear_infinite]" style={{ backgroundImage: 'radial-gradient(ellipse 1px 1px at 50% 50%, #fff, transparent)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div ref={sceneRef} className="relative z-10 transition-transform duration-200 ease-out" style={{ transformStyle: 'preserve-3d' }}>
                <div className="relative w-[300px] h-[300px] md:w-[800px] md:h-[800px] flex items-center justify-center">
                    {/* Central Sun */}
                    <div className="relative w-32 h-32 md:w-48 md:h-48 z-10 animate-sun-pulse">
                         <HeroShieldIcon className="w-full h-full" />
                    </div>
                    
                    {/* Orbit Paths */}
                    {planets.map((p, i) => (
                         <div key={i} className="absolute top-1/2 left-1/2 border border-cyan-500/10 rounded-full"
                         style={{
                            width: p.radius * 2,
                            height: p.radius * 2,
                            marginLeft: -p.radius,
                            marginTop: -p.radius,
                         }}></div>
                    ))}

                    {/* Planets */}
                    {planets.map((p, i) => (
                        <Planet key={i} icon={p.icon} orbitRadius={p.radius} orbitDuration={p.duration} initialRotation={p.rotation} />
                    ))}
                </div>
            </div>

            <div className="relative z-20 mt-[-10rem] md:mt-[-25rem] flex flex-col items-center pointer-events-none">
                <h1 className="font-clash font-bold text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-gray-50 to-gray-400 tracking-tight leading-none animate-fade-in-up">
                    RealityShield
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 mt-6 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Your AI Guardian Against Misinformation. Detect Deepfakes. Uncover Propaganda. See the Truth.
                </p>
                <div className="mt-10 animate-fade-in-up pointer-events-auto" style={{ animationDelay: '0.4s' }}>
                    <button
                        onClick={onLaunch}
                        className="font-bold text-lg bg-white text-black py-4 px-8 rounded-full hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 ease-in-out shadow-2xl shadow-white/10"
                    >
                        Launch Guardian
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
