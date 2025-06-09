import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Application Status | TravelPro",
  description: "Check the status of your visa or travel application with your passport number",
};

export default function StatusCheckLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 