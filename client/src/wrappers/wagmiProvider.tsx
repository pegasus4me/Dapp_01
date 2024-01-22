"use client";
import { WagmiProvider } from "wagmi";
import { config } from "../config/config";

const WProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};
export default WProvider;
