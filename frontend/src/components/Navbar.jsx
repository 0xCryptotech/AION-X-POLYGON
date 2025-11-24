import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { shortenAddress } from '@/lib/utils';
import { toast } from 'sonner';
import { useWallet } from '@/context/WalletContext';

export const Navbar = () => {
  const { isConnected, address, balance, connectMetaMask, disconnectWallet: disconnect } = useWallet();

  const handleConnectMetaMask = async () => {
    await connectMetaMask();
    toast.success('MetaMask connected successfully!');
  };

  const disconnectWallet = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-foreground hover:text-primary transition-smooth text-sm font-medium">
        Home
      </Link>
      <Link to="/battle" className="text-muted-foreground hover:text-foreground transition-smooth text-sm font-medium">
        Battle
      </Link>
      <Link to="/tournament" className="text-muted-foreground hover:text-foreground transition-smooth text-sm font-medium">
        Tournament
      </Link>
      <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground transition-smooth text-sm font-medium">
        Leaderboard
      </Link>
      <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-smooth text-sm font-medium">
        Portfolio
      </Link>
      <Link to="/staking" className="text-muted-foreground hover:text-foreground transition-smooth text-sm font-medium">
        Staking
      </Link>
      <Link to="/faucet" className="text-muted-foreground hover:text-foreground transition-smooth text-sm font-medium">
        Faucet
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 glass">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-lg opacity-50 group-hover:opacity-75 transition-smooth" />
              <Zap className="relative h-8 w-8 text-primary" fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold gradient-text-primary">AION-X</span>
              <span className="hidden sm:block text-[10px] text-slate-400 -mt-1">Autonomous Intelligence Oracle Network</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavLinks />
          </div>

          {/* Wallet Connection */}
          <div className="hidden lg:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="glass px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-accent font-semibold">{balance} MATIC</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{shortenAddress(address)}</span>
                  </div>
                </div>
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  size="sm"
                  className="border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectMetaMask}
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass border-border/50">
              <div className="flex flex-col space-y-6 mt-8">
                <NavLinks />
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="glass px-4 py-3 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Balance</div>
                      <div className="font-mono text-lg text-accent font-semibold">{balance} MATIC</div>
                      <div className="text-sm text-muted-foreground mt-1">{shortenAddress(address)}</div>
                    </div>
                    <Button
                      onClick={disconnectWallet}
                      variant="outline"
                      className="w-full border-destructive/30 hover:bg-destructive/10"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleConnectMetaMask} className="w-full bg-primary hover:bg-primary/90">
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};