import React, { useRef } from 'react';
import useOnScreen from '../../hooks/useOnScreen';
import { InformationCircleIcon, ShieldCheckIcon } from '../Icons';

const TrustSection: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);

    return (
        <section ref={ref} id="trust" className="w-full py-24 px-4 sm:px-6 lg:px-8">
            <div className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-center lg:text-left">
                    <p className="font-clash text-lg font-medium text-cyan-400">ETHICAL AI</p>
                    <h2 className="font-clash text-5xl md:text-7xl font-bold mt-2">
                        Trust & Transparency
                    </h2>
                    <p className="text-lg text-gray-400 mt-6 max-w-xl mx-auto lg:mx-0">
                        We believe understanding AI is as important as using it. Our "How We Know" feature provides clear, plain-English reasoning behind every analysis. We are committed to demystifying the process, outlining model limitations, and building a tool that you can trust.
                    </p>
                     <div className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-gray-300">
                        <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                        <span>Transparent Reasoning</span>
                        <ShieldCheckIcon className="w-5 h-5 text-green-400 ml-4" />
                        <span>Limitations Acknowledged</span>
                    </div>
                </div>
                <div className="relative flex items-center justify-center h-96">
                     <div className="absolute w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
                     <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl transition-transform duration-700" style={{ transform: isVisible ? 'scale(1)' : 'scale(0.9)' }}>
                        <div className="flex items-center mb-4">
                            <InformationCircleIcon className="w-6 h-6 mr-2 text-cyan-400" />
                            <h4 className="font-clash font-semibold text-xl text-gray-200">How We Know</h4>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-400">Confidence Meter</label>
                            <div className="w-full bg-neutral-800 rounded-full h-3 mt-1">
                                <div className="bg-green-500 h-3 rounded-full" style={{ width: `98%` }}></div>
                            </div>
                        </div>
                         <div className="mt-4">
                            <h5 className="text-sm font-semibold text-gray-400">Simplified Reasoning</h5>
                            <p className="text-gray-300 text-sm mt-1 bg-neutral-800/50 p-2 rounded-md">The claim matches a known and widely debunked health misinformation campaign...</p>
                        </div>
                        <div className="mt-4">
                            <h5 className="text-sm font-semibold text-gray-400">Limitations</h5>
                             <p className="text-gray-500 text-sm mt-1 list-disc list-inside">Relies on a database of known misinformation...</p>
                        </div>
                     </div>
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
