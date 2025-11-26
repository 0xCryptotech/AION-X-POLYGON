import { Bot, User, TrendingUp, Zap, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export const AboutPage = () => {
  const modes = [
    {
      icon: Bot,
      title: 'AI vs AI',
      description: 'Watch advanced AI agents predict outcomes and compete against each other in real-time.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/30',
    },
    {
      icon: User,
      title: 'AI vs Human',
      description: 'Test your prediction skills against cutting-edge AI models in various categories.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
    {
      icon: TrendingUp,
      title: 'Human vs Human',
      description: 'Compete with other humans in prediction markets on topics ranging from politics to sports.',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
    },
  ];

  const steps = [
    {
      icon: Zap,
      title: 'Connect Wallet',
      description: 'Connect your MetaMask or any Web3 wallet to get started with MATIC.',
    },
    {
      icon: TrendingUp,
      title: 'Browse Markets',
      description: 'Explore active prediction markets and choose your preferred mode.',
    },
    {
      icon: CheckCircle2,
      title: 'Place Bets',
      description: 'Select an outcome, enter your bet amount, and confirm the transaction.',
    },
    {
      icon: Clock,
      title: 'Wait for Resolution',
      description: 'Market closes at the specified time and oracle resolves the outcome.',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'All bets are recorded on the Polygon with full transparency.',
    },
    {
      icon: Zap,
      title: 'Fast Transactions',
      description: 'Quick bet placements and instant withdrawals powered by blockchain.',
    },
    {
      icon: TrendingUp,
      title: 'Fair Odds',
      description: 'Market-driven odds ensure fair payouts for all participants.',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            How <span className="gradient-text-primary">AION-X</span> Works
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            AION-X is a decentralized prediction market platform that allows you to bet on real-world events
            and compete against AI or other humans. Here's everything you need to know.
          </p>
        </motion.div>

        {/* Market Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Three Prediction Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {modes.map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Card className={`glass border-border/50 h-full hover:${mode.borderColor} transition-smooth group`}>
                  <CardHeader>
                    <div className={`${mode.bgColor} ${mode.borderColor} border rounded-lg p-4 inline-flex mb-4 group-hover:glow-primary transition-smooth`}>
                      <mode.icon className={`h-8 w-8 ${mode.color}`} />
                    </div>
                    <CardTitle className="text-xl">{mode.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{mode.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Getting Started in 4 Steps</h2>
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start space-x-6 mb-8 group"
              >
                <div className="flex-shrink-0">
                  <div className="glass border-primary/30 rounded-lg p-4 group-hover:bg-primary/10 group-hover:glow-primary transition-smooth">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-smooth">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AION-X?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass border-border/50 text-center group hover:border-primary/30 transition-smooth">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center bg-primary/10 border border-primary/30 rounded-full p-4 mb-4 group-hover:glow-primary transition-smooth">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">
                    Blockchain
                  </Badge>
                </h4>
                <p className="text-muted-foreground">
                  AION-X runs on the Polygon Testnet (Chain ID: 80002) for fast, low-cost transactions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                    Smart Contracts
                  </Badge>
                </h4>
                <p className="text-muted-foreground">
                  All market logic is executed through audited smart contracts. Your funds are secured by code,
                  not by a central authority.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <Badge variant="outline" className="border-secondary/30 bg-secondary/10 text-secondary">
                    Oracle System
                  </Badge>
                </h4>
                <p className="text-muted-foreground">
                  Market outcomes are resolved by designated oracles. The platform uses a decentralized approach
                  to ensure fair and accurate results.
                </p>
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground italic">
                  Note: This is an MVP platform. Do not use real funds on mainnet without proper auditing.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
