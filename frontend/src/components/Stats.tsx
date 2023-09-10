import { useQuery } from "@tanstack/react-query";
import { Region, REGIONS } from "~/constants/regions";

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
      className={`flex h-full w-full flex-col items-center gap-4 rounded-xl border-2
      bg-white/10 px-2 py-2 text-white shadow-2xl drop-shadow-2xl
      transition-all duration-200 hover:scale-105 hover:bg-white/20`}
    >
      <div>stats</div>
      <div className="flex flex-col gap-1 text-[10px]">
        <span>{JSON.stringify(statsEurope)}</span>
        <span>{JSON.stringify(statsAsia)}</span>
        <span>{JSON.stringify(statsUsWest)}</span>
        <span>{JSON.stringify(statsUsEast)}</span>
      </div>
    </div>
  );
}
