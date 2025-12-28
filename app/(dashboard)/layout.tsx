import AppSidebar from "@/components/ui/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { FC } from "react";

interface ComponentNameProps {
  propName: type;
  children: React.ReactNode;
}

const ComponentName: FC<ComponentNameProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default ComponentName;
