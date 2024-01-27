"use client"
import Image from "next/image";
import Staker from "@/components/staker";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { Input } from "@/components/ui/input"


export default function Home() {
  
  // verify if user is connected or not throw if not
  const {status} = useAccount();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 border max-w-[80%] m-auto rounded-xl border-dashed mt-9">
     <Staker/>
    </main>
  );
}
