
import type { Metadata } from "next";
import { Inter, Pacifico } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "lebaphi.com",
  description: "Shop SMM Panel của Lê Bá Phi - Dịch vụ tăng follow, like, view giá rẻ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/25ee44309c2c8e19bb50f27ec1703d5a.png" />
      </head>
      <body
        className={`${inter.variable} ${pacifico.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
