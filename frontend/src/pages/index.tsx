import { type NextPage } from "next";
import Head from "next/head";
import Title from "~/components/Title";
import dynamic from "next/dynamic";
import { RegionsGlobeProps } from "~/components/RegionsGlobe";
import React, { useState } from "react";
import { Region, REGIONS } from "~/constants/regions";
import Ping from "~/components/Ping";
import { QueryClient } from "@tanstack/query-core";
import Info from "~/components/Info";

export const RegionsGlobe = dynamic<RegionsGlobeProps>(
  () => import("../components/RegionsGlobe"),
  {
    ssr: false,
  }
);
const Home: NextPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(
    undefined
  );
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  return (
    <>
      <Head>
        <title>Regions playground</title>
        <link rel="icon" href="/international.png" />
      </Head>

      <main
        className="flex h-screen min-h-0 w-full min-w-0 flex-col items-center py-4 pr-4"
        style={{
          backgroundImage: `linear-gradient(
            140deg,
            hsl(240deg 46% 37%) 0%,
            hsl(280deg 49% 38%) 36%,
            hsl(311deg 56% 41%) 59%,
            hsl(328deg 63% 50%) 76%,
            hsl(342deg 87% 59%) 87%,
            hsl(358deg 100% 67%) 94%,
            hsl(17deg 100% 64%) 99%,
            hsl(33deg 100% 59%) 101%,
            hsl(46deg 100% 51%) 101%,
            hsl(55deg 100% 50%) 100%
        )`,
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-start gap-2 gap-y-6">
          <Title />
          <div className="flex h-full min-h-0 w-full gap-4 px-4">
            <div className="flex h-full w-full max-w-[60%]">
              <RegionsGlobe
                selectedRegion={selectedRegion}
                onRegionSelected={(region) => {
                  setLastRefresh(Date.now());
                  setSelectedRegion(region);
                }}
              />
            </div>
            <Info selectedRegion={selectedRegion} lastRefresh={lastRefresh} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
