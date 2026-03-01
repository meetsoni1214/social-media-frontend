'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GradientBar } from '@/components/common/GradientBar';
import { GradientButton } from '@/components/common/GradientButton';
import { signOut } from '@/lib/auth/session';
import { uuidSchema } from '@/lib/utils/validation';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const firstSegment = pathname.split('/').filter(Boolean)[0] ?? '';
  const hasBusinessContext = uuidSchema.safeParse(firstSegment).success;
  const homeHref = hasBusinessContext ? `/${firstSegment}` : '/businesses';

  async function handleLogout() {
    await signOut();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <GradientBar />
      <header className="backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 max-w-6xl">
          <Link href={homeHref} className="text-lg font-semibold gradient-text">
            AI Social Media Generator
          </Link>
          <GradientButton variant={'ghost'} onClick={handleLogout}>
            Log out
          </GradientButton>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
