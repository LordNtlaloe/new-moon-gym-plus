import VideoClientProvider from "@/app/VideoClientProvider";
import Footer from "@/components/main/Footer";
import Header from "@/components/main/Header";
import MobileNavbar from "@/components/main/MobileNavbar";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./session.css"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="">
            <body className="">
                {children}
            </body>
        </div>

    )

}
