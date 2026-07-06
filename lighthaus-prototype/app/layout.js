export const metadata = {
  title: "Lighthaus — a first conversation",
  description: "An early prototype of the Lighthaus opening conversation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#faf6f0",
          color: "#2b2621",
          fontFamily:
            "Georgia, 'Iowan Old Style', 'Times New Roman', serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
