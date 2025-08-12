"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Inbox, Settings, Users } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  { href: "/dashboard", label: "Inbox", icon: Inbox },
  { href: "#", label: "Analytics", icon: BarChart },
  { href: "#", label: "Teams", icon: Users },
  { href: "#", label: "Settings", icon: Settings },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href) && item.href !== '#'}
              tooltip={item.label}
            >
              <a>
                <item.icon />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
