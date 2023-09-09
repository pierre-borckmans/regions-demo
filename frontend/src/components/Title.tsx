export default function Title() {
  return (
    <div className="flex items-center gap-8">
      <div className="relative flex">
        <img src="/logo-dark.svg" width={44} className="mr-1 animate-pulse blur-[0px]" />
      </div>

      <h1 className="flex flex-col items-center gap-0 font-extrabold tracking-tight text-white">
        <span className="text-xl text-[hsl(290,75%,55%)]">Railway Regions</span>
        <div className="relative flex">
          <span className="absolute text-2xl text-[hsl(280,100%,80%)] ">
            Playground
          </span>
          <span className="animate-pulse text-2xl text-white/50 blur-[14px]">
            Playground
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
