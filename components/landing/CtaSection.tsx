
import React from 'react';

interface CtaSectionProps {
  onLaunch: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ onLaunch }) => {
    return (
        <section className="w-full py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center border border-neutral-800 rounded-2xl p-8 md:p-16 relative overflow-hidden bg-neutral-900">
                 <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,169,255,0.1),rgba(255,255,255,0))]"></div>
                <div className="relative z-10">
                    <h2 className="font-clash text-5xl md:text-7xl font-bold">
                        Join the Shield.
                    </h2>
                    <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto">
                        Become part of the movement against digital misinformation. Launch the app to start your journey today.
                    </p>

                    <div className="mt-12">
                         <button
                            onClick={onLaunch}
                            className="font-bold text-lg bg-white text-black py-4 px-10 rounded-full hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 ease-in-out shadow-2xl shadow-white/10"
                        >
                            Launch Guardian Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;