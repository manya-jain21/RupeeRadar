import './globals.css';
import { Space_Grotesk, Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../lib/auth';
import AuthGuard from '../components/AuthGuard';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = { title: 'RupeeRadar', description: 'Cybercrime Analytics Platform' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="h-screen w-screen overflow-hidden relative">
        <AuthProvider>
          <AuthGuard>
            <Navbar />
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}