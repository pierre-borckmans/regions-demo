import { useQuery } from "@tanstack/react-query";
import { Region } from "~/constants/regions";

type Ping = {
  public: number;
  private: number;
};

type RegionsPing = {
  "europe-west4": Ping;
  "asia-southeast1": Ping;
  "us-west1": Ping;
  "us-east4": Ping;
};

type Props = {
  selectedRegion?: Region;
};
export default function Ping({ selectedRegion }: Props) {
  const pingRegions = async () => {
    const r = (await fetch("http://localhost:4444/ping")).json();
    return r;
  };

  const { data: pingResults } = useQuery({
    // queryKey: "ping",
    queryFn: pingRegions,
  });

  return (
    <div
      className={`flex h-full w-full flex-col gap-4 rounded-xl border-2 bg-white/10
      px-2 py-2 text-white shadow-2xl drop-shadow-2xl transition-all
      duration-200 hover:scale-105 hover:bg-white/20`}
    >
      <div className="flex w-full">
        {selectedRegion ? (
          <div className="flex items-center gap-1">
            <div className="text-3xl">{selectedRegion.flag}</div>
            <span>[{selectedRegion.id}]</span>
            <span className="text-xs text-gray-400">{selectedRegion.name}</span>
            <span className="text-xs text-gray-400">
              ({selectedRegion.country})
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex h-full w-full text-xs">
        {JSON.stringify(pingResults)}
      </div>
    </div>
  );
}
