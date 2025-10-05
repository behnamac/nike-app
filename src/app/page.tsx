import HeroSection from "@/components/HeroSection";
import BestOfAirMax from "@/components/BestOfAirMax";
import TrendingNow from "@/components/TrendingNow";
import ReactPrestoBanner from "@/components/ReactPrestoBanner";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BestOfAirMax />
      <TrendingNow />
      <ReactPrestoBanner />
    </div>
  );
}
