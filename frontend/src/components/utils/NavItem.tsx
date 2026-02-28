"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

export const NavItem = ({ href, label, icon }: NavItem) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <li>
            <Link href={href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/10 transition-all ${isActive
                    ? "bg-white text-[#054a29] shadow-md"
                    : "text-white/70 hover:bg-white/10"}`}
            >
                <span className='opacity-70'>{icon}</span>
                <span>{label}</span>
            </Link>
        </li>
    )
}