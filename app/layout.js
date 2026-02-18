import "./globals.css";

export const metadata = {
  title: "GKJ Tangerang | Gereja Kristen Jawa",
  description: "Gereja Kristen Jawa Tangerang - Melayani dengan hati yang tulus di tengah keberagaman.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
