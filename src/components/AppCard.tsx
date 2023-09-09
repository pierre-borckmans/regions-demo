import { useEffect, useState } from "react";
import { useAppApi } from "~/hooks/useAppApi";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";

type CommandType = "ping" | "dig" | "curl" | "uptime";
type AppHostname = "app1" | "app2" | "app3" | "app4";

export default function AppCard({ appIdx }: { appIdx: 0 | 1 | 2 | 3 }) {
  const [cmd, setCmd] = useState("");
  const [cmdOut, setCmdOut] = useState("");
  const [cmdError, setCmdError] = useState<boolean>(false);

  const [previousPokes, setPreviousPokes] = useState<
    Record<string, number> | undefined
  >(undefined);
  const [gotPoked, setGotPoked] = useState(false);

  const { appsIps, hostname, pokes } = useAppApi(appIdx);
  const ownIp = api.local.ownIp.useQuery().data?.ip;

  useEffect(() => {
    setTimeout(() => setPreviousPokes(pokes), 350);
  }, [pokes]);

  useEffect(() => {
    if (!pokes || !previousPokes) return;
    Object.entries(pokes || {}).forEach(([ip, poke]) => {
      if (previousPokes?.[ip] !== poke) {
        setGotPoked(true);
        setTimeout(() => setGotPoked(false), 500);
      }
    });
  }, [previousPokes, pokes]);

  const queryClient = useQueryClient();
  const execCmdMutation = api.remote.executeCommand.useMutation();
  const pokeMutation = api.remote.poke.useMutation();
  const resetPokesMutation = api.remote.resetPokes.useMutation();

  const isCurrentApp =
    appsIps?.[appIdx]?.find((appIp) => ownIp === appIp) !== undefined;

  const handleExecCmd = (
    cmd: CommandType,
    targetHost: "app1" | "app2" | "app3" | "app4"
  ) => {
    execCmdMutation.mutate(
      {
        fromHost: hostname,
        command: cmd,
        targetHost,
      },
      {
        onSuccess: ({
          cmd: command,
          error,
          stdout,
          stderr,
        }: {
          cmd: string;
          error: boolean;
          stdout: string;
          stderr: string;
        }) => {
          setCmd(command);
          if (error) {
            setCmdError(true);
            setCmdOut(stderr);
          } else {
            setCmdError(false);
            setCmdOut(stdout);
          }
        },
        onError: (err) => {
          setCmdOut(err.message);
          setCmdError(true);
        },
      }
    );
  };

  return (
    <div
      className={`flex h-full w-full flex-col gap-4 rounded-xl bg-white/10 py-0 text-white
      shadow-2xl drop-shadow-2xl transition-all duration-200 hover:scale-105 hover:bg-white/20
      ${isCurrentApp ? "border-4 border-green-300" : "border border-white/70"}
      ${gotPoked ? "animate-shake" : ""}`}
    >
      <div className="mt-2 flex h-full w-full flex-col items-center gap-y-1">
        <div className="ml-8 flex w-full gap-2 xl:w-fit xl:items-center">
          <h2 className="relative rounded-xl border border-dashed px-2 text-[9pt] font-bold transition-all duration-100 hover:bg-white/10 xl:text-lg">
            {`app${appIdx + 1}`}
            <span className="text-[6pt] text-gray-300 xl:text-sm">
              .railway.internal
            </span>
          </h2>
          <button
            className="absolute right-4 cursor-pointer rounded-lg border bg-purple-500 px-1 active:scale-95"
            onClick={() => {
              resetPokesMutation.mutate(
                {
                  host: hostname,
                },
                {
                  onSuccess: async () => {
                    await queryClient.invalidateQueries();
                  },
                }
              );
            }}
          >
            <span className="hidden text-sm xl:block">reset pokes</span>
            <span className="block text-[9pt] xl:hidden">reset</span>
          </button>
        </div>
        <div className="mb-2 flex flex-col gap-y-1 text-[5pt] md:text-[8pt] xl:text-base">
          {appsIps?.[appIdx]?.map((ip) => (
            <div className="flex items-center gap-2">
              <span>{ip}</span>
              {pokes && pokes[ip!] !== undefined && (
                <div
                  className={`flex h-3 items-center rounded-xl bg-purple-600 px-1 py-2 text-gray-200
                ${previousPokes?.[ip!] !== pokes[ip!] ? "animate-poke" : ""}`}
                >
                  <span className="mt-[-1px] hidden xl:block">
                    {pokes[ip!]} pokes
                  </span>
                  <span className="mt-[-1px] block xl:hidden">
                    {pokes[ip!]}
                  </span>
                </div>
              )}
            </div>
          )) || "Getting ipv6 addresses..."}
        </div>
        <div className="flex h-full w-full flex-col gap-0">
          <div className="flex w-full items-center justify-around">
            {[0, 1, 2, 3]
              .filter((otherAppIdx) => otherAppIdx !== appIdx)
              .map((otherAppIdx) => (
                <div className="gap flex flex-col items-center justify-center">
                  <div className="flex w-full justify-center rounded-t-md bg-gray-300 text-sm text-gray-600">{`app${
                    otherAppIdx + 1
                  }`}</div>
                  <div className="gap flex">
                    <button
                      key={otherAppIdx}
                      className="flex h-full cursor-pointer items-center rounded-bl-lg border-b bg-purple-500 px-0.5 text-sm transition-all duration-100 hover:bg-purple-400 active:scale-95 xl:px-2"
                      onClick={() => {
                        pokeMutation.mutate(
                          {
                            host: `app${otherAppIdx + 1}` as AppHostname,
                          },
                          {
                            onSuccess: async () => {
                              await queryClient.invalidateQueries();
                            },
                          }
                        );
                      }}
                    >
                      <span className="hidden xl:block">poke</span>
                      <span className="block xl:hidden">p</span>
                    </button>
                    <button
                      key={otherAppIdx}
                      className="flex items-center border-b bg-orange-400 px-0.5 text-sm transition-all duration-100 hover:bg-orange-300 active:scale-95 xl:px-2"
                      onClick={() => {
                        handleExecCmd(
                          "ping",
                          `app${otherAppIdx + 1}` as AppHostname
                        );
                      }}
                    >
                      <span className="hidden xl:block">ping</span>
                      <span className="block xl:hidden">p</span>
                    </button>
                    <button
                      key={otherAppIdx}
                      className="flex items-center border-b bg-blue-400 px-0.5 text-sm transition-all duration-100 hover:bg-blue-300 active:scale-95 xl:px-2"
                      onClick={() => {
                        handleExecCmd(
                          "curl",
                          `app${otherAppIdx + 1}` as AppHostname
                        );
                      }}
                    >
                      <span className="hidden xl:block">curl</span>
                      <span className="block xl:hidden">c</span>
                    </button>
                    <button
                      key={otherAppIdx}
                      className="flex items-center rounded-br-lg border-b bg-gray-500 px-0.5 text-sm transition-all duration-100 hover:bg-gray-400 active:scale-95 xl:px-2"
                      onClick={() => {
                        handleExecCmd(
                          "dig",
                          `app${otherAppIdx + 1}` as AppHostname
                        );
                      }}
                    >
                      <span className="hidden xl:block">dig</span>
                      <span className="block xl:hidden">d</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex h-full w-full p-6">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-black shadow-md drop-shadow-md">
              <div className="flex w-full items-center justify-between px-2 ">
                <span className="mt-[-3px] pl-2">{`> `}</span>
                <span className="h-8 w-full rounded-md bg-black p-2 font-mono text-xs text-white focus:outline-none">
                  {cmd}
                </span>
              </div>
              <textarea
                disabled
                className={`flex h-full w-full resize-none overflow-scroll whitespace-pre rounded-b-md bg-gray-800 px-4 py-2 font-mono text-xs 
                        ${cmdError ? "text-pink-500" : "text-white/70"}`}
                value={cmdOut}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
