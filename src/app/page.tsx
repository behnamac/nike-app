import HeroSection from "@/components/HeroSection";
import ProductList from "@/components/ProductList";

export default function RootPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="bg-gray-50">
        <ProductList />
      </div>
    </div>
  );
}
