'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Code,
  ChevronDown,
  University,
  GraduationCap as StudentIcon,
} from 'lucide-react';
import Link from 'next/link';

type Role = 'Søker' | 'Administrator';

const adminMenuItems = [
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
    title: 'API Docs',
    icon: Code,
    href: '/admin/api-docs',
  },
  {
    title: 'Innstillinger',
    icon: Settings,
    href: '/admin/innstillinger',
  },
];

const søkerMenuItems: typeof adminMenuItems = [
  // Tom for nå - vil bli fylt ut senere
];

export function AppSidebar() {
  const [selectedRole, setSelectedRole] = useState<Role>('Administrator');

  const currentMenuItems = selectedRole === 'Administrator' ? adminMenuItems : søkerMenuItems;
  const RoleIcon = selectedRole === 'Administrator' ? University : StudentIcon;

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between h-12">
                  <div className="flex items-center gap-3">
                    <RoleIcon className="h-5 w-5" />
                    <span className="text-base font-semibold">{selectedRole}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem
                  onClick={() => setSelectedRole('Søker')}
                  className="flex items-center gap-2"
                >
                  <StudentIcon className="h-4 w-4" />
                  Søker
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedRole('Administrator')}
                  className="flex items-center gap-2"
                >
                  <University className="h-4 w-4" />
                  Administrator
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <Separator />
          <SidebarGroupContent className="mt-4">
            {currentMenuItems.length > 0 ? (
              <SidebarMenu>
                {currentMenuItems.map((item) => (
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
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <StudentIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Søkermeny kommer snart</p>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
