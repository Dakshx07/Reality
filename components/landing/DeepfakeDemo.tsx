import React, { useRef } from 'react';
import useOnScreen from '../../hooks/useOnScreen';

const DeepfakeDemo: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref, '-200px');

    return (
        <div ref={ref} className="w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <p className="font-clash text-lg font-medium text-cyan-400">DEEPFAKE RADAR</p>
                <h3 className="font-clash font-semibold text-5xl text-gray-200 mt-2">Expose Digital Puppets.</h3>
                <p className="text-gray-400 text-lg mt-4">Our advanced AI analyzes images and videos with startling precision, detecting the subtle artifacts and inconsistencies that give away sophisticated deepfakes.</p>
            </div>
            
            <div 
                className={`relative aspect-video rounded-2xl transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex items-center justify-center">
                    <div className="text-center">
                        <div className={`transition-opacity duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                            <p className="text-red-400 font-clash font-bold text-8xl md:text-9xl tracking-tighter" style={{ animation: isVisible ? 'glitch-in 0.5s 0.5s both' : 'none' }}>
                                92%
                            </p>
                            <p className="font-clash text-2xl text-gray-300 tracking-widest" style={{ animation: isVisible ? 'glitch-in 0.5s 0.6s both' : 'none' }}>
                                DEEPFAKE
                            </p>
                        </div>
                    </div>
                </div>

                <img 
                    src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=2080&auto=format&fit=crop" 
                    alt="Face" 
                    className="w-2/3 absolute top-1/2 left-0 -translate-x-1/3 -translate-y-1/2 rounded-xl shadow-2xl transition-transform duration-1000"
                    style={{ transform: isVisible ? 'translate(-33%, -50%) rotateY(20deg) rotateX(5deg)' : 'translate(-33%, -50%)', transformStyle: 'preserve-3d' }}
                />
            </div>
        </div>
    );
};

export default DeepfakeDemo;