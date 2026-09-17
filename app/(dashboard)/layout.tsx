'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('talentlab_current_user');
    if (!user) {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [router, pathname]);

  if (!ready) return <div className="min-h-screen bg-[#f5f5f5]" />;

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f5f5f5]">{children}</main>
      </div>
    </div>
  );
}
