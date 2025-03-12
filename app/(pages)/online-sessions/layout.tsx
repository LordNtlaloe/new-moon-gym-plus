import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./session.css"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="">
            <body className="w-100 max-width-[200px]">
                {children}
            </body>
        </div>

    )

}