
import React, { useState, useEffect, useMemo } from 'react';
import type { ChallengeItem } from '../types';
import Confetti from './ui/Confetti';
import { AcademicCapIcon, CheckCircleIcon, ShieldExclamationIcon } from './Icons';
import useLocalStorage from '../hooks/useLocalStorage';

const allChallenges: ChallengeItem[] = [
  { id: 1, claim: "Eating oranges prevents COVID-19 because of Vitamin C.", isMisinfo: true, tip: "While Vitamin C is good for immunity, it's not a proven cure or prevention for COVID-19. Always check with health authorities like the WHO." },
  { id: 2, claim: "A study found that regular exercise can improve cardiovascular health.", isMisinfo: false, tip: "This claim is well-supported by scientific evidence. Reputable health organizations consistently recommend exercise." },
  { id: 3, claim: "You can charge your phone by microwaving it for 30 seconds.", isMisinfo: true, tip: "This is a dangerous hoax that can destroy your phone and microwave. Be wary of 'secret' tech tricks that defy physics." },
  { id: 4, claim: "The Eiffel Tower is located in Paris, France.", isMisinfo: false, tip: "This is a widely known and easily verifiable fact. Simple facts are rarely the subject of complex misinformation." },
  { id: 5, claim: "A picture shows a shark swimming on a flooded highway in Houston.", mediaUrl: "https://images.unsplash.com/photo-1574042353323-24143a443715?q=80&w=2070&auto=format&fit=crop", isMisinfo: true, tip: "This is a classic example of a photoshopped image that goes viral after natural disasters. Use reverse image search to find the original photo." },
  { id: 6, claim: "Drinking 8 glasses of water a day is a scientifically proven requirement for all adults.", isMisinfo: true, tip: "While hydration is crucial, the '8 glasses' rule is a general guideline, not a strict medical requirement. Individual needs vary, and water can come from food and other beverages." },
  { id: 7, claim: "The Great Wall of China is the only man-made object visible from space.", isMisinfo: true, tip: "This is a common myth. Astronauts have confirmed it's not visible to the naked eye from orbit. Other man-made structures, like city lights at night, are far more visible." },
  { id: 8, claim: "Sunflowers track the sun's movement across the sky throughout the day.", isMisinfo: false, tip: "This phenomenon, called heliotropism, is true for young sunflowers. They face east in the morning and follow the sun to the west. Mature sunflowers, however, generally remain facing east." },
  { id: 9, claim: "This image shows a rare 'rainbow' owl.", mediaUrl: "https://images.unsplash.com/photo-1555980126-56730623be3a?q=80&w=1974&auto=format&fit=crop", isMisinfo: true, tip: "This is a digitally altered image. While many birds are colorful, owls are not known to have rainbow plumage. A reverse image search would reveal the original, less colorful owl." },
  { id: 10, claim: "Humans only use 10% of their brains.", isMisinfo: true, tip: "This is a persistent myth. Brain imaging studies show that most of the brain is active almost all the time, even during sleep. Different areas are just more active during different tasks." },
  { id: 11, claim: "Cracking your knuckles causes arthritis.", isMisinfo: true, tip: "While it can be an annoying habit, numerous studies have found no link between knuckle-cracking and arthritis. The popping sound is caused by gas bubbles in the joint fluid." },
  { id: 12, claim: "Mount Everest is the tallest mountain in the world.", isMisinfo: false, tip: "Measured from sea level, Mount Everest is indeed the tallest. However, Mauna Kea in Hawaii is technically taller from its base on the ocean floor to its peak." },
  { id: 13, claim: "Goldfish have a three-second memory.", isMisinfo: true, tip: "This is a myth. Studies have shown that goldfish can remember things for at least five months and can even be trained to perform simple tasks." },
  { id: 14, claim: "Bats are blind.", isMisinfo: true, tip: "Bats are not blind. They can see, but at night they rely on their sophisticated echolocation to navigate and hunt." },
  { id: 15, claim: "Vikings wore horned helmets.", isMisinfo: true, tip: "There is no historical evidence that Vikings wore horned helmets in battle. This image was popularized by a 19th-century opera costume design." },
];

