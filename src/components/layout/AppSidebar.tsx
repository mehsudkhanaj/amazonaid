
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { DollarSign, LayoutDashboard, ClipboardList, Bitcoin, Lightbulb, Target, UserCog, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: ClipboardList },
  { href: '/crypto', label: 'Crypto', icon: Bitcoin },
  { href: '/investments', label: 'Investments', icon: Lightbulb },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/account', label: 'Account', icon: UserCog },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  const getUserInitials = (email?: string | null) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <Sidebar side="left" collapsible="icon" variant="sidebar" className="border-r">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <DollarSign className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-semibold group-data-[collapsible=icon]:hidden">FinVerse</h1>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, className: "font-body" }}
                  className="font-body"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
         {user && (
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center mb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
              <AvatarFallback>{getUserInitials(user.email)}</AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium truncate">{user.displayName || user.email}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0"
        >
          <LogOut className="mr-2 group-data-[collapsible=icon]:mr-0" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
