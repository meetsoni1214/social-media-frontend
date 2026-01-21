import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { OnboardingProvider } from '@/features/business-profile/contexts/OnboardingContext';
import { QueryProvider } from '@/providers/QueryProvider';
import { SuperTokensProvider } from '@/components/common/SuperTokensProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Social Media Generator',
  description: 'Create engaging social media content with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SuperTokensProvider>
          <QueryProvider>
            <OnboardingProvider>{children}</OnboardingProvider>
          </QueryProvider>
        </SuperTokensProvider>
      </body>
    </html>
  );
}
