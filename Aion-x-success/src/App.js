import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/pages/HomePage";
import { BattlePage } from "@/pages/BattlePage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { AboutPage } from "@/pages/AboutPage";
import { TournamentPage } from "@/pages/TournamentPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { AchievementsPage } from "@/pages/AchievementsPage";
import { FaucetPage } from "@/pages/FaucetPage";
import { StakingPage } from "@/pages/StakingPage";
import { Toaster } from "@/components/ui/sonner";
import { WalletProvider } from "@/context/WalletContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { BattleHistoryProvider } from "@/context/BattleHistoryContext";
import { AchievementProvider } from "@/context/AchievementContext";

function App() {
  return (
    <WalletProvider>
      <NotificationProvider>
        <BattleHistoryProvider>
          <AchievementProvider>
            <div className="min-h-screen bg-background text-foreground">
              <BrowserRouter future={{ v7_relativeSplatPath: true }}>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/battle" element={<BattlePage />} />
                  <Route path="/tournament" element={<TournamentPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/staking" element={<StakingPage />} />
                  <Route path="/faucet" element={<FaucetPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
                <Footer />
                <Toaster />
              </BrowserRouter>
            </div>
          </AchievementProvider>
        </BattleHistoryProvider>
      </NotificationProvider>
    </WalletProvider>
  );
}

export default App;
