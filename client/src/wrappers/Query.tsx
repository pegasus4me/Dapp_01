"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();
const Query = ({ children }: { children: React.ReactNode }) : JSX.Element => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider> 
};
export default Query;
