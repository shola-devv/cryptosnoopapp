
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from './providers';
import DatabaseWarmer from "@/components/DatabaseWarmer"; // New component
import { inter } from "./fonts";


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
        
            <Providers>
            <DatabaseWarmer />
          {children}
       
            </Providers>
        
      </body>
    </html>
  );
}