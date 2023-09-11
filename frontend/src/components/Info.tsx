import { Region } from "~/constants/regions";
import Ping from "~/components/Ping";
import Stats from "~/components/Stats";

type Props = {
  onRegionSelected: (region: Region) => void;
  selectedRegion?: Region;
  lastRefresh: number;
};
export default function Info({
  selectedRegion,
  lastRefresh,
  onRegionSelected,
}: Props) {
  return (
    <div className="flex h-full w-full flex-col gap-8 lg:justify-center">
      <Ping
        selectedRegion={selectedRegion}
        lastRefresh={lastRefresh}
        onRegionSelected={onRegionSelected}
      />
      <Stats lastRefresh={lastRefresh} onRegionSelected={onRegionSelected} />
    </div>
  );
}
