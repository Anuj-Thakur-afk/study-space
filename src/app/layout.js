import "./globals.css";

export const metadata = {
  title: "StudySpace | Find your place to focus",
  description: "Discover quiet study areas and group-study spaces on campus."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}