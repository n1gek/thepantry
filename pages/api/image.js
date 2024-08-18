import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

export default async function generateImage(ingredient) {
    try {
        const response = await openai.images.generate({
            prompt: `Create an image of a dish featuring ${ingredient}`,
            n: 1,
            size: '512x512'
        });

        // Check if the response has the expected data structure
        if (response && response.data && response.data.length > 0) {
            return response.data[0].url;
        } else {
            console.error('Unexpected response structure:', response);
            return null;
        }
    } catch (error) {
        console.error('Error generating image:', error);
        return null;
    }
}

// Example usage:
generateImage('apple')
    .then(url => { console.log('Generated image URL:', url); })
    .catch(error => { console.error('Error:', error); });
