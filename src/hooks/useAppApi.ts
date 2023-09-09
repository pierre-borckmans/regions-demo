import { api } from "~/utils/api";

export const useAppApi = (appIdx: 0 | 1 | 2 | 3) => {
  const fromHost = `app${appIdx + 1}` as "app1" | "app2" | "app3" | "app4";

  const ipsApp1Query = api.remote.ipsForHost.useQuery({
    fromHost,
    targetHost: "app1",
  });
  const ipsApp2Query = api.remote.ipsForHost.useQuery({
    fromHost,
    targetHost: "app2",
  });
  const ipsApp3Query = api.remote.ipsForHost.useQuery({
    fromHost,
    targetHost: "app3",
  });
  const ipsApp4Query = api.remote.ipsForHost.useQuery({
    fromHost,
    targetHost: "app4",
  });
  const appsIps: (string | undefined)[][] = [
    ipsApp1Query,
    ipsApp2Query,
    ipsApp3Query,
    ipsApp4Query,
  ].map((ipsQuery) =>
    ipsQuery.data?.ips?.filter((ip: string) => ip.startsWith("fd12")).sort()
  );

  const pokesQuery = api.remote.pokes.useQuery({
    host: fromHost,
  });
  const pokes: Record<string, number> | undefined = pokesQuery.data?.pokes;

  return {
    appsIps,
    hostname: fromHost,
    pokes,
  };
};
