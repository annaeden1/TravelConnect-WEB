import { postModel } from "../models/postModel";
import { ParsedQuery } from "./llmService";

class SearchService {
    async searchPosts(parsedQuery: ParsedQuery): Promise<any[]> {
        try {
            // Build MongoDB query based on parsed query
            const mongoQuery: any = {};

            // Search by content keywords
            if (parsedQuery.contentKeywords && parsedQuery.contentKeywords.length > 0) {
                // Create regex patterns for content search
                const contentRegexes = parsedQuery.contentKeywords.map(keyword =>
                    new RegExp(keyword, 'i')
                );

                mongoQuery.$or = contentRegexes.map(regex => ({
                    content: { $regex: regex }
                }));
            }

            // Filter posts that have images
            if (parsedQuery.hasImage) {
                mongoQuery.imageUrl = { $exists: true, $nin: [null, ''] };
            }

            // Build sort options
            const sortOptions: any = {};
            if (parsedQuery.sortByLikes) {
                sortOptions.likesCount = -1; // Sort by number of likes descending
            }

            // Execute the search
            let query = postModel.find(mongoQuery);

            if (parsedQuery.sortByLikes) {
                // Use aggregation to sort by likes array length
                const results = await postModel.aggregate([
                    { $match: mongoQuery },
                    { $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
                    { $sort: { likesCount: -1 } }
                ]);
                return results;
            }

            const results = await query;
            return results;
        } catch (error) {
            console.error('Search service error:', error);
            throw new Error('Search operation failed');
        }
    }

    // Fallback simple text search
    async simpleTextSearch(query: string): Promise<any[]> {
        try {
            const results = await postModel.find({
                content: { $regex: query, $options: 'i' }
            });

            return results;
        } catch (error) {
            console.error('Simple search error:', error);
            return [];
        }
    }
}

export default new SearchService();
