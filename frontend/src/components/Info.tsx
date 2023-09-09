import { Region } from "~/constants/regions";
import Ping from "~/components/Ping";

type Props = {
  selectedRegion?: Region;
};
export default function Info({ selectedRegion }: Props) {
  return (
    <div
      className={`flex h-full w-full flex-col gap-4 rounded-xl bg-white/10 py-0 text-white
      shadow-2xl drop-shadow-2xl transition-all duration-200 hover:scale-105 hover:bg-white/20`}
    >
      <div className="flex w-full">
        {selectedRegion ? (
          <div className="flex">Region: {selectedRegion.name}</div>
        ) : null}
      </div>
      <Ping />
    </div>
  );
}
