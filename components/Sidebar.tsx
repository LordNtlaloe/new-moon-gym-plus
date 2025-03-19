'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserByRole } from '@/app/_actions/users.actions';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { sidebarLinks } from '@/constants';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userData = await getUserByRole(user.id);
        if (userData && !userData.error) {
          setUserRole(userData.role);
        }
      }
    };
    fetchUserRole();
  }, [user]);

  const filteredSidebarLinks = sidebarLinks.filter(
    (item) => userRole === 'Admin' || userRole === 'Trainer' || item.route !== '/online-sessions/personal-room'
  );

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6">
        {filteredSidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex gap-4 items-center p-4 rounded-lg justify-start',
                { 'bg-blue-1': isActive }
              )}
            >
              <Image src={item.imgURL} alt={item.label} width={24} height={24} />
              <p className="text-lg font-semibold max-lg:hidden">{item.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;

