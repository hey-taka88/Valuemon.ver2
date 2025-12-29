'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { href: '/', label: 'ホーム', icon: '🏠' },
    { href: '/diagnosis', label: '診断', icon: '🔮' },
    { href: '/habit', label: '習慣', icon: '🔥' },
    { href: '/collection', label: '図鑑', icon: '📚' },
    { href: '/reflection', label: '内省', icon: '🪞' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="nav-bottom">
            <div className="flex justify-around items-center max-w-md mx-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
