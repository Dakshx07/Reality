import React, { useState, useEffect, useRef } from 'react';

const chaosItems = [
    "BREAKING: Cure for aging found!", "System.out.println(lie);", "Photos show aliens landed...",
    "// TODO: insert propaganda", "#F0F8FF", "BITCOIN TO $1M TOMORROW",
    "01101101 01101001 01110011", "[object Object]", "They don't want you to know this.",
    "Error: Truth not found", "rgba(255,0,85,0.8)", "SECRET health trick doctors hate.",
    "border-collapse: separate;", "while(true) { fakeNews++; }", "MARKET CRASH IMMINENT", "undefined",
];

interface ChaosNode {
    id: number;
    x: number;
    y: number;
    z: number;
    content: string;
    color: string;
}

const ThreatMatrix: React.FC = () => {
    const [nodes, setNodes] = useState<ChaosNode[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const generateNodes = () => {
            const newNodes: ChaosNode[] = [];
            for (let i = 0; i < 60; i++) {
                newNodes.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    z: Math.random() * 1200 - 600, // Depth from -600px to 600px
                    content: chaosItems[Math.floor(Math.random() * chaosItems.length)],
                    color: Math.random() > 0.5 ? 'text-red-400/70' : 'text-cyan-400/70'
                });
            }
            setNodes(newNodes);
        };
        generateNodes();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!sceneRef.current || !containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            const x = (e.clientX - clientWidth / 2) / clientWidth;
            const y = (e.clientY - clientHeight / 2) / clientHeight;
            sceneRef.current.style.transform = `translateZ(200px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        };
        
        const currentRef = containerRef.current;
        currentRef?.addEventListener('mousemove', handleMouseMove);
        return () => currentRef?.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section 
            ref={containerRef}
            className="w-full h-[70vh] md:h-[90vh] bg-neutral-900 flex items-center justify-center relative overflow-hidden my-16 [perspective:1000px]"
        >
            <div 
                ref={sceneRef} 
                className="absolute w-full h-full transition-transform duration-200 ease-out" 
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Chaos Nodes */}
                {nodes.map(node => {
                    const opacity = 1 - Math.abs(node.z / 800);
                    const scale = 1 + node.z / 1200;
                    return (
                        <div
                            key={node.id}
                            className={`absolute font-mono whitespace-nowrap p-2 rounded ${node.color}`}
                            style={{
                                left: `${node.x}%`,
                                top: `${node.y}%`,
                                transform: `translate3d(-50%, -50%, ${node.z}px) scale(${scale})`,
                                opacity: opacity,
                                textShadow: `0 0 10px currentColor`,
                            }}
                        >
                            {node.content}
                        </div>
                    );
                })}

                 {/* Central Text */}
                <div 
                    className="absolute top-1/2 left-1/2 text-center"
                    style={{
                        transform: 'translate3d(-50%, -50%, 100px)', // Bring text forward
                    }}
                >
                    <h2 className="font-clash text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-50 to-gray-300">
                        Clarity in the Chaos.
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
                        RealityShield is your instrument for navigating the complex digital landscape, separating verified facts from the noise.
                    </p>
                </div>

            </div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

        </section>
    );
};

export default ThreatMatrix;