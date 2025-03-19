import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'New Moon Gym Plus Online',
  description: 'New Moon Gym Plist Online Sessions',
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full flex-1 overflow-auto p-6 pt-28 max-md:pb-14 sm:px-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default RootLayout;
