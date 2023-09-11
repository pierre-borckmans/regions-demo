import { useQuery } from "@tanstack/react-query";
import { Region, REGIONS } from "~/constants/regions";
import Image from "next/image";
import { useState } from "react";
import DirectionIcon from "~/components/DirectionIcon";
import FlagWithDirection from "~/components/FlagWithDirection";

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
      <span className="text-xl lg:text-2xl">Inter-region Trips Durations</span>
      <span className="mt-[-10px] text-lg text-gray-300">
        <span className="text-emerald-400">min</span> |{" "}
        <span className="text-sky-200">avg</span> |{" "}
        <span className="text-red-300">max</span> (ms)
      </span>
      <div className="flex items-center justify-center gap-0 text-purple-300">
        <div
          className={`flex cursor-pointer items-center justify-center gap-1 rounded-bl rounded-tl border px-2 py-1 text-sm
          ${!isPublic && "bg-purple-400 text-white"}`}
          onClick={() => setPublic(false)}
        >
          <span>Via Private Network</span>
        </div>
        <div
          className={`flex cursor-pointer items-center justify-center gap-1 rounded-br rounded-tr border-b border-r border-t px-2 py-1 text-sm
          ${isPublic && "bg-purple-400 text-white"}`}
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
      <span className="mb-3 text-xs italic text-purple-200">
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
    <div className="text-mono flex w-full max-w-[700px] flex-col gap-3 text-sm">
      <div className="flex h-8 w-full items-center">
        <div className="flex h-full w-full items-center">
          <div className="flex min-w-[60px]"></div>
          {REGIONS!.map((region) => (
            <div
              className="flex h-fit w-full justify-center text-3xl"
              key={`header-${region.id}`}
            >
              <FlagWithDirection
                flag={region.flag}
                direction={region.direction}
              />
            </div>
          ))}
        </div>
      </div>
      {REGIONS!.map((region) => (
        <div className="flex h-8 w-full items-center" key={`reg-${region.id}`}>
          <div className="flex h-8 min-w-[60px] items-center justify-center text-3xl">
            <div
              className="flex h-fit items-center"
              key={`header-${region.id}`}
            >
              <FlagWithDirection
                flag={region.flag}
                direction={region.direction}
              />
            </div>
          </div>

          {REGIONS!.map((otherRegion) => (
            <div
              className="flex w-full flex-col justify-center overflow-hidden px-4 font-mono text-xs lg:flex-row lg:justify-around lg:gap-2 xl:text-xs"
              key={`otherreg-${otherRegion.id} `}
            >
              <span className="flex w-full justify-center leading-3 text-emerald-400">
                {stats &&
                stats[region.id] &&
                stats[region.id]![otherRegion.id] &&
                stats[region.id]![otherRegion.id]![field].min
                  ? `${Math.round(
                      stats![region.id]![otherRegion.id]![field]!.min
                    )}`
                  : "-"}
              </span>
              <span className="flex w-full justify-center leading-3 text-sky-200">
                {stats &&
                stats[region.id] &&
                stats[region.id]![otherRegion.id] &&
                stats[region.id]![otherRegion.id]![field].avg
                  ? `${Math.round(
                      stats![region.id]![otherRegion.id]![field]!.avg
                    )}`
                  : "-"}
              </span>
              <span className="flex w-full justify-center leading-3 text-red-300">
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
