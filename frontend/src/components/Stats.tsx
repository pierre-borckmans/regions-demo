import { useQuery } from "@tanstack/react-query";
import { Region, REGIONS } from "~/constants/regions";
import Image from "next/image";
import { useState } from "react";

type Props = {
  lastRefresh: number;
};
export default function Stats({ lastRefresh }: Props) {
  const [isPublic, setPublic] = useState(false);
  const getStats = async (region: Region) => {
    const r = (await fetch(`${region!.host}/stats`)).json();
    return r;
  };

  const { data: statsEurope } = useQuery({
    queryKey: ["stats", "europe", lastRefresh],
    cacheTime: 0,
    queryFn: () => getStats(REGIONS[0]!),
  });
  const { data: statsUsWest } = useQuery({
    queryKey: ["stats", "us-west", lastRefresh],
    cacheTime: 0,
    queryFn: () => getStats(REGIONS[1]!),
  });
  const { data: statsUsEast } = useQuery({
    queryKey: ["stats", "us-east", lastRefresh],
    cacheTime: 0,
    queryFn: () => getStats(REGIONS[2]!),
  });
  const { data: statsAsia } = useQuery({
    queryKey: ["stats", "asia", lastRefresh],
    cacheTime: 0,
    queryFn: () => getStats(REGIONS[3]!),
  });

  return (
    <div
      className={`flex h-[50%] min-h-0 w-full flex-col items-center justify-center gap-2 rounded-xl
      border-2 bg-white/10
      px-2 py-0.5 text-white shadow-2xl drop-shadow-2xl transition-all
      duration-200 hover:scale-[1.03] hover:bg-white/20`}
    >
      {/*<div className="flex items-center gap-1">*/}
      <span className="text-2xl">Inter-region Trips Durations</span>
      <span className="mt-[-10px] text-lg text-gray-300">
        min | avg | max (ms)
      </span>
      {/*</div>*/}
      <div className="flex items-center justify-center gap-4 text-[rgb(224,102,255)]">
        <div
          className={`flex cursor-pointer items-center justify-center gap-1 rounded px-2 py-1 text-lg
          ${!isPublic && "border bg-purple-400 text-white"}`}
          onClick={() => setPublic(false)}
        >
          <span>Via Private Network</span>
        </div>
        <div
          className={`flex cursor-pointer items-center justify-center gap-1 rounded px-2 py-1 text-lg
          ${isPublic && "border bg-purple-400 text-white"}`}
          onClick={() => setPublic(true)}
        >
          <span>Via Internet</span>
        </div>
      </div>
      <div className="flex w-full justify-center gap-1 text-3xl">
        <Table
          isPublic={isPublic}
          stats={{
            "europe-west4": statsEurope,
            "asia-southeast1": statsAsia,
            "us-west1": statsUsWest,
            "us-east4": statsUsEast,
          }}
        />
      </div>
      <span className="mt-3 text-xs italic text-purple-200">
        Our trains are always on time!
      </span>
    </div>
  );
}

const Table = ({
  isPublic,
  stats,
}: {
  isPublic: boolean;
  stats: Record<
    string,
    Record<
      string,
      {
        public: { avg: number; max: number; min: number };
        private: { avg: number; max: number; min: number };
      }
    >
  >;
}) => {
  const field = isPublic ? "public" : "private";
  return (
    <div className="text-mono flex flex-col text-sm">
      <div className="flex">
        <div className="flex w-28"></div>
        {REGIONS!.map((region) => (
          <div className="flex w-36 justify-center text-3xl">{region.flag}</div>
        ))}
      </div>
      {REGIONS!.map((region) => (
        <div className="flex items-center" key={`reg-${region.id}`}>
          <div className="flex w-28 justify-center text-3xl">{region.flag}</div>
          {REGIONS!.map((otherRegion) => (
            <div
              className="flex w-36 justify-center gap-2 font-mono"
              key={`otherreg-${otherRegion.id} `}
            >
              <span className="border-r pr-2 text-emerald-400">
                {stats &&
                stats[region.id] &&
                stats[region.id]![otherRegion.id] &&
                stats[region.id]![otherRegion.id]![field].min
                  ? `${Math.round(
                      stats![region.id]![otherRegion.id]![field]!.min
                    )}`
                  : "-"}
              </span>
              <span className="border-r pr-2 text-sky-200">
                {stats &&
                stats[region.id] &&
                stats[region.id]![otherRegion.id] &&
                stats[region.id]![otherRegion.id]![field].avg
                  ? `${Math.round(
                      stats![region.id]![otherRegion.id]![field]!.avg
                    )}`
                  : "-"}
              </span>
              <span className="text-red-300">
                {stats &&
                stats[region.id] &&
                stats[region.id]![otherRegion.id] &&
                stats[region.id]![otherRegion.id]![field].max
                  ? `${Math.round(
                      stats![region.id]![otherRegion.id]![field]!.max
                    )}`
                  : "-"}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
