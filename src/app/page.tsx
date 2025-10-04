import HeroSection from "@/components/HeroSection";
import BestOfAirMax from "@/components/BestOfAirMax";
import ProductList from "@/components/ProductList";

export default function RootPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BestOfAirMax />
      <div className="bg-gray-50">
        <ProductList />
      </div>
    </div>
  );
}
