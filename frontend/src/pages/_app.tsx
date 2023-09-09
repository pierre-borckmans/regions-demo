import { type AppType } from "next/app";
import "~/styles/globals.css";
import { QueryClient } from "@tanstack/query-core";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";

const MyApp: AppType = ({ Component, pageProps }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default MyApp;