// Simple seeded shuffle to get the same "random" order for a given day
const seededShuffle = (array: ChallengeItem[], seed: string) => {
    const newArr = [...array];
    let m = newArr.length;
    let t;
    let i;
    
    // Create a numeric seed from the date string
    const numSeed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Custom pseudo-random generator
    const mulberry32 = (a: number) => {
        return () => {
          var t = a += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }
    const random = mulberry32(numSeed);

    while (m) {
        i = Math.floor(random() * m--);
        t = newArr[m];
        newArr[m] = newArr[i];
        newArr[i] = t;
    }

    return newArr;
};

const ChallengeMode: React.FC = () => {
    const [score, setScore] = useLocalStorage<number>('challengeScore', 0);
    const today = new Date().toISOString().split('T')[0];
    const [lastCompletionDate, setLastCompletionDate] = useLocalStorage<string | null>('challengeLastCompletion', null);
    
    const [streak, setStreak] = useState(0);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [answerState, setAnswerState] = useState<'correct' | 'incorrect' | 'unanswered'>('unanswered');
    const [showConfetti, setShowConfetti] = useState(false);

    // useMemo ensures that the challenges are only re-shuffled when the 'today' string changes.
    const challenges = useMemo(() => {
        return seededShuffle(allChallenges, today).slice(0, 7);
    }, [today]);
    
    // This effect resets the game state if the challenges array changes (i.e., a new day has begun).
    useEffect(() => {
        setCurrentChallengeIndex(0);
        setAnswerState('unanswered');
        setStreak(0);
    }, [challenges]);
    
    const isCompletedToday = lastCompletionDate === today;

    if (challenges.length === 0) return null;
    
    const currentChallenge = challenges[currentChallengeIndex];

    const handleAnswer = (isMisinfoGuess: boolean) => {
        if (answerState !== 'unanswered') return;
        if (isMisinfoGuess === currentChallenge.isMisinfo) {
            setAnswerState('correct');
            setScore(prev => prev + 10);
            setStreak(prev => prev + 1);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
        } else {
            setAnswerState('incorrect');
            setStreak(0);
        }
    };
    
    const handleNext = () => {
        setAnswerState('unanswered');
        if (currentChallengeIndex === challenges.length - 1) {
            setLastCompletionDate(today);
        } else {
            setCurrentChallengeIndex(prev => prev + 1);
        }
    }
    
    const GameCard = () => (
        <div key={currentChallenge.id} className="relative animate-[challenge-card-in_0.5s_ease-out_forwards]">
            {showConfetti && <Confetti />}
            {currentChallenge.mediaUrl && (
                <img src={currentChallenge.mediaUrl} alt="Challenge media" className="w-full h-64 object-cover rounded-t-2xl border-t border-x border-white/10" />
            )}
            <div className="bg-black/20 border border-white/10 p-8 rounded-b-2xl">
                 <p className="text-gray-400 text-sm font-bold tracking-widest">CHALLENGE {currentChallengeIndex + 1} / {challenges.length}</p>
                <h3 className="text-2xl md:text-3xl font-semibold text-white my-4">{currentChallenge.claim}</h3>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <button onClick={() => handleAnswer(true)} disabled={answerState !== 'unanswered'} className="py-4 text-lg font-bold bg-red-600/80 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-600/80 rounded-lg transition-all transform hover:scale-105 disabled:scale-100">False / Misinfo</button>
                    <button onClick={() => handleAnswer(false)} disabled={answerState !== 'unanswered'} className="py-4 text-lg font-bold bg-green-600/80 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-600/80 rounded-lg transition-all transform hover:scale-105 disabled:scale-100">True / Authentic</button>
                </div>
            </div>
        </div>
    );

    const ResultCard = () => {
        const isCorrect = answerState === 'correct';
        const animationClass = isCorrect ? 'animate-[scale-up-glow_0.6s_ease-out_forwards]' : 'animate-[shake-horizontal_0.5s_ease-in-out_forwards]';
        return (
            <div className={`bg-black/20 border border-white/10 rounded-2xl p-8 ${animationClass}`}>
                <div className="flex items-center gap-4">
                     {isCorrect ? <CheckCircleIcon className="w-12 h-12 text-green-400" /> : <ShieldExclamationIcon className="w-12 h-12 text-red-400" />}
                    <div>
                        <h3 className={`font-clash text-3xl font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? 'Correct!' : 'Incorrect!'}
                        </h3>
                        <p className="text-gray-400">The claim was {currentChallenge.isMisinfo ? 'indeed misinformation' : 'authentic'}.</p>
                    </div>
                </div>
                <div className="mt-6 bg-black/20 p-4 rounded-lg border border-white/10">
                    <p className="font-semibold text-cyan-300 flex items-center gap-2"><AcademicCapIcon className="w-5 h-5"/> Educational Tip:</p>
                    <p className="text-gray-300 mt-2">{currentChallenge.tip}</p>
                </div>
                <button onClick={handleNext} className="mt-8 w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 transition-colors">
                    {currentChallengeIndex === challenges.length - 1 ? 'Finish Challenge' : 'Next Challenge'}
                </button>
            </div>
        );
    };

    const CompletionScreen = () => (
         <div className="bg-black/20 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full animate-[challenge-card-in_0.5s_ease-out_forwards]">
            <CheckCircleIcon className="w-20 h-20 text-green-400" />
            <h3 className="font-clash text-4xl font-semibold text-white mt-4">Daily Challenge Complete!</h3>
            <p className="text-gray-300 text-lg mt-2">You've sharpened your skills for today. Come back tomorrow for a new set of challenges.</p>
            <div className="mt-6 bg-cyan-900/20 px-6 py-3 rounded-lg border border-cyan-500/30">
                <p className="text-cyan-300">Your total score is now <span className="font-bold">{score}</span>.</p>
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Cognitive Training Simulator</h1>
            <p className="text-xl text-gray-400 mb-8">
                {isCompletedToday ? "You've completed your training for today." : "Sharpen your skills with today's challenges."}
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {isCompletedToday ? (
                        <CompletionScreen />
                    ) : (
                        answerState === 'unanswered' ? <GameCard /> : <ResultCard />
                    )}
                </div>
                <div className="space-y-6">
                     <div className="bg-black/20 border border-white/10 rounded-2xl p-6 text-center">
                        <p className="text-gray-400 text-sm tracking-widest">TOTAL SCORE</p>
                        <p className={`font-clash text-7xl font-bold text-cyan-300 transition-transform duration-300 ${answerState === 'correct' ? 'animate-score-pop' : ''}`}>{score}</p>
                    </div>
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-6 text-center">
                        <p className="text-gray-400 text-sm tracking-widest">CURRENT STREAK</p>
                        <p className={`font-clash text-7xl font-bold text-yellow-400 transition-transform duration-300 ${answerState === 'correct' ? 'animate-score-pop' : ''}`}>{streak}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeMode;
