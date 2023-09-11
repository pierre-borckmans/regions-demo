import DirectionIcon from "~/components/DirectionIcon";

export default function FlagWithDirection({
  flag,
  direction,
}: {
  flag: string;
  direction: number;
}) {
  return (
    <div className="relative mr-3 text-3xl leading-3">
      {flag}{" "}
      <div className="absolute bottom-[-8px] right-[-8px]">
        <DirectionIcon direction={direction} width={12} height={12} />
      </div>
    </div>
  );
}
