# 🤖 AI Model Integration Guide

## 📋 Current Status

**Saat ini:** AI predictions menggunakan **mock data** (random generation)
**Target:** Integrate real AI models untuk prediksi harga crypto

## 🎯 Integration Options

### Option 1: OpenAI API (GPT-4/GPT-5)
### Option 2: Anthropic Claude API
### Option 3: Custom ML Model
### Option 4: Hybrid (Multiple APIs)

---

## 🔧 Option 1: OpenAI Integration

### 1. Setup Backend API

**Create Backend Service:**
```bash
mkdir backend
cd backend
npm init -y
npm install express openai cors dotenv
```

**Backend Structure:**
```
backend/
├── server.js
├── services/
│   ├── openai.js
│   ├── claude.js
│   └── prediction.js
├── routes/
│   └── api.js
└── .env
```

### 2. OpenAI Service

**File: `backend/services/openai.js`**
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getGPTPrediction(asset, timeframe, historicalData) {
  const prompt = `
    You are a crypto trading AI. Analyze ${asset} for ${timeframe} timeframe.
    
    Historical data (last 24h):
    ${JSON.stringify(historicalData)}
    
    Provide prediction in JSON format:
    {
      "prediction": "BULLISH" or "BEARISH",
      "confidence": 0-100,
      "reasoning": "brief explanation"
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: "You are a crypto price prediction expert." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### 3. Backend API Server

**File: `backend/server.js`**
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getGPTPrediction } from './services/openai.js';
import { getClaudePrediction } from './services/claude.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Prediction endpoint
app.post('/api/predict', async (req, res) => {
  try {
    const { model, asset, timeframe, historicalData } = req.body;
    
    let prediction;
    
    switch(model) {
      case 'GPT-5 Oracle':
        prediction = await getGPTPrediction(asset, timeframe, historicalData);
        break;
      case 'Claude-3':
        prediction = await getClaudePrediction(asset, timeframe, historicalData);
        break;
      case 'DeepMind-FX':
        prediction = await getCustomMLPrediction(asset, timeframe, historicalData);
        break;
      default:
        prediction = getMockPrediction();
    }
    
    res.json(prediction);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

app.listen(3001, () => {
  console.log('AI Backend running on port 3001');
});
```

### 4. Frontend Integration

**Update: `src/services/aiService.js`** (NEW FILE)
```javascript
const API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:3001';

export async function fetchAIPrediction(model, asset, timeframe) {
  try {
    // Fetch historical data
    const historicalData = await fetchHistoricalData(asset);
    
    // Call AI backend
    const response = await fetch(`${API_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        asset,
        timeframe,
        historicalData
      })
    });
    
    if (!response.ok) throw new Error('AI prediction failed');
    
    const prediction = await response.json();
    return {
      side: prediction.prediction,
      conf: prediction.confidence,
      reasoning: prediction.reasoning
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    // Fallback to mock
    return getMockPrediction(model, asset, timeframe);
  }
}

async function fetchHistoricalData(asset) {
  // Fetch from Binance API
  const symbol = asset.toLowerCase();
  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`
  );
  const data = await response.json();
  
  return data.map(candle => ({
    timestamp: candle[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5])
  }));
}

function getMockPrediction(model, asset, timeframe) {
  // Existing mock logic as fallback
  const seed = (model + asset + timeframe).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const v = Math.abs((Date.now() + seed) % 100);
  return { 
    side: v > 50 ? "Bullish" : "Bearish", 
    conf: 40 + (v % 60),
    reasoning: "Mock prediction (AI service unavailable)"
  };
}
```

### 5. Update Battle Modal

**File: `src/components/AIBattleModal.jsx`**
```javascript
import { fetchAIPrediction } from '@/services/aiService';

// Replace existing fetchMockPrediction with:
async function fetchPrediction(model, asset, timeframe) {
  return await fetchAIPrediction(model, asset, timeframe);
}

// Update useEffect:
useEffect(() => {
  let mounted = true;
  const fetchPred = async () => {
    const pA = await fetchAIPrediction(modelA, asset, timeframe);
    const pB = await fetchAIPrediction(modelB, asset, timeframe);
    if (!mounted) return;
    setPredA(pA);
    setPredB(pB);
  };
  fetchPred();
  const id = setInterval(fetchPred, 30_000); // Update every 30s
  return () => { mounted = false; clearInterval(id); };
}, [modelA, modelB, asset, timeframe]);
```

---

## 🔧 Option 2: Anthropic Claude Integration

**File: `backend/services/claude.js`**
```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function getClaudePrediction(asset, timeframe, historicalData) {
  const message = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze ${asset} for ${timeframe}. Historical data: ${JSON.stringify(historicalData)}. 
      Respond with JSON: {"prediction": "BULLISH/BEARISH", "confidence": 0-100, "reasoning": "..."}`
    }]
  });

  return JSON.parse(message.content[0].text);
}
```

---

## 🔧 Option 3: Custom ML Model

### Using TensorFlow.js

**File: `backend/services/mlModel.js`**
```javascript
import * as tf from '@tensorflow/tfjs-node';

let model;

// Load pre-trained model
async function loadModel() {
  model = await tf.loadLayersModel('file://./models/crypto-predictor/model.json');
}

