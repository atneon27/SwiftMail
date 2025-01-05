import { SignUp } from "@clerk/nextjs" 

export default function Page() {
    return (
        <div className="flex w-full h-screen justify-center items-center">
            <SignUp signInUrl="/signin"/>
        </div> 
    )
}