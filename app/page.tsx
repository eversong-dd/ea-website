import VideoHero from "@/components/hero/VideoHero";
import FadeIn from "@/components/animations/FadeIn";

export default function Home() {
  return (
    <main className="bg-black text-white">
      {/* Cinematic Hero Section */}
      <VideoHero
        title="EA Website"
        subtitle="High-performance, cinematic experiences powered by Next.js and Azure"
      />

      {/* Content Sections with Smooth Animations */}
      <section className="min-h-screen px-6 py-32">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="mb-8 text-5xl font-bold md:text-6xl">
              Built for Performance
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="mb-12 max-w-3xl text-xl text-gray-300">
              This website leverages the latest technologies to deliver a premium,
              cinematic experience with buttery-smooth animations and optimized video delivery.
            </p>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-3">
            <FadeIn delay={0.3}>
              <div className="rounded-lg bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-bold">Framer Motion</h3>
                <p className="text-gray-400">
                  Elegant micro-interactions and natural motion for UI elements.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="rounded-lg bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-bold">GSAP</h3>
                <p className="text-gray-400">
                  Cinematic hero sequences and complex animation timelines.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="rounded-lg bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-bold">Lenis</h3>
                <p className="text-gray-400">
                  Premium smooth scrolling for a quiet, luxurious feel.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Additional Content Section */}
      <section className="min-h-screen bg-gradient-to-b from-black to-zinc-900 px-6 py-32">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="mb-8 text-5xl font-bold md:text-6xl">
              Azure-Powered Infrastructure
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="mb-12 max-w-3xl text-xl text-gray-300">
              Hosted on Azure Web App Service with Application Insights monitoring,
              CDN delivery, and optimized video storage for global performance.
            </p>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-2">
            <FadeIn delay={0.3}>
              <div className="rounded-lg bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-bold">Global CDN</h3>
                <p className="text-gray-400">
                  Azure Front Door delivers content at lightning speed to users worldwide.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="rounded-lg bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-bold">Real-time Monitoring</h3>
                <p className="text-gray-400">
                  Application Insights provides deep telemetry and performance insights.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
