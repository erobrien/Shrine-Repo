import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PeptideDojo - Advanced Peptide Research Platform",
  description: "Master peptide science with comprehensive research, protocols, and educational resources. Join thousands of researchers advancing peptide science.",
  keywords: "peptides, research, protocols, education, science, health",
  authors: [{ name: "PeptideDojo" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
