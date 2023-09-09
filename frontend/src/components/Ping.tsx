import { useQuery } from "@tanstack/react-query";

type Ping = {
  public: number;
  private: number;
};

type RegionsPing = {
  "europe-west4": Ping;
  "asia-southeast1": Ping;
  "us-west1": Ping;
  "us-east4": Ping;
};

export default function Ping() {
  const pingRegions = async () => {
    const r = (await fetch("http://localhost:4444/ping")).json();
    return r;
  };

  const { data: pingResults } = useQuery({
    // queryKey: "ping",
    queryFn: pingRegions,
  });

  return <div className="flex h-full w-full border">hello</div>;
}
