import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "BillFlow",
  description: "Manage your bills and subscriptions",
  icons: {
    icon: '/billflow.png',
  },
};

import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="halloween">
      <body>
        <QueryProvider>
          <div className="select-none">
          {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
