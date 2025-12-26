
import { GoogleGenAI } from "@google/genai";
import { Location, SearchResult } from "../types";

export const discoverVibes = async (vibeQuery: string, location: Location | null): Promise<SearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    あなたは「VibeScout」という都市キュレーションのエキスパートです。単なるビジネスのカテゴリーではなく、照明、音楽、インテリア、客層などの具体的な「雰囲気（バイブス）」に基づいて場所を見つけるのが得意です。
    ユーザーが求めている雰囲気: "${vibeQuery}"。
    
    1. この雰囲気に完璧にマッチする場所を3〜5件見つけてください。
    2. なぜその場所が指定されたムードに合うのか、簡潔に説明してください（例：温かい電球色の照明、静かなジャズ、インダストリアルな内装など）。
    3. Google Mapsツールを使用して、場所が実在し、最新の情報であることを確認してください。
    4. 回答は必ず日本語で行い、見やすいセクション分けをしてください。
  `;

  try {
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `以下の雰囲気の場所を探して: ${vibeQuery}`,
      config: {
        ...config,
        systemInstruction,
      },
    });

    return {
      text: response.text || "このエリアでは条件に合う場所が見つかりませんでした。",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
