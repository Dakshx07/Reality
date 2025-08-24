
import { GoogleGenAI, Type } from "@google/genai";
import type { TextAnalysisResult, MediaAnalysisResult, SpreadSimulationResult } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

const textAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A brief, plain-English summary of why the text is misleading."
        },
        tags: {
            type: Type.ARRAY,
            description: "A list of propaganda techniques found in the text.",
            items: {
                type: Type.OBJECT,
                properties: {
                    technique: {
                        type: Type.STRING,
                        description: "The name of the propaganda technique (e.g., Fear-mongering, Financial Scams)."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A one-sentence definition of the technique."
                    }
                },
                 required: ["technique", "description"]
            }
        },
        highlightedText: {
            type: Type.STRING,
            description: "The original text with parts that trigger propaganda techniques wrapped in tags like <mark class='technique-name'>text</mark>. Use lowercase, hyphenated class names, e.g., <mark class='fear-mongering'>."
        },
        biasScore: {
            type: Type.INTEGER,
            description: "A score from 0 (highly biased) to 100 (neutral and objective) assessing the source's bias."
        },
        flags: {
            type: Type.ARRAY,
            description: "A list of bias indicators found, like 'Sensational Language', 'Political Slant', or 'Unverified Source'.",
            items: { type: Type.STRING }
        },
        alternatives: {
            type: Type.ARRAY,
            description: "A list of alternative, more balanced sources for the same topic.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the alternative source (e.g., 'Reuters', 'Associated Press')." },
                    url: { type: Type.STRING, description: "A direct URL to a relevant article from the source." }
                },
                required: ["name", "url"]
            }
        }
    },
    required: ["summary", "tags", "highlightedText", "biasScore", "flags", "alternatives"]
};


export const analyzeText = async (text: string): Promise<TextAnalysisResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following text for misinformation, propaganda techniques, and bias. Respond with a summary, a list of techniques, the highlighted text, a bias score (0-100), bias flags, and a list of alternative sources. Text: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: textAnalysisSchema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as TextAnalysisResult;
    } catch (error) {
        console.error("Error analyzing text:", error);
        throw new Error("Failed to analyze text. Please check the API key and try again.");
    }
};

const mediaAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        isDeepfake: {
            type: Type.BOOLEAN,
            description: "Whether the media is likely a deepfake."
        },
        confidence: {
            type: Type.INTEGER,
            description: "A confidence score from 0 to 100 on the deepfake assessment."
        },
        reasoning: {
            type: Type.STRING,
            description: "A short, clear explanation for the assessment (e.g., 'Mouth movement doesn’t match audio')."
        }
    },
    required: ["isDeepfake", "confidence", "reasoning"]
};

export const analyzeMedia = async (base64Data: string, mimeType: string): Promise<MediaAnalysisResult> => {
     try {
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };
        const textPart = { text: "Analyze this image for signs of AI manipulation or deepfake characteristics. Provide a confidence score and reasoning." };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: mediaAnalysisSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as MediaAnalysisResult;

    } catch (error) {
        console.error("Error analyzing media:", error);
        throw new Error("Failed to analyze media. Please check the API key and try again.");
    }
};

const spreadSimulationSchema = {
    type: Type.OBJECT,
    properties: {
        originCountry: { type: Type.STRING, description: "The most likely country of origin for this narrative." },
        primaryVectors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The main channels for spread (e.g., 'Twitter Bots', 'Facebook Groups')." },
        targetDemographics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The demographics most susceptible to this claim." },
        narrative: { type: Type.STRING, description: "A brief, 2-3 sentence narrative explaining the motivation and strategy behind the spread." },
        spreadTimeline: {
            type: Type.ARRAY,
            description: "A list of events over a 14-day period. Include 5-8 key countries.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "The simulation day (1-14)." },
                    country: { type: Type.STRING, description: "The country where it is spreading." },
                    reach: { type: Type.INTEGER, description: "The estimated number of people reached in that country on that day." }
                },
                required: ["day", "country", "reach"]
            }
        }
    },
    required: ["originCountry", "primaryVectors", "targetDemographics", "narrative", "spreadTimeline"]
};

export const simulateSpread = async (claim: string): Promise<SpreadSimulationResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following misinformation claim: "${claim}". Create a realistic but **fictional** simulation of its potential global spread. Provide the following information: an origin country, primary spreading vectors, target demographics, a brief narrative explaining the spread dynamics, and a timeline of spread with estimated reach in 5-8 key countries over 14 days.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: spreadSimulationSchema,
            },
        });
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as SpreadSimulationResult;

    } catch(error) {
        console.error("Error simulating spread:", error);
        throw new Error("Failed to generate simulation. Please check the API key and try again.");
    }
};