
import { GoogleGenAI, Type } from "@google/genai";
import type { TextAnalysisResult, MediaAnalysisResult, SpreadSimulationResult } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = "You are a sophisticated AI assistant specializing in misinformation detection and media analysis. Your goal is to provide neutral, factual, and concise analysis. When identifying propaganda, be precise and reference established definitions. For bias, use a multi-faceted approach considering language, source, and context. Always prioritize accuracy and clarity.";

const textAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        insufficientText: {
            type: Type.BOOLEAN,
            description: "True if the input text is too short, nonsensical, or gibberish to provide a meaningful analysis."
        },
        summary: {
            type: Type.STRING,
            description: "A concise, neutral, one-paragraph executive summary of the key findings. It should highlight the main subject, the assessed level of bias, and any significant propaganda techniques found. If insufficientText is true, this should state that the text is insufficient for analysis."
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
            description: "A score from 0 (highly biased) to 100 (neutral and objective) assessing the source's bias. If insufficientText is true, this should be 50."
        },
        flags: {
            type: Type.ARRAY,
            description: "A list of bias indicators found, like 'Sensational Language', 'Political Slant', or 'Unverified Source'. If insufficientText is true, this array should contain a single string: 'Insufficient Text'.",
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
        },
        sentiment: {
            type: Type.OBJECT,
            description: "The overall emotional sentiment of the text.",
            properties: {
                score: { type: Type.NUMBER, description: "A score from -1.0 (very negative) to 1.0 (very positive)." },
                label: { type: Type.STRING, description: "The dominant sentiment label, e.g., 'Positive', 'Negative', 'Neutral', 'Mixed'." }
            },
            required: ["score", "label"]
        },
        tone: {
            type: Type.ARRAY,
            description: "A list of words describing the writing style and tone.",
            items: { type: Type.STRING, description: "e.g., 'Formal', 'Informal', 'Persuasive', 'Objective', 'Urgent', 'Satirical'."}
        },
        keyClaims: {
            type: Type.ARRAY,
            description: "A list of key factual claims made in the text that could be fact-checked.",
            items: {
                type: Type.OBJECT,
                properties: {
                    claim: { type: Type.STRING, description: "The specific claim extracted from the text." },
                    verifiable: { type: Type.BOOLEAN, description: "True if the claim is a factual assertion that can be verified, false if it is an opinion, prediction, or too vague."}
                },
                required: ["claim", "verifiable"]
            }
        },
        logicalFallacies: {
            type: Type.ARRAY,
            description: "A list of logical fallacies identified in the text.",
            items: {
                type: Type.OBJECT,
                properties: {
                    fallacy: { type: Type.STRING, description: "The name of the logical fallacy (e.g., 'Strawman', 'Ad Hominem', 'Slippery Slope')." },
                    description: { type: Type.STRING, description: "A brief, one-sentence explanation of how the fallacy is used in the text." }
                },
                required: ["fallacy", "description"]
            }
        },
        readability: {
            type: Type.OBJECT,
            description: "An analysis of the text's reading complexity.",
            properties: {
                score: { type: Type.NUMBER, description: "The Flesch Reading Ease score (0-100, higher is easier)." },
                level: { type: Type.STRING, description: "The estimated U.S. school grade level required to understand the text (e.g., '8th Grade', 'College Graduate')." }
            },
            required: ["score", "level"]
        }
    },
    required: ["insufficientText", "summary", "tags", "highlightedText", "biasScore", "flags", "alternatives", "sentiment", "tone", "keyClaims", "logicalFallacies", "readability"]
};


export const analyzeText = async (text: string): Promise<TextAnalysisResult> => {
    try {
        const prompt = `Critically analyze the following text. Your FIRST task is to determine if the text is junk input. Junk input is defined as being too short (under 10 words), completely nonsensical (e.g., 'asdfasdfasdf' or 'shhvuysguycdgui'), or random keyboard spam. If you determine it is junk input, you MUST set 'insufficientText' to true and provide default/empty values for all other fields as specified in the schema. Do not attempt to analyze junk input. If the text is valid, set 'insufficientText' to false and then perform a full analysis for misinformation, propaganda techniques, bias, sentiment, tone, key claims, logical fallacies, and readability. Text to analyze: "${text}"`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                systemInstruction,
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
            description: "Whether the media is likely a deepfake or AI-generated. Be highly critical. If you have any doubt, classify it as a deepfake."
        },
        confidence: {
            type: Type.INTEGER,
            description: "A score from 0 to 100 representing the confidence in the authenticity of the image, where 100 is completely authentic and 0 is certainly a deepfake. Invert this for your 'isDeepfake' assessment."
        },
        reasoning: {
            type: Type.STRING,
            description: "A short, clear explanation for the assessment (e.g., 'Unnatural skin texture and inconsistent lighting.'). If authentic, state 'No significant signs of manipulation detected'."
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
        const textPart = { text: "You are a world-class deepfake detection expert. Your default stance is extreme skepticism. Analyze this image with intense scrutiny for any signs of AI generation or manipulation. It is your job to find flaws. Look for: unnatural skin texture (too smooth or waxy), inconsistent lighting and shadows, misshapen pupils or reflections in the eyes, strange artifacts in hair or teeth, anatomical impossibilities (e.g., six fingers), and distorted or nonsensical backgrounds. If you find ANY suspicious elements, no matter how small, you MUST classify it as a deepfake. The 'confidence' score should reflect the image's AUTHENTICITY (100 = real, 0 = fake). So, if you classify it as a deepfake, the confidence score should be low." };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [imagePart, textPart] }],
            config: {
                systemInstruction,
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
        const prompt = `Analyze the following misinformation claim: "${claim}". Create a realistic but **fictional** simulation of its potential global spread. Provide the following information: an origin country, primary spreading vectors, target demographics, a brief narrative explaining the spread dynamics, and a timeline of spread with estimated reach in 5-8 key countries over 14 days.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                systemInstruction,
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
