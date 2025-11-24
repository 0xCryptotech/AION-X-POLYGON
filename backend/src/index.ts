import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY as string, provider);
const abiPath = __dirname + "/../abi/PredictionMarket.json";
const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const contractAbi = contractJson.abi || contractJson; // Handle both formats
const contractAddress = process.env.CONTRACT_ADDRESS as string;
const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

app.get("/health", (req: Request, res: Response) => res.json({ ok: true }));

// Create market (admin) — also calls on-chain createMarket
app.post("/api/markets", async (req: Request, res: Response) => {
  try {
    const { title, outcomes, closeTimeEpoch, mode, oracle } = req.body;
    const modeEnum = mode === "AI_VS_AI" ? 0 : mode === "AI_VS_HUMAN" ? 1 : 2;
    const tx = await contract.createMarket(title, outcomes, closeTimeEpoch, oracle, modeEnum, { gasLimit: 3000000 });
    const receipt = await tx.wait();
    // We'll not parse event; store DB record with onchainId null for MVP
    const market = await prisma.market.create({
      data: {
        title,
        outcomes: JSON.stringify(outcomes),
        closeTime: new Date(closeTimeEpoch * 1000),
        mode,
        status: "OPEN",
        oracle
      }
    });
    res.json({ ok: true, market, txHash: tx.hash, receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, err: String(err) });
  }
});

app.get("/api/markets", async (req: Request, res: Response) => {
  const markets = await prisma.market.findMany({ include: { aiPredictions: true }});
  res.json(markets);
});

// Mock AI endpoint sink - backend can call external AI servers
app.post("/api/mock_ai/predict", async (req: Request, res: Response) => {
  try {
    const { marketId, aiId } = req.body;
    // simplistic pseudorandom prediction
    const pUp = Math.min(0.95, Math.max(0.05, Math.random()*0.6 + 0.2));
    const pDown = 1 - pUp;
    const confidence = Math.abs(pUp - 0.5) * 2;
    const rationale = `Mock: momentum ${pUp>0.5 ? "bullish" : "bearish"} pUp=${(pUp*100).toFixed(1)}%`;
    const saved = await prisma.aIPrediction.create({
      data: {
        aiId,
        marketId,
        prediction: JSON.stringify({ up: pUp, down: pDown }),
        confidence,
        rationale
      }
    });
    res.json({ ok:true, prediction: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, err: String(err) });
  }
});

// Resolve a market (owner only via backend)
app.post("/api/resolve", async (req: Request, res: Response) => {
  try {
    const { marketId, winningOutcome } = req.body;
    const tx = await contract.resolveMarket(marketId, winningOutcome, { gasLimit: 500000 });
    const receipt = await tx.wait();
    await prisma.market.update({ where: { id: marketId }, data: { status: "RESOLVED" }});
    res.json({ ok:true, txHash: tx.hash, receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, err: String(err) });
  }
});

app.listen(4000, () => console.log("Backend running on :4000"));
