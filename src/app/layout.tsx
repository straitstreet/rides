import type { Metadata, Viewport } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Space_Grotesk } from "next/font/google";
import { ErrorBoundary, AsyncErrorBoundary } from '@/components/error-boundary';
import { ReactQueryProvider } from '@/lib/react-query';
import { AuthGuard } from '@/components/auth-guard';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Ride Flex - Car Rental in Nigeria",
  description: "Find and rent cars from trusted owners across Nigeria. Affordable, reliable, and convenient car rental made easy.",
  keywords: "car rental, Nigeria, Lagos, Abuja, Port Harcourt, rent a car, car sharing",
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
    title: 'Ride Flex - Car Rental in Nigeria',
    description: 'Find and rent cars from trusted owners across Nigeria.',
    siteName: 'Ride Flex',
    images: [
      {
        url: '/icon.svg',
        width: 64,
        height: 64,
        alt: 'Ride Flex Logo',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

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
          // Use your app's color scheme
          colorPrimary: 'oklch(0.45 0.15 165)', // Your teal primary
          colorText: 'oklch(0.15 0.05 150)', // Your foreground
          colorTextSecondary: 'oklch(0.55 0.06 150)', // Your muted-foreground
          colorBackground: 'oklch(1 0 0)', // Pure white
          colorInputBackground: 'oklch(0.95 0.02 140)', // Your input color
          colorInputText: 'oklch(0.15 0.05 150)',
          borderRadius: '0.625rem', // Match your --radius
          fontFamily: 'var(--font-inter)',
          fontSize: '0.875rem',
        },
        elements: {
          // Modal/card styling
          modalContent: {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid oklch(0.92 0.02 140)',
          },
          card: {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid oklch(0.92 0.02 140)',
          },
          headerTitle: {
            color: 'oklch(0.15 0.05 150)',
            fontSize: '1.25rem',
            fontWeight: '600',
          },
          headerSubtitle: {
            color: 'oklch(0.55 0.06 150)',
            fontSize: '0.875rem',
          },
          // Form elements (hidden for Google-only)
          formButtonPrimary: {
            backgroundColor: 'oklch(0.45 0.15 165)',
            border: 'none',
            borderRadius: '0.625rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            padding: '0.75rem 1rem',
            '&:hover': {
              backgroundColor: 'oklch(0.40 0.15 165)',
            },
            '&:focus': {
              backgroundColor: 'oklch(0.40 0.15 165)',
              outline: '2px solid oklch(0.45 0.15 165)',
              outlineOffset: '2px',
            },
          },
          // Google sign-in button styling
          socialButtonsBlockButton: {
            borderRadius: '0.625rem',
            border: '1px solid oklch(0.92 0.02 140)',
            backgroundColor: 'oklch(1 0 0)',
            color: 'oklch(0.15 0.05 150)',
            fontSize: '0.875rem',
            padding: '0.875rem 1rem',
            fontWeight: '500',
            width: '100%',
            '&:hover': {
              backgroundColor: 'oklch(0.96 0.02 140)',
              borderColor: 'oklch(0.45 0.15 165)',
            },
            '&:focus': {
              outline: '2px solid oklch(0.45 0.15 165)',
              outlineOffset: '2px',
            },
          },
          socialButtonsBlockButtonText: {
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'oklch(0.15 0.05 150)',
          },
          // Hide email/password fields
          formFieldInput: {
            display: 'none',
          },
          formFieldLabel: {
            display: 'none',
          },
          footerActionLink: {
            display: 'none',
          },
          // Close button
          modalCloseButton: {
            color: 'oklch(0.55 0.06 150)',
            '&:hover': {
              color: 'oklch(0.15 0.05 150)',
            },
          },
          // Hide dividers and other elements
          dividerLine: {
            display: 'none',
          },
          dividerText: {
            display: 'none',
          },
          alternativeMethodsBlockButton: {
            display: 'none',
          },
        },
        layout: {
          logoPlacement: 'none', // Hide Clerk logo
          socialButtonsPlacement: 'top',
          showOptionalFields: false,
        },
      }}
    >
      <html lang="en">
        <body
          className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
        >
          <ReactQueryProvider>
            <ErrorBoundary>
              <AsyncErrorBoundary>
                <AuthGuard>
                  {children}
                </AuthGuard>
              </AsyncErrorBoundary>
            </ErrorBoundary>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
