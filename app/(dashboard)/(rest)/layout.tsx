import AppHeader from "@/components/AppHeader";
import type { FC } from "react";

interface props {
  children: React.ReactNode;
}

const Layout: FC<props> = ({ children }) => {
  return (
    <div>
      <AppHeader />
      <main className="flex-1 ">{children}</main>
    </div>
  );
};

export default Layout;
