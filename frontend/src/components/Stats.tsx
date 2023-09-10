import { useQuery } from "@tanstack/react-query";
import { Region, REGIONS } from "~/constants/regions";
import Image from "next/image";

type Props = {
  lastRefresh: number;
};
export default function Stats({ lastRefresh }: Props) {
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
        (avg / min / max)
      </span>
      {/*</div>*/}
      <div className="flex w-full items-center justify-center gap-2 text-[rgb(204,102,255)]">
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
      <div className="flex w-full justify-center gap-1 text-3xl">
        <Table
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
  stats,
}: {
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
  console.log(stats);
  return (
    <div className="text-mono flex flex-col text-sm">
      <div className="flex">
        <div className="flex w-28"></div>
        {REGIONS!.map((region) => (
          <div className="flex w-28 justify-center text-3xl">{region.flag}</div>
        ))}
      </div>
      {REGIONS!.map((region) => (
        <div className="flex items-center" key={`reg-${region.id}`}>
          <div className="flex w-28 justify-center text-3xl">{region.flag}</div>
          {REGIONS!.map((otherRegion) => (
            <div
              className="text-mono flex w-28 justify-center"
              key={`otherreg-${otherRegion.id}`}
            >
              {stats &&
              stats[region.id] &&
              stats[region.id]![otherRegion.id] &&
              stats[region.id]![otherRegion.id]!.public.avg
                ? `${Math.round(
                    stats![region.id]![otherRegion.id]!.public!.avg + 3
                  )}ms`
                : "-"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
