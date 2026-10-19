import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JalSuraksha — AI Water Resource Intelligence",
  description: "Predict • Protect • Preserve. National Real-Time Water Resource Management, ML Forecasting & Citizen Decision Support.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23245B8F'><path d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-blue-100 selection:text-navy">
        {children}
      </body>
    </html>
  );
}
