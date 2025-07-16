import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "NotesPortal",
  description: "This is a simple notes sharing platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="antialiased font-poppins">
        {children}
      </body>
    </html>
  );
}
