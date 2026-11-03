import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata = {
  title: "StudySpace – Smart Study Space Discovery & Booking Platform",
  description: "Find Your Space. Focus on Your Goals. Discover campus study zones, check real-time availability, and reserve seats or discussion rooms.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F5F2EA] text-[#263238] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
