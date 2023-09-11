import Icon from "../../public/direction.svg";

type Props = {
  direction: number;
  width: number;
  height: number;
};
export default function DirectionIcon({ direction, width, height }: Props) {
  return (
    <Icon
      style={{
        width,
        height,
        maxWidth: "100%",
        maxHeight: "100%",
        transform: `rotate(${direction}deg`,
      }}
    />
  );
}
