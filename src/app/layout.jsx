import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { AuthProvider } from '../../context/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dishbrain KI Database',
  description: 'Eine umfassende Datenbank für KI-Experten und -Unternehmen',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}