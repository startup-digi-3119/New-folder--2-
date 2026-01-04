import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { messages, model, max_tokens, temperature } = request.body;
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
        return response.status(500).json({
            error: 'PERPLEXITY_API_KEY is not configured in Vercel environment variables.'
        });
    }

    try {
        const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || 'llama-3.1-sonar-small-128k-online',
                messages: messages,
                max_tokens: max_tokens || 1000,
                temperature: temperature || 0.2
            })
        });

        if (!perplexityResponse.ok) {
            const errorData = await perplexityResponse.json();
            return response.status(perplexityResponse.status).json(errorData);
        }

        const data = await perplexityResponse.json();
        return response.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return response.status(500).json({ error: 'Internal Server Error during AI generation' });
    }
}
