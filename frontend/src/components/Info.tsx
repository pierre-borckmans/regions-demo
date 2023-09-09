import { Region } from "~/constants/regions";
import Ping from "~/components/Ping";
import Stats from "~/components/Stats";

type Props = {
  selectedRegion?: Region;
};
export default function Info({ selectedRegion }: Props) {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <Ping selectedRegion={selectedRegion} />
      <Stats />
    </div>
  );
}
