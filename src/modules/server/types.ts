import type {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    RouteGenericInterface,
    RouteShorthandOptions
} from "fastify";
import type { ApplicationCore, IUserData } from "../../types.js";
import type { JwtPayload } from "jsonwebtoken";
import type { WSServer } from "../real-time/index.js";

export type RouteFunction<Server> = (http: Server, opts: unknown, done: () => void) => void;

/**
 * The server that provides HTTP capabilities to Archivian
 */
export type HTTPServer = FastifyInstance;
export type HTTPReply = FastifyReply;
export type HTTPRequest<Types extends RouteGenericInterface> = FastifyRequest<Types>;
export type RouteOpts = RouteShorthandOptions;
export type Route<Server> = RouteFunction<Server>;

declare module "fastify" {

    interface FastifyInstance {
        core: ApplicationCore;
        io: WSServer;
    }

    export interface FastifyReply {

    }

    export interface FastifyRequest {
        user: JwtPayload & IUserData;
    }

    export interface FastifyContextConfig {
        /**
         * Enable JWT authentication for this route.
         */
        jwtAuth: boolean;
    }
}

/**
 * A function that will handle authentication.
 * @throws {Error} If authentication fails.
 * @returns Void if all was okay. During the auth, you could be decorating the request/response with the parsed data (e.g. the decoded JWT)
 */
export type AuthHandler = (req: HTTPRequest<{ Headers: { ["authorization"]?: string, ["user-agent"]?: string } }>, res: HTTPReply) => Promise<void>;