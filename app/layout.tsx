import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"]
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["700", "900"]
});

export const metadata: Metadata = {
  title: 'DNA PROFISSIONAL - Descubra seu perfil comportamental',
  description: 'Uma analise humana e precisa sobre como voce funciona, como voce toma decisoes e qual caminho profissional realmente combina com quem voce e de verdade.',
  generator: 'DNA PROFISSIONAL',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-[#0B0E1A] text-[#F5F7FF]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
