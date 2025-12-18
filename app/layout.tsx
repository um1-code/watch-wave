// app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { WatchlistProvider } from "@/context/WatchlistContext";

export const metadata = {
  title: "Watch-wave - Your Movie & TV Tracker",
  description: "Track what you want to watch and what you've seen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WatchlistProvider>
            {children}
          </WatchlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}