import AboutSidebar from "@/components/main/AboutSidebar";
import Footer from "@/components/main/Footer";
import Header from "@/components/main/Header";
import MobileNavbar from "@/components/main/MobileNavbar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="">
            <Header />
            <MobileNavbar />
            <AboutSidebar />
            <body>{children}</body>
            <Footer />
        </div>



    );
}
