import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TrendingNow from "@/components/TrendingNow";
import ReactPrestoBanner from "@/components/ReactPrestoBanner";
import { ScrollReveal } from "@/components/motion";
import { getFeaturedProducts } from "@/lib/actions/product";

export default async function Home() {
  const products = await getFeaturedProducts(8);

  return (
    <div className="min-h-screen overflow-x-clip">
      <HeroSection />
      <FeaturedProducts products={products} />
      <TrendingNow />
      <ReactPrestoBanner />
      <ScrollReveal />
    </div>
  );
}
