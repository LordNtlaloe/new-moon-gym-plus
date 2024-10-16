import { SignIn, ClerkLoaded } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div>
            <SignIn />
            <ClerkLoaded>
                <p className="mt-2 ml-2 text-gray-400">Forgot password? <span className="font-bold text-red-600 hover:text-red-400 transition-all cursor-pointer"><Link href={'/password-reset'}>Reset</Link></span></p>
            </ClerkLoaded>
        </div>
    )
}