
import React, { useRef } from 'react';
import useOnScreen from '../../hooks/useOnScreen';
import { ShieldExclamationIcon } from '../Icons';

const IMAGE_URL = `https://images.unsplash.com/photo-1614730321944-2a81b7e6b7b2?q=80&w=1974&auto=format&fit=crop`;
const MANIPULATION_MAP_URL = `https://images.unsplash.com/photo-1614730321944-2a81b7e6b7b2?q=80&w=1974&auto=format&fit=crop&blend=ff0000&bm=multiply&bri=-20&con=40`;

const ArDemo: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref, '-200px');

    return (
        <section ref={ref} className="w-full py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h3 className="font-clash font-semibold text-5xl md:text-7xl text-gray-200 mb-4">Holographic Dissection.</h3>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                   Our AI performs a deep-level analysis, peeling back the layers of reality to expose digital manipulation.
                </p>
            </div>
            
            <div className="mt-16 w-full max-w-5xl mx-auto [perspective:2000px]">
                <div
                    className={`relative aspect-video w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                        transformStyle: 'preserve-3d',
                        animation: isVisible ? 'hologram-lift 1s ease-out forwards' : 'none',
                    }}
                >
                    {/* Hologram Base & "Truth" Layer */}
                    <div className="absolute inset-0 rounded-2xl bg-cover bg-center border border-red-500/30" style={{ backgroundImage: `url(${MANIPULATION_MAP_URL})`, transform: 'translateZ(-1px)' }}>
                        <div className="absolute inset-0 bg-neutral-900/80 flex flex-col items-center justify-center text-center p-4">
                            <div
                                className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                                style={{ transitionDelay: '2.5s' }}
                            >
                                <ShieldExclamationIcon className="w-16 h-16 text-red-500/50 mx-auto" />
                                <h3 className="font-clash text-3xl md:text-5xl font-bold text-red-400 mt-4">
                                    MANIPULATION DETECTED
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Image Facade Layer (gets peeled) */}
                    <div
                        className="absolute inset-0 rounded-2xl bg-cover bg-center overflow-hidden"
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: 'translateZ(0)',
                            animation: isVisible ? 'peel-facade 1s ease-in-out 1.5s forwards' : 'none',
                        }}
                    >
                         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGE_URL})` }}></div>
                    </div>

                    {/* Scanner Line */}
                    <div
                        className={`absolute left-0 w-full h-1 bg-cyan-400/80 shadow-[0_0_10px_theme(colors.cyan.400),0_0_20px_theme(colors.cyan.400)] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            transform: 'translateZ(1px)',
                            animation: isVisible ? 'scan-line-effect 1s ease-out 0.8s forwards' : 'none',
                        }}
                    ></div>

                    {/* Hologram Flicker Effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl border-2 border-cyan-400/20"
                      style={{
                          transform: 'translateZ(0)',
                          animation: isVisible ? 'holographic-flicker 2s steps(4, end) infinite' : 'none'
                      }}
                    ></div>
                </div>
            </div>
        </section>
    );
};

export default ArDemo;