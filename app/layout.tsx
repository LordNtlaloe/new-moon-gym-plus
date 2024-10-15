import { TogglerProvider } from "./context/toggler";
import "./globals.css";
import { Lato } from "next/font/google";

const montserrat = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "New Moon Gym Plus",
  description: "Growing In Health & Fitness Together",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TogglerProvider>
      <html lang="en" className="scroll-smooth">
        <head>
        </head>
        <body className={`${montserrat.className}`}>{children}</body>
      </html>
    </TogglerProvider>
  );
}
