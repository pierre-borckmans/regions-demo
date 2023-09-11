import { type NextPage } from "next";
import Head from "next/head";
import Title from "~/components/Title";
import dynamic from "next/dynamic";
import { RegionsGlobeProps } from "~/components/RegionsGlobe";
import React, { useState } from "react";
import { Region } from "~/constants/regions";
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
  const [globeReady, setGlobeReady] = useState(false);

  const handleRegionSelected = (region?: Region) => {
    setLastRefresh(Date.now());
    setSelectedRegion(region);
  };

  return (
    <>
      <Head>
        <title>Railway World Trip</title>
        <link rel="icon" href="/international.png" />
      </Head>

      <main
        className="flex min-h-screen w-full min-w-0 flex-col items-center overflow-hidden px-2 pb-8 pt-4 lg:h-screen"
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

          <div className="flex h-full min-h-0 w-full flex-wrap justify-around gap-4 px-4">
            <div className="flex h-[340px] w-full max-w-[100%] lg:h-full lg:max-w-[50%]">
              {globeReady ? null : (
                <div className="flex h-full w-full items-center justify-center gap-1">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo-dark.svg"
                      width={28}
                      className="animate-spin"
                    />
                    <span className="text-lg italic text-purple-300">
                      Loading the world... Yes the entire world!
                    </span>
                  </div>
                </div>
              )}
              <RegionsGlobe
                onGlobeReady={() => {
                  setGlobeReady(true);
                }}
                selectedRegion={selectedRegion}
                onRegionSelected={handleRegionSelected}
                lastRefresh={lastRefresh}
              />
            </div>
            <div className="flex h-full w-full max-w-[100%] lg:max-w-[48%]">
              <Info
                selectedRegion={selectedRegion}
                lastRefresh={lastRefresh}
                onRegionSelected={handleRegionSelected}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
