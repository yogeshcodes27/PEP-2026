import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RobustFloat — Cross-Domain Floating-Waste Detection in Inland Waters',
  description:
    'Upload waterway imagery to inspect visible floating waste with evidence-grounded computer vision predictions evaluated across heterogeneous inland-water domains.',
  keywords: [
    'RobustFloat',
    'floating waste detection',
    'inland water computer vision',
    'cross-domain object detection',
    'YOLO26s-P2',
    'environmental monitoring',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-ink-primary antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
