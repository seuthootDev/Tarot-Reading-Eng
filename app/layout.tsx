import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mystical Tarot Reading',
  description: 'Mystical Tarot Reading',
  icons: {
    icon: [
      // { url: '/favicon.ico', type: 'image/x-icon' },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ['/favicon.ico'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
            id="google-adsense"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}