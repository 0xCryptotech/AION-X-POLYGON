#!/usr/bin/env python3
# Simple HTTP mock AI server - returns pseudo-probabilities
from http.server import BaseHTTPRequestHandler, HTTPServer
import json, time, random

class Handler(BaseHTTPRequestHandler):
    def _send(self, payload):
        self.send_response(200)
        self.send_header("Content-Type","application/json")
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode())

    def do_POST(self):
        length = int(self.headers.get("content-length",0))
        body = self.rfile.read(length)
        req = json.loads(body.decode() or "{}")
        p_up = min(0.95, max(0.05, random.random()*0.6 + 0.2))
        p_down = 1 - p_up
        confidence = round(abs(p_up - 0.5) * 2, 3)
        rationale = f"MockAI: momentum {'up' if p_up>0.5 else 'down'} p_up={p_up:.3f}"
        resp = {
            "ai_id": req.get("aiId","AI-MOCK"),
            "market_id": req.get("marketId",-1),
            "prediction": {"up": p_up, "down": p_down},
            "confidence": confidence,
            "rationale": rationale,
            "ts": int(time.time())
        }
        self._send(resp)

if __name__ == "__main__":
    server = HTTPServer(("",5001), Handler)
    print("Mock AI running on :5001")
    server.serve_forever()
