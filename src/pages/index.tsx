import { type NextPage } from "next";
import Head from "next/head";
import Title from "~/components/Title";
import dynamic from "next/dynamic";
import { RegionsGlobeProps } from "~/components/RegionsGlobe";
import { useState } from "react";
import { Region, REGIONS } from "~/constants/regions";

export const RegionsGlobe = dynamic<RegionsGlobeProps>(
  () => import("../components/RegionsGlobe"),
  {
    ssr: false,
  }
);
const Home: NextPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(REGIONS[0]!);
  return (
    <>
      <Head>
        <title>Regions playground</title>
        <link rel="icon" href="/international.png" />
      </Head>

      <main
        className="flex h-screen min-h-0 flex-col items-center py-8"
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
        );`,
        }}
      >
        <div className="flex h-full min-h-0 w-full flex-col items-center justify-start gap-2 gap-y-8">
          <Title />
          <div className="flex flex-col items-center gap-1 text-white">
            <div>{selectedRegion.id}</div>
            <div>{selectedRegion.name}</div>
          </div>
          <RegionsGlobe
            onRegionSelected={(region) => {
              setSelectedRegion(region);
            }}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
