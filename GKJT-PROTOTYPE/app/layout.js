import './globals.css';

export const metadata = {
    title: 'GKJ Tangerang - Prototype',
    description: 'Gereja Kristen Jawa Tangerang Website Prototype',
};

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body>{children}</body>
        </html>
    );
}
