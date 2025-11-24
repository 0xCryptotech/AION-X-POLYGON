import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, X } from 'lucide-react';

export default function WalletModal({ isOpen, onClose, onConnectMetaMask, onConnectZedpay }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800/90 border-2 border-cyan-500/30">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Connect Wallet
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onConnectMetaMask}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-6 text-lg"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-8 w-8 mr-3" />
              Connect MetaMask
            </Button>

            <Button
              onClick={onConnectZedpay}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-6 text-lg"
            >
              <Wallet className="h-8 w-8 mr-3" />
              Connect Zedpay
            </Button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-6">
            By connecting your wallet, you agree to our Terms of Service
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
