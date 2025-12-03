
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/providers/provider";
import DatabaseWarmer from "@/components/DatabaseWarmer"; // New component
import { inter } from "./fonts";
import { DarkModeProvider } from "@/components/useDarkModeInit";
import Script from "next/script";
import GAListener from "@/components/GAListener";




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
  description: "Track your portfolio and holdings with ease",
  themeColor: "#d575fc",

  openGraph: {
     title: "Cryptosnoop",
     description: "track your crypto assets and holdings with ease",
     url: "",
     siteName: "cryptosnoop",
     images: [
      {
        url: "https://myapp.app-image.png",
        width: 1200,
        height: 630,
        alt: "cryptosnoop preview"
      },
     ],
  },
   twitter: {
    card: "summary_large_image",
    title: "cryptosnoop",
    description: "track your crypto assets and holdings with ease",
    images: ["https://mywebapp.vercel.apphhh.png"],
   },


};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" className={`${inter.variable}`}>
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
    
           {children}
       
            </Providers>
        </DarkModeProvider>
      </body>
    </html>
  );
}