import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Users, Coins, Clock, Zap, Crown, Medal, Swords, Target, Gift } from 'lucide-react';

export const TournamentPage = () => {
  const [activeTab, setActiveTab] = useState('live');

  const communityCup = [
    {
      id: 1,
      name: 'Community Prediction Cup',
      prize: '100 AION',
      participants: 567,
      timeLeft: '6d 18h',
      status: 'active',
      entryFee: 'Free',
      type: 'Community',
      description: 'Open to all! Vote-based tournament where community decides winners'
    },
    {
      id: 2,
      name: 'Newbie Challenge',
      prize: '25 AION',
      participants: 234,
      timeLeft: '3d 12h',
      status: 'active',
      entryFee: 'Free',
      type: 'Beginner',
      description: 'Perfect for newcomers! Learn while you earn'
    },
    {
      id: 3,
      name: 'Community Clash',
      prize: '75 AION',
      participants: 445,
      timeLeft: '8d 4h',
      status: 'active',
      entryFee: '0.01 AION',
      type: 'Community',
      description: 'Team-based tournament. Join forces with other traders!'
    }
  ];

  const battleRoyale = [
    {
      id: 1,
      name: 'Mega Battle Royale',
      prize: '250 AION',
      participants: 1500,
      maxParticipants: 2000,
      timeLeft: '12h 30m',
      status: 'filling',
      entryFee: '0.2 AION',
      type: 'Battle Royale',
      description: 'Last trader standing wins! Elimination-based tournament'
    },
    {
      id: 2,
      name: 'Speed Royale',
      prize: '80 AION',
      participants: 456,
      maxParticipants: 500,
      timeLeft: '2h 15m',
      status: 'filling',
      entryFee: '0.05 AION',
      type: 'Quick Royale',
      description: 'Fast-paced 30-minute elimination rounds'
    },
    {
      id: 3,
      name: 'Open Arena Championship',
      prize: '500 AION',
      participants: 2340,
      maxParticipants: 5000,
      timeLeft: '1d 8h',
      status: 'filling',
      entryFee: '0.5 AION',
      type: 'Grand Royale',
      description: 'The ultimate test! Multi-stage elimination tournament'
    }
  ];

  const sponsorCup = [
    {
      id: 1,
      name: 'Binance Trading Cup',
      prize: '1,000 AION',
      participants: 3450,
      timeLeft: '15d 20h',
      status: 'active',
      entryFee: 'Free',
      type: 'Sponsored',
      sponsor: 'Binance',
      description: 'Official Binance partnership event with exclusive rewards'
    },
    {
      id: 2,
      name: 'MetaMask Masters',
      prize: '500 AION + NFTs',
      participants: 1890,
      timeLeft: '10d 14h',
      status: 'active',
      entryFee: 'Free',
      type: 'Sponsored',
      sponsor: 'MetaMask',
      description: 'Win AION + exclusive MetaMask NFT collection'
    },
    {
      id: 3,
      name: 'CoinGecko Challenge',
      prize: '300 AION + Merch',
      participants: 1234,
      timeLeft: '7d 6h',
      status: 'active',
      entryFee: 'Free',
      type: 'Sponsored',
      sponsor: 'CoinGecko',
      description: 'Predict top gainers & win prizes + exclusive merchandise'
    },
    {
      id: 4,
      name: 'PancakeSwap Prediction League',
      prize: '750 AION + CAKE',
      participants: 2567,
      timeLeft: '20d 10h',
      status: 'active',
      entryFee: 'Free',
      type: 'Sponsored',
      sponsor: 'PancakeSwap',
      description: 'Trade predictions + earn CAKE tokens as bonus rewards'
    }
  ];

  const weeklyTournaments = [
    {
      id: 1,
      name: 'Weekly Crypto Masters',
      prize: '50 AION',
      participants: 234,
      timeLeft: '2d 14h',
      status: 'active',
      entryFee: '0.1 AION',
      type: 'AI vs AI'
    },
    {
      id: 2,
      name: 'Speed Trading Challenge',
      prize: '30 AION',
      participants: 156,
      timeLeft: '4d 8h',
      status: 'active',
      entryFee: '0.05 AION',
      type: 'AI vs Human'
    },
    {
      id: 3,
      name: 'Prediction Pro League',
      prize: '40 AION',
      participants: 189,
      timeLeft: '5d 20h',
      status: 'active',
      entryFee: '0.08 AION',
      type: 'Human vs Human'
    }
  ];

  const monthlyTournaments = [
    {
      id: 1,
      name: 'Grand Championship',
      prize: '500 AION',
      participants: 1250,
      timeLeft: '18d 12h',
      status: 'active',
      entryFee: '1 AION',
      type: 'Mixed',
      description: 'The ultimate monthly showdown! All battle modes combined'
    },
    {
      id: 2,
      name: 'Elite Traders Cup',
      prize: '300 AION',
      participants: 890,
      timeLeft: '22d 6h',
      status: 'active',
      entryFee: '0.5 AION',
      type: 'AI vs AI',
      description: 'Top AI models compete for supremacy'
    },
    {
      id: 3,
      name: 'Diamond League',
      prize: '750 AION',
      participants: 1567,
      timeLeft: '12d 18h',
      status: 'active',
      entryFee: '2 AION',
      type: 'Premium',
      description: 'High-stakes tournament for experienced traders only'
    },
    {
      id: 4,
      name: 'Crypto Titans Battle',
      prize: '400 AION',
      participants: 1045,
      timeLeft: '25d 8h',
      status: 'active',
      entryFee: '0.8 AION',
      type: 'Human vs Human',
      description: 'Pure skill-based competition. No AI allowed!'
    },
    {
      id: 5,
      name: 'AI Supremacy League',
      prize: '600 AION',
      participants: 2134,
      timeLeft: '14d 20h',
      status: 'active',
      entryFee: '1.5 AION',
      type: 'AI vs Human',
      description: 'Can humans outsmart the machines? Prove it here!'
    },
    {
      id: 6,
      name: 'Whale Wars',
      prize: '1,200 AION',
      participants: 456,
      timeLeft: '28d 4h',
      status: 'active',
      entryFee: '5 AION',
      type: 'VIP',
      description: 'Exclusive high-roller tournament with massive rewards'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'CryptoKing', score: 9850, prize: '15 AION' },
    { rank: 2, name: 'AImaster', score: 9420, prize: '10 AION' },
    { rank: 3, name: 'TradeBot', score: 8990, prize: '7 AION' },
    { rank: 4, name: 'ProTrader', score: 8560, prize: '5 AION' },
    { rank: 5, name: 'BullRunner', score: 8230, prize: '3 AION' }
  ];

  const liveEvents = [
    {
      id: 1,
      name: 'Flash Battle Royale',
      prize: '10 AION',
      participants: 45,
      timeLeft: '15m 30s',
      status: 'live',
      entryFee: '0.01 AION',
      type: 'Quick Match'
    },
    {
      id: 2,
      name: 'AI Showdown Live',
      prize: '25 AION',
      participants: 128,
      timeLeft: '45m 12s',
      status: 'live',
      entryFee: '0.05 AION',
      type: 'AI vs AI'
    },
    {
      id: 3,
      name: 'Rapid Fire Challenge',
      prize: '15 AION',
      participants: 67,
      timeLeft: '28m 45s',
      status: 'live',
      entryFee: '0.02 AION',
      type: 'Speed Battle'
    }
  ];

  const tournaments = activeTab === 'live' ? liveEvents : activeTab === 'weekly' ? weeklyTournaments : activeTab === 'monthly' ? monthlyTournaments : activeTab === 'community' ? communityCup : activeTab === 'royale' ? battleRoyale : sponsorCup;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative text-center mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-3xl animate-pulse" />
          <div className="relative">
            <div className="flex items-center justify-center mb-6">
              <div className="relative animate-bounce">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 blur-3xl opacity-75 animate-pulse" />
                <Crown className="relative h-20 w-20 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" fill="currentColor" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black ml-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,146,60,0.5)] animate-pulse">
                TOURNAMENTS
              </h1>
            </div>
            <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent mb-6">
              🏆 Compete • Win Big • Claim Glory 🏆
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            onClick={() => setActiveTab('live')}
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'live'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Zap className="mr-2 h-4 w-4" />
            Live Events
          </Button>
          <Button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'weekly'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Weekly
          </Button>
          <Button
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'monthly'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Trophy className="mr-2 h-4 w-4" />
            Monthly
          </Button>
          <Button
            onClick={() => setActiveTab('community')}
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'community'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Users className="mr-2 h-4 w-4" />
            Community Cup
          </Button>
          <Button
            onClick={() => setActiveTab('royale')}
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'royale'
                ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Swords className="mr-2 h-4 w-4" />
            Battle Royale
          </Button>
          <Button
            onClick={() => setActiveTab('sponsor')}
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'sponsor'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Gift className="mr-2 h-4 w-4" />
            Sponsor Cup
          </Button>
        </div>

        {/* Tournament Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-orange-950/30 to-slate-950 border-2 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
              <CardContent className="relative pt-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">
                    {tournament.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute" />
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs font-bold ml-2">LIVE</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {tournament.name}
                </h3>
                {tournament.description && (
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{tournament.description}</p>
                )}
                {tournament.sponsor && (
                  <div className="mb-3">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/50">
                      🎁 Sponsored by {tournament.sponsor}
                    </Badge>
                  </div>
                )}
                {tournament.maxParticipants && (
                  <div className="mb-3 bg-rose-900/30 border border-rose-500/50 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Slots</span>
                      <span className="font-bold text-rose-300">{tournament.participants}/{tournament.maxParticipants}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-gradient-to-r from-rose-500 to-red-500 h-1.5 rounded-full"
                        style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between bg-slate-900/50 border border-yellow-500/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-xs text-slate-400">Prize Pool</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-400">{tournament.prize}</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/50 border border-orange-500/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-400" />
                      <span className="text-xs text-slate-400">Participants</span>
                    </div>
                    <span className="text-sm font-bold text-orange-400">{tournament.participants}</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/50 border border-cyan-500/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs text-slate-400">Time Left</span>
                    </div>
                    <span className="text-sm font-bold text-cyan-400">{tournament.timeLeft}</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/50 border border-purple-500/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-slate-400">Entry Fee</span>
                    </div>
                    <span className="text-sm font-bold text-purple-400">{tournament.entryFee}</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(251,146,60,0.3)] transition-all">
                  {tournament.entryFee === 'Free' ? (
                    <>
                      <Target className="mr-2 h-5 w-5" />
                      Join Free
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Join Tournament
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leaderboard */}
        <Card className="bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border-2 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
          <CardHeader>
            <CardTitle className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
              <Medal className="h-8 w-8 text-yellow-400" />
              Current Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    player.rank === 1
                      ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/50 shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                      : player.rank === 2
                      ? 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-400/50'
                      : player.rank === 3
                      ? 'bg-gradient-to-r from-orange-900/20 to-orange-800/20 border-orange-600/50'
                      : 'bg-slate-900/50 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                        player.rank === 1
                          ? 'bg-yellow-500 text-slate-900'
                          : player.rank === 2
                          ? 'bg-slate-400 text-slate-900'
                          : player.rank === 3
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {player.rank}
                    </div>
                    <div>
                      <div className="font-bold text-white">{player.name}</div>
                      <div className="text-sm text-slate-400">Score: {player.score}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-400">{player.prize}</div>
                    <div className="text-xs text-slate-400">Prize</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
