export default function Title() {
  return (
    <div className="flex items-center gap-8">
      <div className="relative flex">
        <img
          src="/logo-dark.svg"
          width={44}
          className="mr-1 animate-pulse blur-[0px]"
        />
      </div>

      <h1 className="flex flex-col items-center gap-0 font-extrabold tracking-tight text-white">
        <span className="text-2xl text-purple-400">Railway World Trip</span>
        <div className="relative flex">
          <span className="absolute text-lg text-purple-300 ">
            Regions Playground
          </span>
          <span className="animate-pulse text-lg text-white/50 blur-[14px]">
            Regions Playground
          </span>
        </div>
      </h1>

      <div className="relative flex">
        <img
          src="/private-networking.svg"
          width={50}
          className="absolute left-0 top-0 scale-110 animate-pulse blur-[8px]"
        />
        <img src="/international.png" width={50} className="" />
      </div>
    </div>
  );
}
