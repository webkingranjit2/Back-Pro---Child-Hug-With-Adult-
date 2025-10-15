
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT = `From the two provided images, create a new, realistic photograph. The first image is of a person as a child, and the second is of the same person as an adult. The new image should depict the adult person warmly hugging their younger, child self. Both individuals should be clearly visible and interacting naturally in a single, cohesive scene. The style should be photorealistic and heartwarming.`;

export async function generateHuggingImage(childBase64: string, childMimeType: string, adultBase64: string, adultMimeType: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: childBase64,
                        mimeType: childMimeType,
                    },
                },
                {
                    inlineData: {
                        data: adultBase64,
                        mimeType: adultMimeType,
                    },
                },
                {
                    text: PROMPT,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
        return firstPart.inlineData.data;
    }

    throw new Error("No image data found in the API response.");
}
