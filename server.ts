import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Romantic Idea API Route
  app.post('/api/ai/romantic-idea', async (req, res) => {
    try {
      const { topic, customInput } = req.body;
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
      return res.json({ result: text });
    } catch (err: any) {
      console.error('Error generating AI response:', err);
      return res.status(500).json({ error: 'Failed to generate response.' });
    }
  });

  // Vite middleware for dev or static server for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
