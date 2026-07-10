import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignalFeed from "@/components/SignalFeed";

export default function FeedPage() {
  return (
    <main>
      <Header />
      <div className="pt-24">
        <SignalFeed />
      </div>
      <Footer />
    </main>
  );
}
