import { GoogleGenAI } from "@google/genai";

export const validateImageWithGemini = async (imageBuffer: Buffer, mimeType: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found. Skipping AI validation.");
    return {
      location_match_score: 100,
      authenticity_score: 100,
      description_of_image: "AI validation skipped (no API key)"
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-1.5-flash";

  const prompt = `
    Analyze this image for a restaurant review platform.
    1. Does this image likely belong to a restaurant environment (food, interior, exterior, or people eating)?
    2. Does it look authentic (not a stock photo or obvious screenshot)?
    
    Return a JSON object with:
    - location_match_score (0-100): how well it fits a restaurant context.
    - authenticity_score (0-100): how likely it is a real user photo.
    - description_of_image (string): brief description.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: imageBuffer.toString("base64")
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error("Gemini validation error:", error);
    return {
      location_match_score: 50,
      authenticity_score: 50,
      description_of_image: "Error during AI validation"
    };
  }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};
