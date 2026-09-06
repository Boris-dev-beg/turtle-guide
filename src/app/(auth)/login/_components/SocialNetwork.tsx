"use client"; 
import { useAuth } from "@/hooks/useAuth"; 
import google_icon from "../../../../assets/images/Google_icon.png"; 
import facebook_icon from "../../../../assets/images/facebook_icon.png"; 

import Image from "next/image"; 

export default function SocialNetwork() { 
  const { signInWithSocial } = useAuth(); 
  return ( 
    <div className="flex flex-col gap-1.5"> 
      <button 
        onClick={() => signInWithSocial.mutate("google")} 
        type="button" 
        className="flex text-base h-11 w-full items-center justify-center gap-2 btn btn-outline" 
      > 
        <Image 
          src={google_icon} 
          alt="Google Icon" 
          width={50} 
          height={50} 
          className="size-5" 
        /> 
        Continuer avec Google 
      </button> 
      <button 
        onClick={() => signInWithSocial.mutate("facebook")} 
        type="button" 
        className="flex text-base h-11 w-full items-center justify-center gap-2 btn btn-outline" 
      > 
        <Image 
          src={facebook_icon} 
          alt="FaceBook Icon" 
          width={50} 
          height={50} 
          className="size-5" 
        /> 
        Continuer avec Facebook 
      </button> 
    </div> 
  ); 
} 
