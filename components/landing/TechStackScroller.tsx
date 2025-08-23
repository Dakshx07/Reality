import React from 'react';
import { GeminiIcon, ReactIcon, TailwindIcon } from '../Icons';

const techs = [
    { name: "Google Gemini", icon: <GeminiIcon className="w-10 h-10 text-purple-400"/> },
    { name: "React", icon: <ReactIcon className="w-10 h-10 text-cyan-400"/> },
    { name: "Tailwind CSS", icon: <TailwindIcon className="w-10 h-10 text-sky-400"/> },
    { name: "TypeScript", icon: <span className="font-bold text-3xl text-blue-400">TS</span> },
    { name: "Vite", icon: <span className="text-4xl">⚡</span> },
];

const TechStackScroller: React.FC = () => {
    const duplicatedTechs = [...techs, ...techs, ...techs];

    return (
        <section className="w-full py-16">
            <div className="text-center mb-8">
                <h3 className="font-clash text-3xl font-medium text-gray-400">Powered by Cutting-Edge Technology</h3>
            </div>
            <div className="w-full overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
                <div className="flex animate-[scroll-left_40s_linear_infinite]">
                    {duplicatedTechs.map((tech, index) => (
                        <div key={index} className="flex items-center justify-center mx-8 flex-shrink-0 w-48 h-24 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
                           <div className="flex items-center gap-4">
                               {tech.icon}
                               <span className="text-xl font-medium text-gray-300">{tech.name}</span>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStackScroller;
