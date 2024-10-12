import axios from 'axios';
export const configureGemini = () => {
    return {
        apiKey: process.env.GEMINI_API_KEY, // Replace with your actual Gemini API key
        endpoint: process.env.GEMINI_API_ENDPOINT || 'https://api.gemini.com/v1/chat', // Replace with the correct Gemini API endpoint
    };
};
export class GeminiApi {
    config;
    constructor(config) {
        this.config = config;
    }
    async textGeneration(prompt, options) {
        try {
            const response = await axios.post(this.config.endpoint, {
                prompt,
                // Include other parameters as needed by the Gemini API
                ...options,
            }, {
                headers: {
                    Authorization: `Bearer ${this.config.apiKey}`,
                },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Error during text generation: ${error.message}`);
        }
    }
}
//# sourceMappingURL=geminiai-config.js.map