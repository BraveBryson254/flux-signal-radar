import Header from "@/components/Header";
import RadarHero from "@/components/RadarHero";
import StrategyStrip from "@/components/StrategyStrip";
import SignalFeed from "@/components/SignalFeed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <RadarHero />
      <StrategyStrip />
      <SignalFeed />
      <Footer />
    </main>
  );
}
