import { LinkAccountButton } from "@/components/LinkAccountButton";
import CountdownTimer from "./CountdownTimer";

export default function Home() {
  return (
    <div className="m-4 flex items-center gap-4">
      <LinkAccountButton ButtonText="Link Account"/>
      <div className="pl-4">
        Click the login button to add you google account
      </div>
    </div> 
  )
}