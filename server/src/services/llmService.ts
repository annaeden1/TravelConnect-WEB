// LLM Service for parsing free text search queries
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ParsedQuery {
    contentKeywords?: string[];
    hasImage?: boolean;
    sortByLikes?: boolean;
    originalQuery: string;
}

class LlmService {
    private getGenAI(): GoogleGenerativeAI | null {
        if (process.env.GEMINI_API_KEY) {
            return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        }
        return null;
    }

    async parseSearchQuery(query: string): Promise<ParsedQuery> {
        try {
            const genAI = this.getGenAI();
            if (!genAI) {
                console.warn('Gemini API key not configured, using fallback parsing');
                return this.fallbackParsing(query);
            }

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `You are a travel search assistant. Parse this search query and extract ONLY location-specific and topic-specific keywords.

Query: "${query}"

Extract:
- contentKeywords: array of keywords to search for. IMPORTANT rules:
  1. Always include the original search term AND related locations. For example, if the user searches "japan", include ["japan", "tokyo", "kyoto", "osaka", "japanese"]. If the user searches "italy", include ["italy", "rome", "milan", "florence", "italian"]. Always expand country names to include their major cities, and city names to include their country.
  2. NEVER include generic travel words like "trip", "travel", "vacation", "adventure", "explore", "journey", "tour", "visit", "destination", "holiday", "amazing", "incredible", "beautiful", "breathtaking". These are too common and will match every post.
  3. Only include specific place names, nationalities, and unique activity keywords (like "hiking", "scuba", "surfing").
- hasImage: boolean, true only if the user specifically asks for posts with images/photos/pictures
- sortByLikes: boolean, true if the user wants popular/trending/most liked posts

Return only valid JSON in this exact format:
{
  "contentKeywords": ["keyword1", "keyword2"],
  "hasImage": false,
  "sortByLikes": false
}

If no information is found for a field, omit it from the JSON.`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.warn('No JSON found in Gemini response, using fallback');
                return this.fallbackParsing(query);
            }

            const llmParsed = JSON.parse(jsonMatch[0]);

            const parsedQuery: ParsedQuery = {
                originalQuery: query
            };

            const stopWords = ['the', 'and', 'or', 'in', 'from', 'with', 'by', 'posts', 'post', 'show', 'find', 'about', 'me', 'all', 'get', 'for', 'that', 'this', 'are', 'was', 'has', 'have', 'been'];

            if (llmParsed.contentKeywords && Array.isArray(llmParsed.contentKeywords)) {
                // Include original query words but filter out stop words
                const originalWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
                const combined = [...new Set([...originalWords, ...llmParsed.contentKeywords.map((k: string) => k.toLowerCase())])];
                parsedQuery.contentKeywords = combined;
            } else {
                // If Gemini didn't return keywords, use the original query words
                parsedQuery.contentKeywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
            }

            if (typeof llmParsed.hasImage === 'boolean') {
                parsedQuery.hasImage = llmParsed.hasImage;
            }

            if (typeof llmParsed.sortByLikes === 'boolean') {
                parsedQuery.sortByLikes = llmParsed.sortByLikes;
            }

            return parsedQuery;

        } catch (error) {
            console.error('LLM service error:', error);
            return this.fallbackParsing(query);
        }
    }

    private fallbackParsing(query: string): ParsedQuery {
        const words = query.toLowerCase().split(/\s+/);

        const hasImage = /\b(image|images|photo|photos|picture|pictures|pic|pics)\b/i.test(query);
        const sortByLikes = /\b(popular|trending|most liked|top|best|liked)\b/i.test(query);

        const parsedQuery: ParsedQuery = {
            contentKeywords: words.filter(word =>
                word.length > 2 &&
                !['the', 'and', 'or', 'in', 'from', 'with', 'by', 'posts', 'post', 'show', 'find', 'about', 'me', 'all', 'get', 'for'].includes(word)
            ),
            originalQuery: query
        };

        if (hasImage) {
            parsedQuery.hasImage = true;
        }

        if (sortByLikes) {
            parsedQuery.sortByLikes = true;
        }

        return parsedQuery;
    }
}

export default new LlmService();
