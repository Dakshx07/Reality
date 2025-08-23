
import type { ReactNode } from 'react';

export type AnalysisMode = 'challenge' | 'text' | 'media' | 'ar' | 'spread';

export interface PropagandaTag {
  technique: string;
  description: string;
}

export interface TextAnalysisResult {
  summary: string;
  tags: PropagandaTag[];
  highlightedText: string;
  confidence: number;
  biasScore: number;
  flags: string[];
  alternatives: { name: string, url: string }[];
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
