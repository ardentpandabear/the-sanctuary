import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Support CORS for client-side API requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, customInput } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    let promptText = '';
    if (topic === 'date') {
      promptText = `Generate a romantic, sweet, memorable date night idea for a couple named Sofs & Mumu (who are in a long distance relationship between London and New York). ${customInput ? `Incorporate: ${customInput}` : ''}`;
    } else if (topic === 'poem') {
      promptText = `Write a short 2-stanza heartwarming romantic poem for Sofs & Mumu about love, warmth, and overcoming distance. ${customInput ? `Incorporate: ${customInput}` : ''}`;
    } else if (topic === 'ldr') {
      promptText = `Suggest 2 creative, fun long-distance connection rituals or games for Sofs and Mumu. ${customInput ? `Incorporate: ${customInput}` : ''}`;
    } else {
      promptText = `Give a thoughtful, intimate couple reflection prompt for Sofs and Mumu to write in their joint journal. ${customInput ? `Incorporate: ${customInput}` : ''}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    });

    const text = response.text || 'Love is the distance between two hearts filled with affection.';
    return res.status(200).json({ result: text });
  } catch (err: any) {
    console.error('Error generating AI response:', err);
    return res.status(500).json({ error: 'Failed to generate response.' });
  }
}
