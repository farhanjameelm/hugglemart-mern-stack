const axios = require('axios');

class AIBargainingService {
    constructor() {
        this.apiKey = process.env.AI_API_KEY;
        this.apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
        this.maxRetries = 3;
        this.retryDelay = 1000;
    }

    // Generate AI response for bargaining
    async generateBargainingResponse(productName, originalPrice, userOffer, conversationHistory, maxDiscount = 30) {
        try {
            const systemPrompt = this.buildSystemPrompt(productName, originalPrice, maxDiscount);
            const messages = [
                { role: 'system', content: systemPrompt },
                ...this.formatConversationHistory(conversationHistory),
                { role: 'user', content: `User offers: ${userOffer}` }
            ];

            const response = await this.callAI(messages);
            return this.parseAIResponse(response, originalPrice, maxDiscount);
        } catch (error) {
            console.error('AI Bargaining Service Error:', error);
            return this.getFallbackResponse(userOffer, originalPrice, maxDiscount);
        }
    }

    // Build system prompt for AI
    buildSystemPrompt(productName, originalPrice, maxDiscount) {
        return `You are a friendly and professional bargaining assistant for Huggle Mart e-commerce platform. Your role is to negotiate prices with customers in a polite, fair, and engaging manner.

Product: ${productName}
Original Price: ${originalPrice}
Maximum Discount Allowed: ${maxDiscount}%

Your guidelines:
1. Always be polite and professional
2. Start with a friendly greeting
3. Consider the customer's offer reasonably
4. Never exceed the maximum discount limit (${maxDiscount}%)
5. Provide clear reasoning for your counter-offers
6. Keep responses conversational and engaging
7. Aim for a win-win situation
8. If the customer's offer is too low, explain why politely
9. Gradually work towards a reasonable compromise
10. End with a positive note

Response format:
- Greeting and acknowledgment
- Analysis of the offer
- Your counter-offer (if applicable)
- Brief explanation
- Friendly closing

Example response:
"Hello! Thank you for your offer of ${userOffer}. I appreciate your interest in ${productName}. While I'd love to accept your offer, our current price is ${originalPrice}. I can offer you a ${discount}% discount, bringing the price down to ${newPrice}. This is the best I can do while maintaining quality standards. What do you think?"`;
    }

    // Format conversation history for AI
    formatConversationHistory(conversationHistory) {
        return conversationHistory.map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.message
        }));
    }

    // Call AI API
    async callAI(messages) {
        const config = {
            method: 'post',
            url: this.apiUrl,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            data: {
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 300,
                temperature: 0.7
            },
            timeout: 10000
        };

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const response = await axios(config);
                return response.data;
            } catch (error) {
                if (attempt === this.maxRetries) {
                    throw error;
                }
                await this.delay(this.retryDelay * attempt);
            }
        }
    }

    // Parse AI response
    parseAIResponse(aiResponse, originalPrice, maxDiscount) {
        const content = aiResponse.choices[0]?.message?.content || '';
        
        // Extract price information using regex
        const priceMatches = content.match(/(?:price|cost|amount).{0,20}?(\d+(?:\.\d+)?)/gi);
        const discountMatches = content.match(/(\d+)%?\s*(?:discount|off)/gi);
        
        let suggestedPrice = originalPrice;
        let suggestedDiscount = 0;

        // Calculate suggested price and discount
        if (discountMatches && discountMatches.length > 0) {
            const discount = parseInt(discountMatches[0].match(/\d+/)[0]);
            suggestedDiscount = Math.min(discount, maxDiscount);
            suggestedPrice = originalPrice * (1 - suggestedDiscount / 100);
        } else if (priceMatches && priceMatches.length > 0) {
            const price = parseFloat(priceMatches[0].match(/\d+(?:\.\d+)?/)[0]);
            if (price < originalPrice) {
                suggestedPrice = Math.max(price, originalPrice * (1 - maxDiscount / 100));
                suggestedDiscount = ((originalPrice - suggestedPrice) / originalPrice) * 100;
            }
        }

        return {
            message: content,
            suggestedPrice: Math.round(suggestedPrice * 100) / 100,
            suggestedDiscount: Math.round(suggestedDiscount * 10) / 10
        };
    }

    // Fallback response when AI service fails
    getFallbackResponse(userOffer, originalPrice, maxDiscount) {
        const offer = parseFloat(userOffer) || 0;
        const maxDiscountAmount = originalPrice * (maxDiscount / 100);
        const minPrice = originalPrice - maxDiscountAmount;

        let response = {
            message: '',
            suggestedPrice: originalPrice,
            suggestedDiscount: 0
        };

        if (offer >= originalPrice) {
            response.message = `Thank you for your generous offer! The current price is ${originalPrice}, which is actually the standard price. Would you like to proceed at this price?`;
        } else if (offer >= minPrice) {
            const discount = ((originalPrice - offer) / originalPrice) * 100;
            response.suggestedPrice = offer;
            response.suggestedDiscount = Math.round(discount * 10) / 10;
            response.message = `I appreciate your offer of ${offer}. That's a ${response.suggestedDiscount}% discount! I can accept this offer for you. Shall we proceed?`;
        } else {
            const reasonableDiscount = Math.min(maxDiscount / 2, 15);
            response.suggestedPrice = originalPrice * (1 - reasonableDiscount / 100);
            response.suggestedDiscount = reasonableDiscount;
            response.message = `Thank you for your offer of ${offer}. While I appreciate your interest, that's a bit too low for us to maintain our quality standards. However, I can offer you a ${reasonableDiscount}% discount, bringing the price down to ${response.suggestedPrice}. This is the best I can do. What do you think?`;
        }

        return response;
    }

    // Calculate optimal discount based on user behavior
    calculateOptimalDiscount(conversationHistory, originalPrice, maxDiscount) {
        const userMessages = conversationHistory.filter(msg => msg.role === 'user');
        
        if (userMessages.length === 0) return 0;

        // Analyze user's pattern
        const offers = userMessages
            .map(msg => parseFloat(msg.priceOffered))
            .filter(offer => !isNaN(offer));

        if (offers.length === 0) return 0;

        const averageOffer = offers.reduce((sum, offer) => sum + offer, 0) / offers.length;
        const averageDiscount = ((originalPrice - averageOffer) / originalPrice) * 100;

        // Calculate optimal discount based on user behavior
        let optimalDiscount = Math.min(averageDiscount * 0.7, maxDiscount); // Give 70% of what they want

        // Consider conversation length (longer conversations = more flexible)
        if (userMessages.length > 3) {
            optimalDiscount = Math.min(optimalDiscount * 1.2, maxDiscount);
        }

        return Math.max(0, Math.round(optimalDiscount * 10) / 10);
    }

    // Delay helper for retries
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Validate if bargain is acceptable
    isBargainAcceptable(userOffer, originalPrice, maxDiscount, conversationHistory) {
        const offer = parseFloat(userOffer) || 0;
        const maxDiscountAmount = originalPrice * (maxDiscount / 100);
        const minPrice = originalPrice - maxDiscountAmount;

        // Immediate acceptance for reasonable offers
        if (offer >= originalPrice * 0.9) return true;

        // Consider conversation context
        if (conversationHistory.length > 5) {
            // Be more flexible after longer negotiations
            return offer >= minPrice;
        }

        return offer >= minPrice * 1.1; // Require slightly higher initially
    }
}

module.exports = new AIBargainingService();
