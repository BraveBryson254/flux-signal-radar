import Header from "@/components/Header";
import RadarHero from "@/components/RadarHero";
import FeedPreview from "@/components/FeedPreview";
import PipelineTeaser from "@/components/PipelineTeaser";
import PricingTeaser from "@/components/PricingTeaser";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <RadarHero />
      <FeedPreview />
      <PipelineTeaser />
      <PricingTeaser />
      <Footer />
    </main>
  );
}