export async function getMLPrediction(asset, timeframe, historicalData) {
  if (!model) await loadModel();
  
  // Prepare input data
  const inputTensor = prepareInputData(historicalData);
  
  // Make prediction
  const prediction = model.predict(inputTensor);
  const result = await prediction.data();
  
  return {
    prediction: result[0] > 0.5 ? 'BULLISH' : 'BEARISH',
    confidence: Math.abs(result[0] - 0.5) * 200,
    reasoning: 'ML model prediction based on historical patterns'
  };
}

function prepareInputData(historicalData) {
  // Normalize and prepare data for model
  const prices = historicalData.map(d => d.close);
  const normalized = normalizeData(prices);
  return tf.tensor2d([normalized]);
}
```

---

## 🔧 Option 4: Hybrid Approach (Recommended)

**Combine multiple AI sources for better accuracy:**

**File: `backend/services/prediction.js`**
```javascript
import { getGPTPrediction } from './openai.js';
import { getClaudePrediction } from './claude.js';
import { getMLPrediction } from './mlModel.js';

export async function getHybridPrediction(asset, timeframe, historicalData) {
  // Get predictions from all models
  const [gpt, claude, ml] = await Promise.all([
    getGPTPrediction(asset, timeframe, historicalData),
    getClaudePrediction(asset, timeframe, historicalData),
    getMLPrediction(asset, timeframe, historicalData)
  ]);
  
  // Weighted voting
  const predictions = [
    { model: 'GPT', ...gpt, weight: 0.4 },
    { model: 'Claude', ...claude, weight: 0.3 },
    { model: 'ML', ...ml, weight: 0.3 }
  ];
  
  // Calculate consensus
  const bullishScore = predictions.reduce((sum, p) => 
    sum + (p.prediction === 'BULLISH' ? p.confidence * p.weight : 0), 0
  );
  
  const bearishScore = predictions.reduce((sum, p) => 
    sum + (p.prediction === 'BEARISH' ? p.confidence * p.weight : 0), 0
  );
  
  return {
    prediction: bullishScore > bearishScore ? 'BULLISH' : 'BEARISH',
    confidence: Math.max(bullishScore, bearishScore),
    reasoning: `Consensus from ${predictions.length} AI models`,
    breakdown: predictions
  };
}
```

---

## 📦 Environment Variables

**File: `backend/.env`**
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
HUGGINGFACE_API_KEY=hf_...
PORT=3001
```

**File: `frontend/.env`**
```env
VITE_AI_API_URL=http://localhost:3001
VITE_AI_API_URL_PROD=https://aion-ai-api.vercel.app
```

---

## 🚀 Deployment

### Backend Deployment (Vercel Serverless)

**File: `backend/vercel.json`**
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server.js" }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai-key",
    "ANTHROPIC_API_KEY": "@anthropic-key"
  }
}
```

**Deploy:**
```bash
cd backend
vercel --prod
```

---

## 💰 Cost Estimation

### OpenAI GPT-4
```
$0.03 per 1K input tokens
$0.06 per 1K output tokens
~$0.01 per prediction
```

### Anthropic Claude
```
$0.015 per 1K input tokens
$0.075 per 1K output tokens
~$0.008 per prediction
```

### Custom ML Model
```
Free (self-hosted)
Server costs only
```

---

## 🎯 Implementation Steps

### Phase 1: Setup Backend
```bash
1. Create backend folder
2. Install dependencies
3. Setup OpenAI/Claude API
4. Create prediction endpoints
5. Test locally
```

### Phase 2: Integrate Frontend
```bash
1. Create aiService.js
2. Update battle modals
3. Add error handling
4. Test with real API
```

### Phase 3: Deploy
```bash
1. Deploy backend to Vercel
2. Update frontend env vars
3. Test production
4. Monitor API usage
```

### Phase 4: Optimize
```bash
1. Add caching
2. Rate limiting
3. Fallback to mock
4. Monitor accuracy
```

---

## 🔍 Testing AI Integration

**Test Script:**
```javascript
// Test AI prediction
const prediction = await fetchAIPrediction('GPT-5 Oracle', 'BTCUSDT', 'M5');
console.log(prediction);
// Expected: { side: 'Bullish', conf: 75, reasoning: '...' }
```

---

## 📊 Monitoring & Analytics

**Track AI Performance:**
```javascript
// Log predictions vs actual outcomes
{
  model: 'GPT-5 Oracle',
  prediction: 'BULLISH',
  confidence: 75,
  actual: 'BULLISH',
  correct: true,
  timestamp: Date.now()
}

// Calculate accuracy per model
const accuracy = correctPredictions / totalPredictions * 100;
```

---

## ⚠️ Important Notes

1. **API Keys:** Never commit API keys to git
2. **Rate Limits:** Monitor API usage to avoid limits
3. **Fallback:** Always have mock predictions as fallback
4. **Caching:** Cache predictions for same asset/timeframe
5. **Cost:** Monitor API costs, implement usage limits

---

## 🎯 Quick Start (Minimal Setup)

**For testing, use OpenAI only:**

```bash
# Backend
npm install express openai cors dotenv
# Create server.js with OpenAI integration
node server.js

# Frontend
# Create aiService.js
# Update battle modals
# Test!
```

---

**Status: Ready for AI Integration** 🤖✨
