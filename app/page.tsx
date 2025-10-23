import VideoHero from "@/components/hero/VideoHero";
import InsightTiles from "@/components/home/InsightTiles";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const insightTiles = [
    {
      title: "The AI Deadlock",
      href: "/insights/the-ai-deadlock",
      imageSrc: "/images/insights/ai-deadlock.jpg",
    },
    {
      title: "The Executive Sprint",
      href: "/ai-executive-sprint",
      imageSrc: "/images/insights/executive-sprint.jpg",
    },
    {
      title: "Case: Powercrumbs",
      href: "/case-studies/powercrumbs",
      imageSrc: "/images/case-studies/powercrumbs.jpg",
    },
    {
      title: "Scaling AI Safely",
      href: "/insights/scaling-ai-safely",
      imageSrc: "/images/insights/scaling-ai.jpg",
    },
  ];

  return (
    <>
      <Navigation />
      <main className="bg-white">
        {/* Hero Section with calm video background */}
        <VideoHero
          videoSrc="/videos/hero-bg.mp4"
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
