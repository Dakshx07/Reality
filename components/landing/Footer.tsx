
import React from 'react';
import { RealityShieldLogo, TwitterIcon, GithubIcon, LinkedinIcon } from '../Icons';

const Footer: React.FC = () => {
    const socialLinks = [
        { icon: <TwitterIcon className="w-6 h-6" />, href: '#' },
        { icon: <GithubIcon className="w-6 h-6" />, href: '#' },
        { icon: <LinkedinIcon className="w-6 h-6" />, href: '#' },
    ];
    return (
        <footer className="w-full border-t border-neutral-800 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto py-12 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <a href="#" className="flex items-center gap-2 mb-4">
                        <RealityShieldLogo className="h-8 w-8" />
                        <span className="font-clash text-2xl font-semibold">RealityShield</span>
                    </a>
                    <p className="text-gray-400 max-w-sm">
                        Your AI guardian against misinformation. We provide clarity in a world of digital noise.
                    </p>
                </div>
                <div className="flex flex-col items-center md:items-end">
                     <div className="flex items-center space-x-6 mb-4">
                        {socialLinks.map((link, index) => (
                           <a key={index} href={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors">
                               {link.icon}
                           </a>
                        ))}
                    </div>
                    <p className="text-gray-500 text-sm">© {new Date().getFullYear()} RealityShield. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;