import React from 'react';
import { DocumentTextIcon, PhotoIcon, CubeTransparentIcon, UserCircleIcon, GlobeAltIcon, SparklesIcon } from '../Icons';

const features = [
    { name: "Deepfake Detection", icon: <PhotoIcon className="w-5 h-5"/> },
    { name: "Propaganda Analysis", icon: <DocumentTextIcon className="w-5 h-5"/> },
    { name: "AR Fact-Checking", icon: <CubeTransparentIcon className="w-5 h-5"/> },
    { name: "Immunity Profile", icon: <UserCircleIcon className="w-5 h-5"/> },
    { name: "Spread Visualization", icon: <GlobeAltIcon className="w-5 h-5"/> },
    { name: "Powered by Gemini", icon: <SparklesIcon className="w-5 h-5 text-yellow-400"/> },
];

const FeaturesScroller: React.FC = () => {
    const duplicatedFeatures = [...features, ...features];

    return(
        <div className="w-full py-8 overflow-hidden relative">
             <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
             <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
            <div className="flex animate-[scroll-left_30s_linear_infinite]">
                {duplicatedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center mx-6 flex-shrink-0">
                       {feature.icon}
                        <span className="ml-3 text-xl font-medium text-gray-400">{feature.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesScroller;