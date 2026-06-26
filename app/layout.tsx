import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Vriksha Gyan - The Living Library of Medicinal Plants',
  description: 'Digitally preserving the DNA of ancient medicine through immersive AR experiences and personalized wellness guidance.',
  keywords: ['ayurveda', 'medicinal plants', 'AR experience', 'wellness', 'herbs', 'ancient medicine', 'personalized wellness', 'dosha'],
  authors: [{ name: 'Pixel_Pioneers' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Vriksha Gyan - Ancient Wisdom, Modern Technology',
    description: 'Discover your personalized wellness path with sacred herbs through AI-powered recommendations and immersive AR.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vriksha Gyan - The Living Library of Medicinal Plants',
    description: 'Experience ancient medicinal plants in AR and discover your personalized wellness kit.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="matrix-bg">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="matrix-column"
              style={{
                left: `${i * 2}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            >
              {Array.from({ length: 20 }).map((_, j) => (
                <div key={j} style={{ marginBottom: '10px' }}>
                  {Math.random() > 0.5 ? '1' : '0'}
                </div>
              ))}
            </div>
          ))}
        </div>
        {children}
        
        {/* Toaster for voice recognition feedback */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#00ff88',
              border: '1px solid #00ff88',
              fontFamily: 'Orbitron, monospace',
            },
            success: {
              iconTheme: {
                primary: '#00ff88',
                secondary: '#1a1a1a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff4444',
                secondary: '#1a1a1a',
              },
            },
          }}
        />
      </body>
    </html>
  )
}