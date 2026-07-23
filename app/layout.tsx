import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvents",
  description: "The Hub for every developer events",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
          className={cn(
              "min-h-screen",
              "h-full",
              "antialiased",
              schibstedGrotesk.variable,
              martianMono.variable,
              inter.variable,
              "font-sans"
          )}
      >
      <Navbar />
      <div className="absolute inset-0 top-0 -z-10 min-h-screen">
        <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfcea"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.2}
            noiseAmount={0}
            distortion={0.01}
            pulsating={false}
            fadeDistance={1}
            saturation={1}
        />
      </div>

      <main>{children}</main>
      </body>
      </html>
  );
}