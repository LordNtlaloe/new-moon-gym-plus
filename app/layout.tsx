import { TogglerProvider } from "./context/toggler";
import "./globals.css";
import { Lato } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import VideoClientProvider from "./VideoClientProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import GuestNameProvider from "@/contexts/GuestNameContext";

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

    <html lang="en" className="scroll-smooth">
      <ClerkProvider>
        <TogglerProvider>
          <ThemeProvider>
            <VideoClientProvider>
              <GuestNameProvider>
                <body className={`${montserrat.className}`}>{children}</body>
              </GuestNameProvider>
            </VideoClientProvider>
          </ThemeProvider>
        </TogglerProvider>
      </ClerkProvider>
    </html >

  );
}