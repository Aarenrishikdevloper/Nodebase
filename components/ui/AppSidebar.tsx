"use client";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";
import Image from "next/image";
import {
  CreditCardIcon,
  FolderOpen,
  FolderOpenDot,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

const AppSidebar = () => {
  const pathname = usePathname();
  // Define menu groups
  const menuGroups = [
    {
      title: "Main",
      items: [
        {
          title: "Workflows",
          icon: FolderOpen,
          url: "/workflows",
        },
        {
          title: "Crendentials",
          icon: KeyIcon,
          url: "/credentials",
        },
        {
          title: "Executions",
          icon: HistoryIcon,
          url: "/executions",
        },
      ],
    },
  ];
  return (
    <Sidebar collapsible={"icon"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton asChild className="gap-x-4">
            <Link href={"/workflows"} prefetch>
              <Image src={"/logo.svg"} alt="logo" width={30} height={30} />
              <span className="font-semibold text-sm">Nodebase</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((groups) => (
          <SidebarGroup key={groups.title}>
            <SidebarGroupLabel> {groups.title} </SidebarGroupLabel>
            <SidebarGroupContent>
              {groups.items.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      asChild
                      className="gap-x-4 h-10 px-4"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton
            tooltip={"Update to Pro"}
            className="gap-x-4 h-10 px-4"
          >
            <StarIcon className="h-4 w-4" />
            <span>Upgrade to Pro</span>
          </SidebarMenuButton>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Billing Portal"}
              className="gap-x-4 h-10 px-4"
            >
              <CreditCardIcon className="h-4 w-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuButton tooltip={"Sign Out"} className="gap-x-4 h-10 px-4">
            <LogOutIcon className="h-4 w-4" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
