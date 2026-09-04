import './globals.css';
import type { Metadata } from 'next';
import Sidebar from '../components/Sidebar';

export const metadata: Metadata = {
  title: 'RupeeRadar - Cybercrime Predictor',
  description: 'Predictive Analytics Framework for Cybercrime Complaints',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-cyber-darker text-white h-screen w-screen overflow-hidden flex">
        <Sidebar />
        <div className="flex-1 h-full relative overflow-hidden flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
