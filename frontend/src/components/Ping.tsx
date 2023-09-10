import { useQuery } from "@tanstack/react-query";
import { Region, REGIONS } from "~/constants/regions";
import Image from "next/image";
import { useEffect, useState } from "react";

type Ping = {
  public: number;
  private: number;
};

type Props = {
  selectedRegion?: Region;
  lastRefresh: number;
};
export default function Ping({ selectedRegion, lastRefresh }: Props) {
  const [loading, setLoading] = useState(true);
  const pingRegions = async () => {
    const r = (await fetch(`${selectedRegion!.host}/ping`)).json();
    return r;
  };

  const {
    data: pingResults,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["ping", selectedRegion?.id, lastRefresh],
    cacheTime: 0,
    queryFn: pingRegions,
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  }, [isLoading, isSuccess]);

  return (
    <div
      className={`flex h-[240px] min-h-0 w-full flex-col justify-center gap-1 rounded-xl border-2
      bg-white/10 px-2 text-white shadow-2xl drop-shadow-2xl
      transition-all duration-200 hover:scale-[1.03] hover:bg-white/20`}
    >
      {selectedRegion ? (
        <>
          <div className="flex w-full justify-center ">
            <div className="flex items-center gap-1">
              <div className="mt-1 text-2xl leading-6">
                {selectedRegion.flag}
              </div>
              <span className="text-2xl">{selectedRegion.id}</span>
              <span className="text-lg text-gray-300">
                ({selectedRegion.name},
              </span>
              <span className="text-lg text-gray-300">
                {selectedRegion.country})
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            <div className="flex w-full flex-col items-center justify-center gap-2 text-[rgb(204,102,255)]">
              {/*Private Network / Internet*/}
              <div className="flex w-full items-center">
                <div className="flex w-full items-center justify-center gap-1 text-lg">
                  <Image
                    src="private-networking.svg"
                    alt="private networking"
                    width={20}
                    height={20}
                  />
                  <span>Via Private Network</span>
                </div>
                <div className="flex w-full items-center justify-center gap-1 text-lg">
                  <img
                    src="/globe.svg"
                    alt="internet"
                    width={20}
                    height={20}
                    className="stroke-red"
                  />
                  <span>Via Internet</span>
                </div>
              </div>

              <div className="flex h-[140px] w-full flex-col items-center justify-center text-white">
                {isLoading || loading ? (
                  <div className="flex h-12 w-full items-start justify-center gap-1">
                    <div className="flex items-center gap-3">
                      <img
                        src="/logo-dark.svg"
                        width={28}
                        className="animate-spin"
                      />
                      <span className="text-lg italic text-purple-300">
                        Riding train across the globe...
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex w-full items-center justify-center font-mono text-lg">
                      <div className="flex w-full flex-col items-center justify-center gap-0.5">
                        {REGIONS.map((region) => (
                          <div className="flex w-40 items-center justify-center gap-1">
                            <img src="/logo-dark.svg" width={20} />
                            <span className="text-3xl leading-3">
                              {region.flag}{" "}
                            </span>
                            <span className="flex w-20 justify-end">
                              {pingResults[region.id].private} ms
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex w-full flex-col items-center justify-center gap-0.5">
                        {REGIONS.map((region) => (
                          <div className="flex w-40 items-center justify-center gap-1">
                            <img src="/logo-dark.svg" width={20} />
                            <span className="text-3xl leading-3">
                              {region.flag}{" "}
                            </span>
                            <span className="flex w-20 justify-end">
                              {pingResults[region.id].public} ms
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="mt-3 text-xs italic text-purple-200">
                      Now, those are some real fast trains!
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center text-lg italic text-gray-300">
          <span className="text-purple-300">
            Select a region on the map to start a world trip...
          </span>
          <span className="text-purple-200">
            Let's see how fast we can do it!
          </span>
          <span className="mt-2 text-sm">
            (shift+click to keep current globe orientation)
          </span>
        </div>
      )}
    </div>
  );
}
