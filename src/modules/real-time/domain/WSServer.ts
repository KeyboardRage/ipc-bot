import type { ServerOptions } from "socket.io";
import type { Server as HTTPSServer } from "https";
import type { Http2SecureServer, Http2Server } from "http2";
import type { FastifyInstance } from "fastify";
import { Server } from "socket.io";

type TServerInstance = FastifyInstance | HTTPSServer | Http2SecureServer | Http2Server;

export default class WSServer extends Server {
    constructor(srv?: TServerInstance | number, opts?: Partial<ServerOptions>) {
        // @ts-expect-error - Whatever, I don't care, it is fine
        super(srv, opts);
    }


}