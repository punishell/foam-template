import React from 'react';
import Image from 'next/image';
import { LogOut } from './logout';
import { NavLink } from './nav-link';
import { UserProfile } from '@/components/sidebar/user-profile';
import { LayoutDashboard, Users, LayoutList, Briefcase, Wallet, MessageSquare, Settings } from 'lucide-react';
import { useMessaging } from '@/providers/socketProvider';
import Link from 'next/link';

export const Sidebar = () => {
  const { unreadChatCount } = useMessaging();
  return (
    <div className="bg-sidebar-gradient gap-6 overflow-y-auto shrink-0 px flex text-white px-6 pb-4 pt-6 basis-[280px] flex-col h-screen">
      <div className="flex items-center flex-col w-full">
        <Link href={"/profile"}>
          <UserProfile />
        </Link>
      </div>
      <div className="border-b border-line opacity-20"></div>

      <div className="flex flex-col gap-4 w-fit mx-auto">
        <NavLink href="/overview">
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>

        <NavLink href="/jobs">
          <LayoutList size={20} />
          <span>Jobs</span>
        </NavLink>

        <NavLink href="/talents">
          <Users size={20} />
          <span>Talents</span>
        </NavLink>

        {/* <NavLink href="/projects">
          <Briefcase size={20} />
          <span>Projects</span>
        </NavLink> */}

        <NavLink href="/wallet">
          <Wallet size={20} />
          <span>Wallet</span>
        </NavLink>

        <NavLink href="/messages">
          <MessageSquare size={20} />
          <span>Messages</span>
          {unreadChatCount > 0 && <div className="h-5 w-5 shrink-0 text-opacity-80 rounded-full text-xs bg-[#ECFCE5] text-primary flex items-center justify-center">
            {unreadChatCount}
          </div>}
        </NavLink>

        <NavLink href="/settings">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>

      <div className="mt-auto mx-auto">
        <LogOut />
      </div>
      <div className="border-b border-line opacity-20"></div>
      <Image src="/images/logo.svg" alt="Logo" width={250} height={60} className="mx-auto max-w-[80%]" />
    </div>
  );
};
