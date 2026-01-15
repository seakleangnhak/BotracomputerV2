/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Node.js server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://qwik.dev/docs/deployments/node/
 *
 */
import { createQwikCity } from "@builder.io/qwik-city/middleware/node";
import qwikCityPlan from "@qwik-city-plan";
import render from "./entry.ssr";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

const DEFAULT_PORT = 4173;

const parsePorts = (value: string): number[] =>
  value
    .split(",")
    .map((port) => port.trim())
    .filter(Boolean)
    .map((port) => Number(port))
    .filter((port) => Number.isInteger(port) && port > 0);

const portsFromEnv = parsePorts(process.env.PORTS ?? "");
const portsFromPort = parsePorts(process.env.PORT ?? "");
const ports = portsFromEnv.length
  ? portsFromEnv
  : portsFromPort.length
    ? portsFromPort
    : [DEFAULT_PORT];

const uniquePorts = Array.from(new Set(ports));

const { router, notFound, staticFile } = createQwikCity({
  render,
  qwikCityPlan,
  static: {
    cacheControl: "public, max-age=31536000, immutable",
  },
});

const handleRequest = (req: IncomingMessage, res: ServerResponse) => {
  staticFile(req, res, () => {
    router(req, res, () => {
      notFound(req, res, () => {});
    });
  });
};

uniquePorts.forEach((port) => {
  const server = createServer(handleRequest);
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Node server listening on http://localhost:${port}`);
  });
});
