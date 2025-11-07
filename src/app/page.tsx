import Link from 'next/link';
import { Sparkles, Zap, Target, TrendingUp } from 'lucide-react';
import { GradientButton } from '@/components/GradientButton';
import { GradientCard } from '@/components/GradientCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)]" />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-12 h-12 text-[var(--gradient-pink)]" />
            <h1 className="text-5xl font-bold gradient-text">
              AI Social Media Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Create engaging social media content in seconds with AI-powered
            generation tailored to your brand
          </p>
          <Link href="/login">
            <GradientButton size="lg" className="text-lg px-12 py-6 h-auto">
              Get Started
            </GradientButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <GradientCard className="text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-[var(--gradient-orange)]" />
            <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
            <p className="text-gray-600">
              Generate high-quality posts in seconds with AI assistance
            </p>
          </GradientCard>

          <GradientCard className="text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-[var(--gradient-pink)]" />
            <h3 className="text-xl font-semibold mb-2">Brand Aligned</h3>
            <p className="text-gray-600">
              Content perfectly matched to your brand voice and style
            </p>
          </GradientCard>

          <GradientCard className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-[var(--gradient-purple)]" />
            <h3 className="text-xl font-semibold mb-2">Boost Engagement</h3>
            <p className="text-gray-600">
              Create content designed to drive likes, shares, and conversions
            </p>
          </GradientCard>
        </div>
      </div>
    </div>
  );
}
