import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { promises as dns } from "dns";
import { z } from "zod";
import * as os from "os";

let pokes: number = 0;

const AppHostName = z.enum(["app1", "app2", "app3", "app4"]);
const CommandType = z.enum(["ping", "dig", "curl", "uptime"]);

const ownIp = () => {
  const networkInterfaces = os.networkInterfaces();
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]!) {
      if (
        net.family === "IPv6" &&
        !net.internal &&
        net.address.startsWith("fd12")
      ) {
        return net.address;
      }
    }
  }
  return undefined;
};

export const localRouter = createTRPCRouter({
  ownIp: publicProcedure.query(({ input }) => ({
    ip: ownIp(),
  })),

  ipsForHost: publicProcedure
    .input(z.object({ host: z.string() }))
    .query(async ({ input }) => {
      const ips = await dns.resolve6(`${input.host}.railway.internal`);
      console.log(`local ipsForHost: ${input.host}: [${ips.join(", ")}]`);
      return {
        ips,
      };
    }),

  executeCommand: publicProcedure
    .input(z.object({ command: CommandType, host: AppHostName }))
    .mutation(async ({ input }) => {
      const { exec } = await import("child_process");

      let cmdToRun: string;
      switch (input.command) {
        case "ping":
          cmdToRun = `ping -c 1 -s 4000 ${input.host}`;
          break;
        case "dig":
          cmdToRun = `dig ${input.host}.railway.internal +short aaaa`;
          break;
        case "curl":
          cmdToRun = `curl http://${input.host}:4000/api/trpc/local.hello`;
          break;
        case "uptime":
          cmdToRun = `uptime`;
          break;
        default:
          throw new Error(`Unknown command ${input.command}`);
      }

      return new Promise<{
        cmd: string;
        error: boolean;
        stdout: string;
        stderr: string;
      }>((resolve, reject) => {
        exec(cmdToRun, (error, stdout, stderr) => {
          if (error) {
            resolve({
              cmd: cmdToRun,
              error: true,
              stdout,
              stderr,
            });
            return;
          }
          resolve({
            cmd: cmdToRun,
            error: false,
            stdout,
            stderr,
          });
        });
      });
    }),

  poke: publicProcedure.mutation(async ({}) => {
    pokes += 1;
  }),

  resetPokes: publicProcedure.mutation(async ({}) => {
    pokes = 0;
  }),

  pokes: publicProcedure.query(({}) => {
    return { pokes };
  }),

  hello: publicProcedure.query(async () => {
    return { hello: `from ${ownIp()}` };
  }),
});
