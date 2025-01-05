import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="flex w-full h-screen justify-center items-center">
            <SignIn signUpUrl="/signup" />
        </div>
    ) 
}