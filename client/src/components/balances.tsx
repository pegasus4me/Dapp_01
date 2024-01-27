"use client";
import { useState, useEffect } from "react";
import { readContract, writeContract } from "@wagmi/core";
import { abi } from "../config/abi";
import { config } from "@/config/config";
import { useBalance } from "wagmi";
import { InsufficientFundsError, formatEther } from "viem";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { parseEther } from "viem";

const ContractAddress: string = "0x2eB9EF32e0e0382Cbe4E3889A43c9CDb4BF72ef9";
const TokenAddress: string = "0xAF162873B327C33213D76e0228647b0e2CA9E473";

import { useWriteContract } from "wagmi";

/*
 * @returns eth balance + rewards token balance
 */

export default function Balances({ address }: { address: string }) {
  const [nativeTokenBalance, setNativeTokenBalance] = useState<bigint>();
  const [amount, setAmount] = useState<string>();
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  async function fetchContractBalance() {
    try {
      const ethBalance = await readContract(config, {
        abi,
        address: ContractAddress,
        functionName: "checkBalance",
      });
      setNativeTokenBalance(ethBalance);
    } catch (error) {
      let message = "Unknow error";
      if (error instanceof Error) message = error.message;
      throw new Error(message);
    }
  }

  async function receiveEth() {
    const parseETH: bigint = parseEther(amount as string);
    try {
      const deposit = writeContract({
        address: ContractAddress as `0x${string}`,
        abi,
        functionName: "depostit",
        value: parseETH,
        account: address as `0x${string}` ,
      });
      console.log("ddd", deposit);
    } catch (error) {
      let message = "Unknow error";
      if (error instanceof Error) message = error.message;
      // const isInsufficientFundsError = error.walk((e : any) => e instanceof InsufficientFundsError)
      throw new Error(message);
    }
  }

  useEffect(() => {
    fetchContractBalance();
  }, []);

  return (
    <>
     

      {/* show contract token balance   */}
      <div className="flex items-center gap-4 mt-3">
        <p className="flex items-center text-sm font-medium">
          {nativeTokenBalance !== undefined
            ? formatEther(nativeTokenBalance)
            : "Loading..."}{" "}
          Ξ
        </p>

        {/* deposit native tokens into the contract to continue  */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">deposit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Deposit eth</DialogTitle>
              <DialogDescription>
                Deposit Ethereum into the contract to initiate the staking
                process and begin earning Reward Tokens (RT).
              </DialogDescription>
              {hash && (
                <a
                  href={`https://sepolia.arbiscan.io/tx/${hash}`}
                  className="text-red-400"
                >
                  view your transaction
                </a>
              )}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  amount
                </Label>
                <Input
                  id="amount"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAmount(e.target.value)
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => receiveEth()}>deposit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
