import "./globals.css";

export const metadata = {
    title: "GymTracker Pro",
    description: "",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className=""
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
