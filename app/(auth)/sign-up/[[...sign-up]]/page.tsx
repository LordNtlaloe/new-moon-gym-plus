import Banner from "@/components/main/Banner";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return(
        <div className="max-w-[1920px]">
            <Banner page={"Sign Up"} />
            <SignUp />
        </div>
        
    )
}
