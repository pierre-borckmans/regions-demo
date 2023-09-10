import { Region } from "~/constants/regions";
import Ping from "~/components/Ping";
import Stats from "~/components/Stats";

type Props = {
  selectedRegion?: Region;
  lastRefresh: number;
};
export default function Info({ selectedRegion, lastRefresh }: Props) {
  return (
    <div className="flex h-full w-full flex-col justify-around gap-2">
      <Ping selectedRegion={selectedRegion} lastRefresh={lastRefresh} />
      <Stats lastRefresh={lastRefresh} />
    </div>
  );
}
