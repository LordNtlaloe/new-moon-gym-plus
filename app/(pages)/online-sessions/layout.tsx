import VideoClientProvider from "@/app/VideoClientProvider";
import Footer from "@/components/main/Footer";
import Header from "@/components/main/Header";
import MobileNavbar from "@/components/main/MobileNavbar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (

        <VideoClientProvider>
            <Header />
            <MobileNavbar />
            <body className="">
                {children}
            </body>
            <Footer />
        </VideoClientProvider>
    )

}
