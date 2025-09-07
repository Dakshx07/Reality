
import type { ReactNode } from 'react';

export type AnalysisMode = 'challenge' | 'text' | 'media' | 'ar' | 'spread' | 'leaderboard' | 'debunker';

export interface PropagandaTag {
  technique: string;
  description: string;
}

export interface TextAnalysisResult {
  insufficientText: boolean;
  summary: string;
  tags: PropagandaTag[];
  highlightedText: string;
  biasScore: number;
  flags: string[];
  alternatives: { name: string, url: string }[];
  sentiment: {
    score: number; // -1 (negative) to 1 (positive)
    label: string; // e.g., "Positive", "Negative", "Neutral"
  };
  tone: string[]; // e.g., ["Formal", "Persuasive", "Urgent"]
  keyClaims: {
    claim: string;
    verifiable: boolean;
  }[];
  logicalFallacies: {
    fallacy: string;
    description: string;
  }[];
  readability: {
    score: number; // Flesch Reading Ease score
    level: string; // e.g., "8th Grade", "College Graduate"
  };
}

export interface AnalysisHistoryItem {
  id: number;
  timestamp: string;
  inputText: string;
  result: TextAnalysisResult;
}

export interface MediaAnalysisResult {
  isDeepfake: boolean;
  confidence: number;
  reasoning: string;
}

export interface ArDetectionResult {
    score: number;
    summary: string;
    source: string;
    confidence: number;
    reasoning: string;
}

export interface ChallengeItem {
  id: number;
  claim: string;
  mediaUrl?: string;
  isMisinfo: boolean;
  tip: string;
}

export interface SpreadSimulationResult {
  originCountry: string;
  primaryVectors: string[];
  targetDemographics: string[];
  narrative: string;
  spreadTimeline: {
    day: number;
    country: string;
    reach: number;
  }[];
}

export interface LeaderboardEntry {
  id: string;
  email: string;
  score: number;
}

export interface DailyDebunkerItem {
  id: number;
  type: 'text' | 'image';
  content: string; // URL for image, text for text
  statement: string;
  isMisinfo: boolean;
  explanation: string;
}
