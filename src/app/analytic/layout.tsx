import Sidebar from "@/components/Sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main className="ml-16">
          {children}
        </main>
      </body>
    </html>
  );
}