// server.js (AOXC Universal Neural Gateway - v4.0)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Ticari AI SDK'ları
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const PORT = process.env.PORT || 5000;

// İleri Seviye Loglama Sistemi
const neuralLog = (module, message, data = '') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${module}] ${message}`, data ? JSON.stringify(data) : '');
};

neuralLog('KERNEL', 'Universal Neural Gateway Booting...');

// Güvenlik Kalkanları
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '2mb' })); // Local modeller bazen büyük context alabilir
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 50 }); // Local için limiti biraz artırdık
app.use('/api/', apiLimiter);

// ============================================================================
// [OMNI-AI] CLIENT INITIALIZATION
// ============================================================================
const geminiClient = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openaiClient = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const anthropicClient = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

// ============================================================================
// [CORE ROUTER] UNIVERSAL ENDPOINT
// ============================================================================
app.post('/api/analyze', async (req, res) => {
    const startTime = Date.now();
    
    try {
        // Parametreler: provider (gemini, openai, claude, ollama, custom)
        // customUrl ve customModel: Kendi AI'ın veya local AI için gerekli
        const { 
            prompt, 
            context, 
            provider = 'gemini', 
            customUrl, 
            customModel 
        } = req.body;
        
        if (!prompt) return res.status(400).json({ error: "Missing neural prompt" });

        const engineeredPrompt = `
You are AOXC Sentinel, an advanced Multi-Chain Neural Security AI.
Output strictly VALID JSON matching this structure and nothing else:
{"analysis": "Explanation...", "risk": <0-100>, "action": "APPROVE" | "REJECT" | "MONITOR"}

SYSTEM CONTEXT: ${context || "None"}
USER COMMAND: ${prompt}
`;

        neuralLog('ROUTER', `Directing payload to: [${provider.toUpperCase()}]`);
        let responseText = "";

        // ====================================================================
        // YAPAY ZEKA YÖNLENDİRİCİSİ (ROUTER SWITCH)
        // ====================================================================
        switch (provider.toLowerCase()) {
            // 1. OLLAMA (Local Internetsiz AI - Örn: Llama3, Mistral)
            case 'ollama':
                const targetOllamaUrl = customUrl || 'http://localhost:11434/api/generate';
                const targetOllamaModel = customModel || 'llama3';
                neuralLog('LOCAL_LINK', `Connecting to Ollama node at ${targetOllamaUrl} (Model: ${targetOllamaModel})`);
                
                // Native fetch kullanıyoruz (Ekstra kütüphaneye gerek yok)
                const ollamaRes = await fetch(targetOllamaUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: targetOllamaModel,
                        prompt: engineeredPrompt,
                        stream: false,
                        format: 'json' // Modele sadece JSON üretmesini emreder
                    })
                });
                
                if (!ollamaRes.ok) throw new Error(`Ollama Server Error: ${ollamaRes.statusText}`);
                const ollamaData = await ollamaRes.json();
                responseText = ollamaData.response;
                break;

            // 2. KENDİ YAPAY ZEKAN VEYA LM STUDIO (OpenAI Uyumlu Local)
            case 'custom':
                if (!customUrl) throw new Error("Custom URL is required for 'custom' provider");
                neuralLog('CUSTOM_LINK', `Connecting to Custom Neural Node at ${customUrl}`);
                
                // Eğer senin AI'ın OpenAI standardını kullanıyorsa (LM Studio gibi):
                const customClient = new OpenAI({ 
                    apiKey: process.env.CUSTOM_API_KEY || "not-needed", 
                    baseURL: customUrl 
                });
                
                const customResponse = await customClient.chat.completions.create({
                    model: customModel || "local-model",
                    response_format: { type: "json_object" },
                    messages: [{ role: "system", content: engineeredPrompt }]
                });
                responseText = customResponse.choices[0].message.content;
                break;

            // 3. OPENAI (ChatGPT)
            case 'openai':
                if (!openaiClient) throw new Error("OpenAI API Key missing");
                const gptResponse = await openaiClient.chat.completions.create({
                    model: "gpt-4-turbo",
                    response_format: { type: "json_object" },
                    messages: [{ role: "system", content: engineeredPrompt }]
                });
                responseText = gptResponse.choices[0].message.content;
                break;

            // 4. ANTHROPIC (Claude)
            case 'claude':
            case 'anthropic':
                if (!anthropicClient) throw new Error("Anthropic API Key missing");
                const claudeResponse = await anthropicClient.messages.create({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 1000,
                    messages: [{ role: "user", content: engineeredPrompt + "\n\nOutput only JSON." }]
                });
                responseText = claudeResponse.content[0].text;
                break;

            // 5. GOOGLE GEMINI (Varsayılan)
            case 'gemini':
            default:
                if (!geminiClient) throw new Error("Gemini API Key missing");
                const geminiModel = geminiClient.getGenerativeModel({ 
                    model: "gemini-1.5-flash",
                    generationConfig: { responseMimeType: "application/json" }
                });
                const result = await geminiModel.generateContent(engineeredPrompt);
                responseText = result.response.text();
                break;
        }

        // ====================================================================
        // YANITI DOĞRULA VE PARÇALA
        // ====================================================================
        let parsedResponse;
        try {
            // Local modeller bazen JSON'ın başına veya sonuna ```json tagleri ekleyebilir. Onları temizliyoruz.
            const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedResponse = JSON.parse(cleanJsonStr);
        } catch (parseError) {
            neuralLog('PARSER_ERROR', 'AI returned invalid JSON structure', responseText);
            throw new Error("AI output could not be parsed as JSON.");
        }

        const duration = Date.now() - startTime;
        neuralLog('SENTINEL_PROC', `Analysis complete via [${provider.toUpperCase()}] in ${duration}ms`);
        res.status(200).json(parsedResponse);

    } catch (error) {
        neuralLog('ROUTER_ERROR', `Connection failed: ${error.message}`);
        res.status(500).json({ 
            analysis: `Neural routing failed on selected provider. Check uplink and logs. Error: ${error.message}`,
            risk: 100, 
            action: "REJECT", 
            reason: error.message 
        });
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "ONLINE", timestamp: Date.now(), service: "AOXC_UNIVERSAL_GATEWAY" });
});

app.listen(PORT, () => {
    console.log('\n=============================================================');
    console.log(`🛡️  AOXC Universal Neural Gateway running on port ${PORT}`);
    console.log(`🧠 Active Cloud Modules: Gemini [${!!geminiClient}], OpenAI [${!!openaiClient}], Claude [${!!anthropicClient}]`);
    console.log(`💻 Local AI Engines Supported: Ollama, LM Studio, Custom REST`);
    console.log('=============================================================\n');
});
