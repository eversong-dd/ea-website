import VideoHero from "@/components/hero/VideoHero";
import InsightTiles from "@/components/home/InsightTiles";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const insightTiles = [
    {
      title: "The AI Deadlock",
      href: "/insights/the-ai-deadlock",
      videoSrc: "/videos/chess.mp4",
      category: "INSIGHTS",
    },
    {
      title: "Lead Time Prediction",
      href: "/ai-executive-sprint",
      videoSrc: "/videos/hourglass.mp4",
      category: "CASE STUDY",
    },
    {
      title: "Payroll Backoffice",
      href: "/case-studies/powercrumbs",
      videoSrc: "/videos/book.mp4",
      category: "CASE STUDY",
    },
    {
      title: "The Pilot Trap",
      href: "/insights/scaling-ai-safely",
      videoSrc: "/videos/team.mp4",
      category: "INSIGHTS",
    },
  ];

  return (
    <>
      <Navigation />
      <main className="bg-white">
        {/* Hero Section with calm video background */}
        <VideoHero
          videoSrc="/videos/leaves.mp4"
          headline="Clarity on AI for your business."
          subline="Practical, secure adoption on Microsoft—without the noise."
          ctaText="Talk to us"
          ctaHref="/contact"
        />

        {/* Floating Insight Tiles - McKinsey-style overlap */}
        <InsightTiles tiles={insightTiles} />
      </main>
      <Footer />
    </>
  );
}
