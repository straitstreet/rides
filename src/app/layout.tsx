import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Rides - Car Rental in Nigeria",
  description: "Find and rent cars from trusted owners across Nigeria. Affordable, reliable, and convenient car rental made easy.",
  keywords: "car rental, Nigeria, Lagos, Abuja, Port Harcourt, rent a car, car sharing",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Rides - Car Rental in Nigeria',
    description: 'Find and rent cars from trusted owners across Nigeria.',
    siteName: 'Rides',
    images: [
      {
        url: '/logo.svg',
        width: 160,
        height: 60,
        alt: 'Rides Logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        variables: {
          colorPrimary: '#2563eb',
          colorText: '#111827',
          colorTextSecondary: '#6b7280',
          colorBackground: '#ffffff',
          borderRadius: '0.5rem',
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'shadow-xl',
        },
      }}
    >
      <html lang="en">
        <body
          className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
