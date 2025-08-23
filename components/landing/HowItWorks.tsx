import React, { useRef } from 'react';
import useOnScreen from '../../hooks/useOnScreen';
import { UploadIcon, BrainIcon, EyeIcon } from '../Icons';

const steps = [
    {
        icon: <UploadIcon className="w-10 h-10 text-cyan-400" />,
        title: 'Submit Content',
        description: 'Provide any text, image, or video. Our system accepts multiple formats for a comprehensive analysis.',
    },
    {
        icon: <BrainIcon className="w-10 h-10 text-cyan-400" />,
        title: 'AI Analysis',
        description: 'Our multimodal AI, powered by Google Gemini, dissects the content for manipulation patterns and propaganda techniques.',
    },
    {
        icon: <EyeIcon className="w-10 h-10 text-cyan-400" />,
        title: 'Get Clarity',
        description: 'Receive a clear, concise, and easy-to-understand breakdown of the findings, empowering you to see the truth.',
    }
];

const Step = ({ step, index }: { step: typeof steps[0], index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref, '-200px');
    const isOdd = index % 2 !== 0;

    return (
        <div 
            ref={ref}
            className={`w-full flex items-center md:justify-between my-8 md:my-0 ${isOdd ? 'md:flex-row-reverse' : 'md:flex-row'}`}
        >
            <div 
                className={`w-full md:w-5/12 bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-lg
                    transition-all duration-700 
                    ${isVisible ? (isOdd ? 'animate-[slide-in-left_0.7s_ease-out_forwards]' : 'animate-[slide-in-right_0.7s_ease-out_forwards]') : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
            >
                 <div className="flex items-center gap-4">
                   <div className="bg-neutral-800 p-3 rounded-full">{step.icon}</div>
                   <span className="font-clash text-6xl font-semibold text-neutral-700">0{index + 1}</span>
                </div>
                <h3 className="font-clash text-3xl font-semibold mt-6 text-gray-200">{step.title}</h3>
                <p className="text-gray-400 mt-2">{step.description}</p>
            </div>

            <div className="hidden md:flex flex-shrink-0 items-center justify-center w-24">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-neutral-900 border-4 border-neutral-700 transition-transform duration-500 ${isVisible ? 'scale-100' : 'scale-0'}`}>
                    <div className={`w-3 h-3 rounded-full bg-cyan-400 ${isVisible ? 'animate-[node-pulse_2s_infinite_ease-in-out]' : ''}`} />
                </div>
            </div>
            
            <div className="hidden md:block w-5/12"></div>
        </div>
    );
};


const HowItWorks: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref, '-40%');

    return (
        <section ref={ref} id="how-it-works" className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="font-clash text-5xl md:text-7xl font-bold">
                       A Simple Path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Truth.</span>
                    </h2>
                    <p className="text-lg text-gray-400 mt-6 max-w-3xl mx-auto">
                        Our process is designed for clarity and ease of use. In just three steps, we transform suspicion into certainty.
                    </p>
                </div>
                
                <div className="mt-20 relative">
                    <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-1 bg-neutral-800 hidden md:block" aria-hidden="true">
                        <div 
                            className="w-full bg-gradient-to-b from-cyan-400 to-purple-500"
                            style={{ 
                                height: isVisible ? '100%' : '0%',
                                transition: 'height 1.5s cubic-bezier(0.25, 1, 0.5, 1)'
                            }}
                        ></div>
                    </div>
                    
                    <div className="relative flex flex-col items-center gap-16 md:gap-0">
                        {steps.map((step, index) => (
                            <Step key={step.title} step={step} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;