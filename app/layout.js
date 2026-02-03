import "./globals.css";
import AuthProvider from "./components/AuthProvider";

export const metadata = {
  title: "CultureCode Drop Radar | Real-Time TCG Hype Tracker",
  description: "Track trending Pokemon TCG cards, price movements, and upcoming drops. Your ultimate subculture intelligence platform.",
  keywords: ["Pokemon TCG", "card prices", "drop alerts", "TCG tracker", "collectibles"],
  openGraph: {
    title: "CultureCode Drop Radar",
    description: "Real-time TCG hype tracking & drop calendar",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
