/* ============================================
   BACKEND CODE FOR api.lamidetlm.com
   ElevenLabs Speech Endpoint
   
   Add this endpoint to your existing Express.js server
   ============================================ */

// Required: npm install node-fetch (if Node < 18)
// const fetch = require('node-fetch'); // Uncomment for Node < 18

// ElevenLabs API Key - Store securely in environment variables!
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_4a1758cc2b5150393359d179bc8dcf69acbc29b059fa058c';

/**
 * ElevenLabs Text-to-Speech Endpoint
 * 
 * POST /api/elevenlabs/speech
 * 
 * Request body:
 * {
 *   "text": "Text to convert to speech",
 *   "voiceId": "JBFqnCBsd6RMkjVDRZzb",
 *   "modelId": "eleven_multilingual_v2",
 *   "outputFormat": "mp3_44100_128"
 * }
 * 
 * Response: Audio blob (audio/mpeg)
 */

// Add this route to your Express app
app.post('/api/elevenlabs/speech', async (req, res) => {
    try {
        const { text, voiceId, modelId, outputFormat } = req.body;

        // Validate required fields
        if (!text || !voiceId) {
            return res.status(400).json({ 
                error: 'Missing required fields: text and voiceId are required' 
            });
        }

        // ElevenLabs API endpoint
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

        // Make request to ElevenLabs
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: modelId || 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.0,
                    use_speaker_boost: true
                },
                output_format: outputFormat || 'mp3_44100_128'
            })
        });

        // Check for errors
        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs API error:', response.status, errorText);
            return res.status(response.status).json({ 
                error: 'ElevenLabs API error',
                details: errorText
            });
        }

        // Get audio buffer
        const audioBuffer = await response.arrayBuffer();

        // Set response headers
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.byteLength);

        // Send audio
        res.send(Buffer.from(audioBuffer));

    } catch (error) {
        console.error('ElevenLabs speech error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

/* ============================================
   ALTERNATIVE: Full Express Server Example
   ============================================ */

/*
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ElevenLabs endpoint (copy the route above here)

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
*/

/* ============================================
   ENVIRONMENT VARIABLES REQUIRED
   ============================================
   
   Create a .env file or set these in your hosting platform:
   
   ELEVENLABS_API_KEY=sk_4a1758cc2b5150393359d179bc8dcf69acbc29b059fa058c
   
   IMPORTANT: Never commit API keys to version control!
   ============================================ */
