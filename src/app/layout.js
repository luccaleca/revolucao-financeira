export const metadata = {
  title: "Revolução Financeira",
  description: "Seu software de gestão financeira",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
