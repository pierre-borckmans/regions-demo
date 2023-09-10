import { useQuery } from "@tanstack/react-query";
import { Region, REGIONS } from "~/constants/regions";
import Image from "next/image";

type Ping = {
  public: number;
  private: number;
};

type Props = {
  selectedRegion?: Region;
  lastRefresh: number;
};
export default function Ping({ selectedRegion, lastRefresh }: Props) {
  const pingRegions = async () => {
    const r = (await fetch(`${selectedRegion!.host}/ping`)).json();
    return r;
  };

  const { data: pingResults, isLoading } = useQuery({
    queryKey: ["ping", selectedRegion?.id, lastRefresh],
    cacheTime: 0,
    queryFn: pingRegions,
  });

  return (
    <div
      className={`flex h-full w-full flex-col gap-2 rounded-xl border-2 bg-white/10
      px-2 py-0.5 text-white shadow-2xl drop-shadow-2xl transition-all
      duration-200 hover:scale-[1.03] hover:bg-white/20`}
    >
      {selectedRegion ? (
        <>
          <div className="flex w-full justify-center">
            <div className="flex items-center gap-1">
              <div className="mt-1 text-2xl">{selectedRegion.flag}</div>
              <span>{selectedRegion.id}</span>
              <span className="text-xs text-gray-300">
                ({selectedRegion.name},
              </span>
              <span className="text-xs text-gray-300">
                {selectedRegion.country})
              </span>
            </div>
          </div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex gap-2">
              <div className="flex w-full flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-1 text-xs">
                  <Image
                    src="private-networking.svg"
                    alt="private networking"
                    width={20}
                    height={20}
                  />
                  <span>Private Network</span>
                </div>
                <div className="flex flex-col gap-1">
                  {REGIONS.map((region) => (
                    <div className="flex items-center gap-1">
                      <span>{region.flag} </span>
                      <span>{pingResults[region.id].private*1000} ms</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-1 text-xs">
                  <img
                    src="/globe.svg"
                    alt="internet"
                    width={20}
                    height={20}
                    className="stroke-red"
                  />
                  <span>Internet</span>
                </div>
                <div className="flex flex-col gap-1">
                  {REGIONS.map((region) => (
                    <div className="flex items-center gap-1">
                      <span>{region.flag} </span>
                      <span>{pingResults[region.id].public*1000} ms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/*<div className="flex h-full w-full text-xs">*/}
          {/*  {JSON.stringify(pingResults)}*/}
          {/*</div>*/}
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center text-sm italic text-gray-300">
          <span>Select a region on the map to check its latency</span>
          <span className="text-xs">
            (shift+click to keep current globe orientation)
          </span>
        </div>
      )}
    </div>
  );
}
