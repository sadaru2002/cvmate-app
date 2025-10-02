"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle, LogOut, User, LayoutDashboard, FileText, Brain, Info, Briefcase, GraduationCap, Lightbulb, Award, Languages, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils" // Import cn for utility classes

interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebarMenuItems: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
    path?: string;
    onClick?: () => void;
  }>;
  currentActiveItemId?: string;
  onBack?: () => void;
}

export function SidebarLayout({ children, sidebarMenuItems, currentActiveItemId, onBack }: SidebarLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-1">
        <Sidebar collapsible="icon" side="left" variant="sidebar">
          <SidebarHeader className="flex items-center justify-end p-4">
            <SidebarTrigger />
          </SidebarHeader>

          <SidebarContent className="flex-1">
            <SidebarMenu>
              {sidebarMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild={!!item.path}
                    isActive={currentActiveItemId === item.id}
                    onClick={item.onClick}
                    tooltip={item.label}
                    className="group-data-[collapsible=icon]:justify-center" // Center icon when collapsed
                  >
                    {item.path ? (
                      <Link href={item.path} className="flex items-center gap-2 w-full"> {/* Ensure Link fills button */}
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <>
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 space-y-2">
            {onBack && (
              <Button
                variant="outline"
                className="w-full text-white border-white/20 hover:bg-white/10 group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:w-fit group-data-[collapsible=icon]/sidebar-wrapper:mx-auto group-data-[collapsible=icon]/sidebar-wrapper:px-2"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-data-[collapsible=icon]/sidebar-wrapper:mr-0" />
                <span className="group-data-[collapsible=icon]/sidebar-wrapper:hidden">Back</span>
              </Button>
            )}
            <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10 group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:w-fit group-data-[collapsible=icon]/sidebar-wrapper:mx-auto group-data-[collapsible=icon]/sidebar-wrapper:px-2">
              <HelpCircle className="w-4 h-4 mr-2 group-data-[collapsible=icon]/sidebar-wrapper:mr-0" />
              <span className="group-data-[collapsible=icon]/sidebar-wrapper:hidden">Help</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col">
          <div className="flex-1 px-6 lg:px-12 py-6 lg:py-12">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}