import Footer from "@/components/main/Footer";
import Header from "@/components/main/Header";
import MobileNavbar from "@/components/main/MobileNavbar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <body className="max-w-[1920px]:">
            <Header />
            <MobileNavbar />
            <main className="flex flex-col justify-center items-center">
                {children}
            </main>
            <Footer />
        </body>
    );
}
