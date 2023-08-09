'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  children: React.ReactNode;
}

export const NavLink: React.FC<Props> = ({ href, children }) => {
  const pathname = usePathname();
  const parentPath = pathname.split('/')[1];
  const isActive = href.startsWith(`/${parentPath}`);

  return (
    <Link
      href={href}
      className={`flex min-w-[150px] items-center duration-200 gap-2 w-full hover:bg-[#0E936F] text-base rounded-lg px-3 py-2 font-normal text-white
      ${isActive ? 'bg-[#0E936F]' : ''}
      `}
    >
      {children}
    </Link>
  );
};
