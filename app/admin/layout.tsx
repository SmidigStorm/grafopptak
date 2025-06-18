'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Building,
  GraduationCap,
  Users,
  FileText,
  Settings,
  BarChart3,
  Database,
  Hammer,
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

const menuItems = [
  {
    title: 'Dashboard',
    icon: BarChart3,
    href: '/admin',
  },
  {
    title: 'Institusjoner',
    icon: Building,
    href: '/admin/institusjoner',
  },
  {
    title: 'Utdanningstilbud',
    icon: GraduationCap,
    href: '/admin/utdanningstilbud',
  },
  {
    title: 'Regelsett',
    icon: FileText,
    href: '/admin/regelsett',
  },
  {
    title: 'Regelbygging',
    icon: Hammer,
    href: '/admin/regelbygging',
  },
  {
    title: 'Fagkoder',
    icon: Database,
    href: '/admin/fagkoder',
  },
  {
    title: 'Søkere',
    icon: Users,
    href: '/admin/sokere',
  },
  {
    title: 'Innstillinger',
    icon: Settings,
    href: '/admin/innstillinger',
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-bold px-2 py-4">
                📚 Grafopptak Admin
              </SidebarGroupLabel>
              <Separator />
              <SidebarGroupContent className="mt-4">
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link href={item.href} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              <SidebarTrigger />
              <div className="ml-auto flex items-center space-x-4">
                <ThemeToggle />
                <span className="text-sm text-muted-foreground">Administrator</span>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
