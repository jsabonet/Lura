'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sprout, DollarSign } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Início' },
    { href: '/campos', icon: Sprout, label: 'Campos' },
    { href: '/negocios', icon: DollarSign, label: 'Negócios' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1B2735] border-t border-[#00A86B]/30 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#00A86B]' : 'text-gray-400'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
