import Footer from "@/components/main/Footer";
import Header from "@/components/main/Header";
import MobileNavbar from "@/components/main/MobileNavbar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-[1920px]:">
            <Header />
            <MobileNavbar />
            <body className="flex flex-col justify-center items-center">
                {children}
            </body>
            <Footer />
        </div>
    );
}
