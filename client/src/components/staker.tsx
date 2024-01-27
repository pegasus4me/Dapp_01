"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import Balances from "./balances";
import { useAccount, useWriteContract } from "wagmi";
import { useWatchContractEvent } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { useReadContract } from "wagmi";
import { abi } from "../config/abi";
import { parseEther, formatEther } from "viem";
import { Separator } from "@/components/ui/separator";
import { useBalance } from "wagmi";

const ContractAddress: `0x${string}` =
  "0xcbE2E1b02Ca51b853ff1F7289054AEeeF7Cf4e09";

export default function Staker() {
  const { toast } = useToast();
  const { addresses } = useAccount();
  const [amount, setAmount] = useState<string>("");
  const [unstakeAmount, setUnstakedAmount] = useState<string>("");
  const { writeContract } = useWriteContract();

  const EthWalletBalance = useBalance({
    address: addresses !== undefined ? (addresses[0] as `0x${string}`) : "0x",
  });

  async function stake() {
    // parse eth => wei 10^8
    const parsed: bigint = parseEther(amount);

    try {
      writeContract({
        abi,
        address: ContractAddress,
        functionName: "stake",
        value: parsed,
      });
    } catch (error: any) {
      throw new error(error);
    }
  }
  function unstake() {

    writeContract({
      abi, 
      address : ContractAddress, 
      args : [parseEther(unstakeAmount)]
    })

  }
  function claim() {}

  useWatchContractEvent({
    address: ContractAddress,
    abi,
    eventName: "Staked",
    onLogs(logs) {
      console.log("new logs!", logs);
    },
  });

  const stakedBal = useReadContract({
    abi,
    address: ContractAddress,
    functionName: "checkBalance",
  });
  console.log("staked", stakedBal.data) 

  return (
    <main>
      <div className="p-2 border min-w-[500px] min-h-[600px] rounded-md shadow-sm border-dashed">
        <div>
          <p className="text-center">rewards earneds : 49 RT</p>
          <article className="flex gap-4 flex-col mt-5">
            <Input
              placeholder="0.0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value)
              }
            />
            <p className="text-xs font-light items-end text-end text-neutral-500">
              {EthWalletBalance.data?.formatted}Ξ
            </p>
            <Button onClick={() => stake()}>stake</Button>
          </article>

          <div>
            <Separator />
            <article className="flex gap-4 flex-col mt-5">
              <Input placeholder="0.0" 
               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUnstakedAmount(e.target.value)
              }
              />
              <p className="text-xs font-light items-end text-end text-neutral-500">
                {stakedBal.data !== undefined
                  ? formatEther(stakedBal.data as bigint)
                  : "..."}{" "}
                Ξ
              </p>
              <Button variant={"outline"} onClick={() => unstake()}>
                unstake
              </Button>
            </article>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <Button variant={"secondary"} onClick={() => claim()}>
            claim rewards
          </Button>
        </div>
      </div>
    </main>
  );
}
