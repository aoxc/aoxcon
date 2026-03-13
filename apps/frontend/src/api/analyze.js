// api/analyze.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // CORS Ayarları (GitHub Pages'tan gelen isteklere izin ver)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Test için her yerden gelen isteğe izin ver
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { prompt, context } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const engineeredPrompt = `
      Analyze this context: ${context}
      User command: ${prompt}
      Output strictly valid JSON: {"analysis": "...", "risk": 0, "action": "APPROVE"}
    `;

    const result = await model.generateContent(engineeredPrompt);
    const responseText = result.response.text();
    
    // JSON temizleme (Markdown bloklarını kaldır)
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    res.status(200).json(JSON.parse(cleanJson));
  } catch (error) {
    res.status(500).json({ error: error.message, action: "REJECT" });
  }
}
