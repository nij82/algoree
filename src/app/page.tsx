import Link from 'next/link';
import { Compass, ArrowRight, Zap, EyeOff, Radio } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="text-center">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-8">
            <span className="block text-white">Break the</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500">
              Algorithm Bubble
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-12 px-4">
            YouTube algorithms keep you in a loop. <span className="text-white font-semibold">Algoree</span> finds the unknown, the hidden gems, and the trends you never saw coming.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/discovery"
              className="group flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-lg shadow-rose-500/25"
            >
              Start Discovering
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10">
              How it works
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <FeatureCard
            icon={<EyeOff className="text-rose-500" />}
            title="Zero Repetition"
            description="We filter out every single video you've ever watched. Only fresh content here."
          />
          <FeatureCard
            icon={<Radio className="text-blue-500" />}
            title="Trend-Based"
            description="Starting from 100 real-time trends, we branch out to find unique content."
          />
          <FeatureCard
            icon={<Zap className="text-purple-500" />}
            title="A→B→C Logic"
            description="Our engine pivots through related connections to discover deeper content."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-white/20 transition-all hover:-translate-y-1">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
