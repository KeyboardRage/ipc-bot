import type { OriginFunction } from "@fastify/cors";

export const OriginSetupFn: OriginFunction = (origin, cb) => {
    // Domains we allow connections & requests from
    const allowedOrigins = ["cyac.me", "cyberac.me", "https://cyac-os-prod.cdbabmaina.workers.dev"];

    // If development, also allow localhost
    if (process.env.NODE_ENV === "development") allowedOrigins.push("localhost", "127.0.0.1");

    if (!origin || allowedOrigins.some(allowed => origin.includes(allowed))) {
        cb(null, true);
    } else {
        cb(new Error("Not allowed by CORS"), false);
    }
}