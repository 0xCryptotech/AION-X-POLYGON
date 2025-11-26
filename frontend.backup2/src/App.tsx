import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import abi from "../abi/PredictionMarket.json";

const BACKEND = "http://localhost:4000";
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "0xYourContractAddress";

type Market = {
  id: number;
  title: string;
  mode: string;
  outcomes: string;
  closeTime: string;
  status: string;
  aiPredictions?: any[];
};

export default function App(){
  const [markets, setMarkets] = useState<Market[]>([]);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(()=>{ fetchMarkets(); if((window as any).ethereum){ setProvider(new ethers.BrowserProvider((window as any).ethereum)); } },[]);

  async function fetchMarkets(){
    const res = await axios.get(`${BACKEND}/api/markets`);
    setMarkets(res.data);
  }

  async function connectWallet(){
    if(!provider) return alert("Install MetaMask");
    const accounts = await (provider as any).send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  }

  async function placeBetOnChain(marketId:number, outcome:number, amountBNB:string){
    if(!provider) return alert("Connect Wallet");
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    const value = ethers.parseEther(amountBNB);
    const tx = await contract.placeBet(marketId, outcome, { value, gasLimit: 200000 });
    await tx.wait();
    alert("Bet placed: " + tx.hash);
  }

  async function makeMockAIPred(marketId:number){
    await axios.post(`${BACKEND}/api/mock_ai/predict`, { marketId, aiId: "AI-Alpha" });
    fetchMarkets();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prediction Market (BNB testnet)</h1>
        {account ? <div>Wallet: {account}</div> : <button onClick={connectWallet} className="btn">Connect Wallet</button>}
      </header>

      <section className="mb-6">
        <button onClick={()=>fetchMarkets()}>Refresh Markets</button>
        <button onClick={()=>makeMockAIPred(1)} className="ml-2">Mock AI on Market 1</button>
      </section>

      <section>
        {markets.map(m => (
          <div key={m.id} className="mb-4 p-4 border rounded">
            <div className="flex justify-between">
              <div><strong>{m.title}</strong> <small className="text-gray-500">({m.mode})</small></div>
              <div>{new Date(m.closeTime).toLocaleString()}</div>
            </div>
            <div className="mt-2">
              <div className="mb-2">Outcomes: {JSON.parse(m.outcomes).join(" / ")}</div>
              <div>
                <button onClick={()=>placeBetOnChain(m.id,0,"0.001")} className="mr-2">Bet Outcome 0 (0.001 BNB)</button>
                <button onClick={()=>placeBetOnChain(m.id,1,"0.001")}>Bet Outcome 1 (0.001 BNB)</button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              AI Predictions: {m.aiPredictions?.map((p:any)=>(<div key={p.id}>{p.aiId} — conf {(p.confidence*100).toFixed(1)}%</div>))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
