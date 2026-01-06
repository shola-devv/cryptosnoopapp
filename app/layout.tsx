
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/providers/provider";
import DatabaseWarmer from "@/components/DatabaseWarmer"; // New component
import { inter } from "./fonts";
import { DarkModeProvider } from "@/components/useDarkModeInit";
import Script from "next/script";
import GAListener from "@/components/GAListener";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});





export const metadata: Metadata = {
  title: "cryptosnoop",
  description: "Track your crypto portfolio and holdings with ease",
  

  openGraph: {
     title: "Cryptosnoop",
     description: "track your crypto assets and holdings with ease",
     url: "https://cryptosnoop.app",
     siteName: "cryptosnoop",
     images: [
      {
        url: "/cryptosnoopwall.jpg",
        width: 1200,
        height: 630,
        alt: "cryptosnoop preview"
      },
     ],
     type: "website",
  },
   twitter: {
    card: "summary_large_image",
    title: "cryptosnoop",
    description: "track your crypto assets and holdings with ease",
    images: ["/cryptosnoopwall.jpg"],
   },


};

export const viewport = {
  themeColor: "#d575fc",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" className={`${inter.variable}`}>

    <head>
    <Script
      id="jsonld-logo"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CryptoSnoop",
          url: "https://cryptosnoop.app",
          logo: "https://cryptosnoop.app/cryptosnoopwall.jpg",
        }),
      }}
    />
  </head>

      <body className="antialiased">

      <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var isDark = localStorage.getItem('darkMode');
              if (isDark === 'true' || 
                 (!isDark && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })();
        `,
      }}
    />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

         <DarkModeProvider>
            <Providers>
            <DatabaseWarmer />
            <GAListener />
    <QueryClientProvider client={queryClient}>
           {children}
       </QueryClientProvider>
            </Providers>
        </DarkModeProvider>
      </body>
    </html>
  );
}