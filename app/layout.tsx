import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Plus_Jakarta_Sans,
  Red_Hat_Text,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const redHatText = Red_Hat_Text({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-red-hat",
});

export const metadata: Metadata = {
  title: "MuLearn UCEK",
  description:
    "Welcome to MuLearn UCEK! MuLearn is an online platform and student community committed to empowering students to enhance their skills and thrive as individuals and as a community. Our approach integrates micro peer groups, interest groups, and gamified tasks, encouraging engaging and collaborative learning experiences. MuLearn has been successfully implemented at UCEK, assisting students in honing their skills and facilitating easier access to internships and placements. Join us on a journey of growth and discovery, as we support each other's paths to knowledge and personal development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${redHatText.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
