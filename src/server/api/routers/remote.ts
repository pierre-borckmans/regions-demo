import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

const AppHostName = z.enum(["app1", "app2", "app3", "app4"]);
const CommandType = z.enum(["ping", "dig", "curl", "uptime"]);

export const remoteRouter = createTRPCRouter({
  ipsForHost: publicProcedure
    .input(z.object({ fromHost: AppHostName, targetHost: AppHostName }))
    .query(async ({ input }) => {
      const queryString = `input=${JSON.stringify({
        json: { host: input.targetHost },
      })}`;
      const url = encodeURI(
        `http://${input.fromHost}:4000/api/trpc/local.ipsForHost?${queryString}`
      );
      const resp = await (await fetch(url)).json();
      return resp.result.data.json;
    }),

  executeCommand: publicProcedure
    .input(
      z.object({
        fromHost: AppHostName,
        command: CommandType,
        targetHost: AppHostName,
      })
    )
    .mutation(async ({ input }) => {
      return (
        await (
          await fetch(
            `http://${input.fromHost}:4000/api/trpc/local.executeCommand`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                json: { command: input.command, host: input.targetHost },
              }),
            }
          )
        ).json()
      ).result.data.json;
    }),

  poke: publicProcedure
    .input(z.object({ host: AppHostName }))
    .mutation(async ({ input }) => {
      return await fetch(`http://${input.host}:4000/api/trpc/local.poke`, {
        method: "POST",
      });
    }),

  resetPokes: publicProcedure
    .input(z.object({ host: AppHostName }))
    .mutation(async ({ input }) => {
      const queryString = `input=${JSON.stringify({
        json: { host: input.host },
      })}`;
      const url = encodeURI(
        `http://${input.host}:4000/api/trpc/local.ipsForHost?${queryString}`
      );
      const { ips } = (await (await fetch(url)).json()).result.data.json;

      return await Promise.all(
        ips.map(async (ip: string) => {
          return await (
            await fetch(`http://[${ip}]:4000/api/trpc/local.resetPokes`, {
              method: "POST",
            })
          ).json();
        })
      );
    }),

  pokes: publicProcedure
    .input(z.object({ host: AppHostName }))
    .query(async ({ input }) => {
      const queryString = `input=${JSON.stringify({
        json: { host: input.host },
      })}`;
      const url = encodeURI(
        `http://${input.host}:4000/api/trpc/local.ipsForHost?${queryString}`
      );
      const { ips } = (await (await fetch(url)).json()).result.data.json;

      const pokes: Record<string, number> = {};
      await Promise.all(
        ips.map(async (ip: string) => {
          const ipPokes = (
            await (
              await fetch(`http://[${ip}]:4000/api/trpc/local.pokes`)
            ).json()
          ).result.data.json.pokes;
          pokes[ip] = ipPokes;
        })
      );

      return { pokes };
    }),
});
