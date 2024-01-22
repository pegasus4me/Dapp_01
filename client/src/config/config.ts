import { http, createConfig,createStorage } from "wagmi";
import { arbitrumSepolia } from "viem/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [arbitrumSepolia],
  storage: createStorage({ storage: window.localStorage }), 
  connectors : [
   injected()
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});
