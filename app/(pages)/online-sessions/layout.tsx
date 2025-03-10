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