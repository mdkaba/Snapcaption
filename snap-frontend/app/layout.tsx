import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
const robotoCondensedItalic = localFont({
  src: "./fonts/RobotoCondensed-Italic.ttf",
  variable: "--font-roboto-condensed-italic",
  weight: "100 900",
});
const robotoCondensed = localFont({
  src: "./fonts/RobotoCondensed.ttf",
  variable: "--font-roboto-condensed-regular",
  weight: "100 900",
});
const libreBaskerville = localFont({
  src: "./fonts/LibreBaskerville.ttf",
  variable: "--font-libre-baskerville",
  weight: "400",
});
const libreBaskervilleBold = localFont({
  src: "./fonts/LibreBaskerville-Bold.ttf",
  variable: "--font-libre-baskerville-b",
  weight: "700",
});

export const metadata: Metadata = {
  title: "SnapCaption",
  description: "Generate descriptive captions for your images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoCondensedItalic.variable} ${robotoCondensed.variable} ${libreBaskerville.variable} ${libreBaskervilleBold.variable} antialiased w-screen`}
      >
        {children}
      </body>
    </html>
  );
}
