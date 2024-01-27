"use client";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { useDisconnect } from "wagmi";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Press_Start_2P } from "next/font/google";
import { injected } from "wagmi/connectors";
import { useBalance } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NextFont } from "next/dist/compiled/@next/font";
import { arbitrumSepolia } from "viem/chains";
import Balances from "./balances";
const PS4: NextFont = Press_Start_2P({ weight: ["400"], subsets: ["greek"] });
const link: string =
  "https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84NGVkMzFlNTYxMzc2MjZlZjk3NTQ3ZThkNWFmNDIxYz9zaXplPTQ5NiZkZWZhdWx0PXJldHJvIn0._a9R1_dgZOEfousaGBG9lxuok2fZyDyAy3U8CpUFRC4";

export default function Header(): JSX.Element {
  const [address, setAddress] = useState("");
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const {
    status: check,
    isConnected,
    isDisconnected,
    addresses,
    chainId,
    chain,
  } = useAccount();

  useEffect(() => {
    if (check == "connected") {
      setAddress(addresses[0]);
    }
  }, [addresses, check]);

  // get reward token balance for given wallet address
  //   const rewardToken = useBalance({
  //     address: address as `0x${string}`,
  //     token: TokenAddress as `0x${string}` | undefined,
  //   });

  const EthWalletBalance = useBalance({
    address: address as `0x${string}`,
  });

  return (
    <header className="p-1 flex justify-around items-center mt-5">
      <div className="flex items-center p-2">
        <div className="border-r p-2">
          <h1 className="font-medium text-xl">Distortion</h1>
        </div>
        <Link
          href={"/"}
          className="ml-3 hover:text-neutral-500 hover:ease-linear"
        >
          stake
        </Link>
      </div>

      <section className="">
        <div className="flex items-center gap-3">
          {check === "connected" && (
            <>
              <Avatar>
                <AvatarImage src={link} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Badge className="font-medium text-sm" variant={"secondary"}>
                {addresses[0].slice(0, 6) + "..." + addresses[0]?.slice(-3)}
              </Badge>
              <p className="text-sm font-medium">
                {" "}
                {EthWalletBalance.data?.formatted} Ξ
              </p>
            </>
          )}

          {check === "connected" ? (
            <Button variant={"outline"} onClick={() => disconnect()}>
              disconnect
            </Button>
          ) : (
            <Button
              variant={"outline"}
              onClick={() => connect({ connector: injected() })}
            >
              connect
            </Button>
          )}
        </div>
        <div>
          {chainId !== arbitrumSepolia.id && check == "connected" ? (
            <p className="text-red-400 font-medium text-sm text-end">
              wrong chain switch to arbitrum sepolia
            </p>
          ) : null}
        </div>
      </section>
    </header>
  );
}
